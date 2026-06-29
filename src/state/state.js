// ===========================================================================
// THE SINGLE STATE MODULE.
//
// Every read and write of persisted team state flows through this file. There
// is exactly one localStorage read (`loadState`) and one localStorage write
// (`persist`). Phase 2 adds a sync-to-Apps-Script call inside `persist` — and
// nowhere else — so the dashboard wiring is a one-file change.
//
// All mutators take the current state, return a NEW state object, append any
// required events, and recompute quest/tier gating. The React hook
// (useTeamState) is a thin wrapper that calls persist() after each mutation.
// ===========================================================================

import {
  STORAGE_KEY,
  STATE_VERSION,
  MENTOR_CODE,
  TIER_ORDER,
  RUNLOG_PASS,
  RUNLOG_N,
  ANSWER_MIN,
} from './config.js';
import { gatedQuests, optionalQuests, getQuest } from './quests.js';

// ---- time -----------------------------------------------------------------

/** ISO timestamp for events + completedAt. Sortable and Sheet-friendly. */
function nowIso() {
  return new Date().toISOString();
}

// ---- shape ----------------------------------------------------------------

function emptyLadder(ladderId) {
  const base = { progress: {} };
  if (ladderId === 'veteran') base.tier = 'none'; // 'none' = only bronze open
  return base;
}

/**
 * Light heuristic for the INITIAL value of deviceCanCapture (per device). The
 * menu toggle is the real source of truth and overrides this. True on
 * iPad/iPhone/Android or touch devices with a coarse pointer; false otherwise
 * (desktop/Windows).
 */
function detectCanCapture() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return true;
  // iPadOS 13+ reports as "Macintosh" but has touch points.
  if (/Macintosh/.test(ua) && (navigator.maxTouchPoints || 0) > 1) return true;
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (coarse && (navigator.maxTouchPoints || 0) > 0) return true;
  }
  return false;
}

export function defaultState() {
  return {
    version: STATE_VERSION,
    team: null, // { name, createdAt, dailyLog } — null until onboarding completes
    activeLadder: 'rookie',
    ladders: {
      rookie: emptyLadder('rookie'),
      veteran: emptyLadder('veteran'),
    },
    needsMentor: false,
    // Per-device setting (top level, sibling to team/ladders): does THIS device
    // have a camera to film the robot? When false, evidence criteria are
    // optional (non-gating). The menu toggle overrides this initial guess.
    deviceCanCapture: detectCanCapture(),
    // Per-device: has the first-run site tour been seen on THIS device? Set true
    // on finish/skip so it never auto-launches again here. Menu re-open ignores it.
    seenTour: false,
    // Per-device UI: the local date ('YYYY-MM-DD') on which the "set up today's
    // roles" bar was dismissed. Resets naturally each new day.
    setupBarDismissedOn: '',
    events: [], // append-only — see appendEvent()
  };
}

/** Local calendar date as 'YYYY-MM-DD' (NOT UTC) — the key for team.dailyLog. */
export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** A fresh, all-blank daily check-in entry. */
function blankDayEntry() {
  return {
    roles: { coder: '', operator: '', protoBuilder: '', planner: '' },
    reflection: '',
    updatedAt: nowIso(),
  };
}

// ---- persistence (the ONLY storage I/O) -----------------------------------

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return normalize(JSON.parse(raw));
  } catch (err) {
    console.warn('[fll-camp] could not load state, starting fresh:', err);
    return defaultState();
  }
}

/**
 * The single write point. Phase 2: after the localStorage write, fire a
 * non-blocking POST to the Apps Script endpoint here (state.events +
 * progress snapshot). Keep this the ONLY place that persists state.
 */
export function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[fll-camp] could not persist state:', err);
  }
  // --- PHASE 2 SYNC HOOK (single integration point) ------------------------
  // syncToAppsScript(state); // POST { team, activeLadder, ladders, events }
  // -------------------------------------------------------------------------
  return state;
}

/** Merge a loaded blob onto defaults so older/partial saves stay valid. */
function normalize(loaded) {
  // Discard any incompatible shape (e.g. a stray v1 blob) safely — no crash,
  // no migration. No student data exists yet, so a clean reset is fine.
  if (!loaded || loaded.version !== STATE_VERSION) return defaultState();

  const base = defaultState();
  const state = {
    ...base,
    ...loaded,
    team: loaded.team ?? null,
    ladders: {
      rookie: { ...emptyLadder('rookie'), ...(loaded.ladders?.rookie ?? {}) },
      veteran: { ...emptyLadder('veteran'), ...(loaded.ladders?.veteran ?? {}) },
    },
    needsMentor: Boolean(loaded.needsMentor),
    // Preserve a previously-saved device setting; otherwise seed from heuristic.
    deviceCanCapture:
      typeof loaded.deviceCanCapture === 'boolean' ? loaded.deviceCanCapture : detectCanCapture(),
    seenTour: typeof loaded.seenTour === 'boolean' ? loaded.seenTour : false,
    setupBarDismissedOn:
      typeof loaded.setupBarDismissedOn === 'string' ? loaded.setupBarDismissedOn : '',
    events: Array.isArray(loaded.events) ? loaded.events : [],
  };
  // A team loaded from an older save may predate dailyLog — backfill it.
  if (state.team && (typeof state.team.dailyLog !== 'object' || state.team.dailyLog === null)) {
    state.team = { ...state.team, dailyLog: {} };
  }
  if (state.activeLadder !== 'veteran') state.activeLadder = 'rookie';
  recomputeAll(state);
  return state;
}

// ---- gating / status recomputation ----------------------------------------

/** Is an evidence blob actually attached? (device-independent — for hasEvidence) */
function evidencePresent(st) {
  return typeof st?.idbKey === 'string' && st.idbKey.length > 0;
}

/**
 * Is one criterion satisfied, given its definition (from quests.js) and its
 * stored state (from progress.criteria[idx])? This is the single source of
 * truth for completion — exported so the UI shows the same per-criterion state.
 *
 * `deviceCanCapture` (default true) makes evidence non-gating on no-camera
 * devices: when false, an evidence criterion is treated as satisfied so it
 * never blocks quest completion. A blob can still be attached optionally.
 */
export function isCriterionSatisfied(def, st, deviceCanCapture = true) {
  if (!def) return false;
  switch (def.type) {
    case 'check':
      return st?.done === true;
    case 'runlog': {
      const runs = Array.isArray(st?.runs) ? st.runs : [];
      const hits = runs.filter((r) => r?.result === 'hit').length;
      return hits >= (def.pass ?? RUNLOG_PASS);
    }
    case 'evidence':
      return deviceCanCapture === false ? true : evidencePresent(st);
    case 'answer':
      return typeof st?.text === 'string' && st.text.trim().length >= (def.min ?? ANSWER_MIN);
    default:
      return false;
  }
}

function isComplete(progress, quest, deviceCanCapture) {
  if (!quest) return false;
  return quest.criteria.every((def, idx) =>
    isCriterionSatisfied(def, progress?.criteria?.[idx], deviceCanCapture)
  );
}

/**
 * Does this quest have at least one evidence blob actually attached? This is
 * device-INDEPENDENT (true only when a blob exists), so a dashboard can treat
 * missing evidence on no-camera devices as neutral rather than incomplete.
 */
function computeHasEvidence(progress, quest) {
  if (!quest) return false;
  return quest.criteria.some(
    (def, idx) => def.type === 'evidence' && evidencePresent(progress?.criteria?.[idx])
  );
}

function ensureProgress(ladderState, questId) {
  if (!ladderState.progress[questId]) {
    ladderState.progress[questId] = { status: 'locked', criteria: {}, completedAt: null };
  }
  return ladderState.progress[questId];
}

/** How many tiers (beyond the always-open bronze) are unlocked. */
function unlockedTierRank(tierField) {
  switch (tierField) {
    case 'platinum':
      return 3;
    case 'gold':
      return 2;
    case 'silver':
      return 1;
    // 'bronze' and 'none' both mean: only bronze is open
    default:
      return 0;
  }
}

/**
 * Recompute every quest's status (locked | available | complete) for one
 * ladder from criteria + unlock rules. Idempotent and safe to run on load.
 */
function recomputeLadder(state, ladderId) {
  const ladderState = state.ladders[ladderId];
  const gated = gatedQuests(ladderId);

  // Pass 1: completeness + derived hasEvidence flag (dashboard-readable).
  for (const quest of gated) {
    const prog = ensureProgress(ladderState, quest.id);
    prog.hasEvidence = computeHasEvidence(prog, quest);
    if (isComplete(prog, quest, state.deviceCanCapture)) {
      prog.status = 'complete';
      if (!prog.completedAt) prog.completedAt = nowIso();
    } else {
      prog.completedAt = null;
      // Demote a previously-complete quest so Pass 2 (which skips 'complete'
      // quests) can recompute its availability. Reachable when a criterion is
      // undone, or when turning deviceCanCapture back on re-requires evidence.
      if (prog.status === 'complete') prog.status = 'available';
    }
  }

  // Pass 2: availability for not-yet-complete gated quests.
  const tierRankUnlocked = unlockedTierRank(ladderState.tier);
  gated.forEach((quest, i) => {
    const prog = ladderState.progress[quest.id];
    if (prog.status === 'complete') return;

    if (ladderId === 'veteran') {
      const tierIdx = TIER_ORDER.indexOf(quest.tier);
      if (tierIdx > tierRankUnlocked) {
        prog.status = 'locked';
        return;
      }
      const prev = gated[i - 1];
      const firstOfTier = !prev || prev.tier !== quest.tier;
      prog.status =
        firstOfTier || ladderState.progress[prev.id]?.status === 'complete'
          ? 'available'
          : 'locked';
    } else {
      // Rookie: pure sequential, no sign-offs.
      const prev = gated[i - 1];
      prog.status =
        i === 0 || ladderState.progress[prev.id]?.status === 'complete'
          ? 'available'
          : 'locked';
    }
  });

  // Optional quests: ungated, unlocked once their `unlockAfter` quest is done.
  for (const quest of optionalQuests(ladderId)) {
    const prog = ensureProgress(ladderState, quest.id);
    prog.hasEvidence = computeHasEvidence(prog, quest);
    if (isComplete(prog, quest, state.deviceCanCapture)) {
      prog.status = 'complete';
      if (!prog.completedAt) prog.completedAt = nowIso();
    } else {
      prog.completedAt = null;
      const gate = quest.unlockAfter;
      const gateMet = !gate || ladderState.progress[gate]?.status === 'complete';
      prog.status = gateMet ? 'available' : 'locked';
    }
  }
}

function recomputeAll(state) {
  recomputeLadder(state, 'rookie');
  recomputeLadder(state, 'veteran');
}

// ---- events (append-only) -------------------------------------------------

function appendEvent(state, type, extra = {}) {
  state.events.push({
    ts: nowIso(),
    type,
    ladder: extra.ladder ?? state.activeLadder,
    teamName: state.team?.name ?? '',
    ...extra,
  });
}

// ---- immutability helper --------------------------------------------------

function clone(state) {
  return JSON.parse(JSON.stringify(state));
}

// ===========================================================================
// MUTATORS — each returns a NEW, recomputed state. Persist via the hook.
// ===========================================================================

export function createTeam(state, { name, track }) {
  const next = clone(state);
  const ladder = track === 'veteran' ? 'veteran' : 'rookie';
  next.team = { name: name.trim(), createdAt: nowIso(), dailyLog: {} };
  next.activeLadder = ladder;
  recomputeAll(next);
  appendEvent(next, 'team_created', { ladder });
  return next;
}

export function renameTeam(state, name) {
  const next = clone(state);
  if (next.team) next.team.name = name.trim();
  return next;
}

export function switchTrack(state, track) {
  const next = clone(state);
  next.activeLadder = track === 'veteran' ? 'veteran' : 'rookie';
  recomputeAll(next);
  return next;
}

/**
 * Shared tail for every criterion mutation: recompute, then log a
 * `quest_complete` event if (and only if) this change just completed the quest.
 */
function afterCriterionChange(next, ladderId, questId, wasComplete) {
  recomputeLadder(next, ladderId);
  const nowComplete = next.ladders[ladderId].progress[questId].status === 'complete';
  if (!wasComplete && nowComplete) {
    appendEvent(next, 'quest_complete', { ladder: ladderId, questId });
  }
}

/** check: flip the tick. */
export function toggleCheck(state, ladderId, questId, idx) {
  const next = clone(state);
  const prog = ensureProgress(next.ladders[ladderId], questId);
  const wasComplete = prog.status === 'complete';
  const done = !(prog.criteria[idx]?.done === true);
  prog.criteria[idx] = { type: 'check', done };
  afterCriterionChange(next, ladderId, questId, wasComplete);
  return next;
}

/** runlog: append one Hit/Miss run (capped at n) and log `run_logged`. */
export function logRun(state, ladderId, questId, idx, result) {
  const def = getQuest(ladderId, questId)?.criteria?.[idx];
  const n = def?.n ?? RUNLOG_N;
  const pass = def?.pass ?? RUNLOG_PASS;
  const cur = state.ladders[ladderId]?.progress?.[questId]?.criteria?.[idx];
  if (Array.isArray(cur?.runs) && cur.runs.length >= n) return state; // at cap — no-op

  const next = clone(state);
  const prog = ensureProgress(next.ladders[ladderId], questId);
  const wasComplete = prog.status === 'complete';
  const st = prog.criteria[idx];
  const runs = Array.isArray(st?.runs) ? [...st.runs] : [];
  runs.push({ result: result === 'hit' ? 'hit' : 'miss' });
  prog.criteria[idx] = { type: 'runlog', runs, n, pass };

  appendEvent(next, 'run_logged', { ladder: ladderId, questId, result: runs[runs.length - 1].result });
  afterCriterionChange(next, ladderId, questId, wasComplete);
  return next;
}

/** runlog: undo the last logged run (no event; events stay append-only). */
export function popRun(state, ladderId, questId, idx) {
  const cur = state.ladders[ladderId]?.progress?.[questId]?.criteria?.[idx];
  if (!Array.isArray(cur?.runs) || cur.runs.length === 0) return state;

  const next = clone(state);
  const prog = ensureProgress(next.ladders[ladderId], questId);
  const wasComplete = prog.status === 'complete';
  const st = prog.criteria[idx];
  prog.criteria[idx] = { ...st, runs: st.runs.slice(0, -1) };
  afterCriterionChange(next, ladderId, questId, wasComplete);
  return next;
}

/** answer: set the textarea text. */
export function setAnswer(state, ladderId, questId, idx, text) {
  const next = clone(state);
  const prog = ensureProgress(next.ladders[ladderId], questId);
  const wasComplete = prog.status === 'complete';
  prog.criteria[idx] = { type: 'answer', text: text ?? '' };
  afterCriterionChange(next, ladderId, questId, wasComplete);
  return next;
}

/**
 * evidence: record the IndexedDB reference for a captured photo/video and log
 * `evidence_captured`. The blob itself is written to IndexedDB by the media
 * module BEFORE this is called — state.js never touches IndexedDB.
 */
export function setEvidence(state, ladderId, questId, idx, { media, idbKey, capturedAt }) {
  const next = clone(state);
  const prog = ensureProgress(next.ladders[ladderId], questId);
  const wasComplete = prog.status === 'complete';
  prog.criteria[idx] = { type: 'evidence', media, idbKey, capturedAt };
  appendEvent(next, 'evidence_captured', { ladder: ladderId, questId, media });
  afterCriterionChange(next, ladderId, questId, wasComplete);
  return next;
}

/**
 * Returns a pending tier sign-off for the active veteran ladder, or null.
 * A sign-off is pending when a boundary quest is complete but its target tier
 * is not yet unlocked. Shape: { fromTier, toTier, questId }.
 */
export function pendingSignoff(state) {
  if (state.activeLadder !== 'veteran') return null;
  const ladderState = state.ladders.veteran;
  const unlocked = unlockedTierRank(ladderState.tier);
  for (const quest of gatedQuests('veteran')) {
    if (!quest.signoffTo) continue;
    const prog = ladderState.progress[quest.id];
    const targetIdx = TIER_ORDER.indexOf(quest.signoffTo);
    if (prog?.status === 'complete' && targetIdx > unlocked) {
      return { fromTier: quest.tier, toTier: quest.signoffTo, questId: quest.id };
    }
  }
  return null;
}

/**
 * Attempt a tier sign-off with a mentor code. On success, advances the veteran
 * tier, logs `tier_signoff`, and recomputes. Returns { ok, toTier }.
 */
/** Pure code check — lets the UI validate without touching state. */
export function isMentorCode(code) {
  return code === MENTOR_CODE;
}

export function signOff(state, toTier, code) {
  if (!isMentorCode(code)) return { ok: false, state };
  const next = clone(state);
  next.ladders.veteran.tier = toTier;
  recomputeLadder(next, 'veteran');
  appendEvent(next, 'tier_signoff', { ladder: 'veteran', tier: toTier });
  return { ok: true, toTier, state: next };
}

/**
 * Toggle the "needs a mentor" flag. Logs `mentor_requested` when raised and
 * `mentor_cleared` when lowered.
 */
export function toggleMentor(state) {
  const next = clone(state);
  next.needsMentor = !next.needsMentor;
  appendEvent(next, next.needsMentor ? 'mentor_requested' : 'mentor_cleared');
  return next;
}

/**
 * Set the per-device camera setting (source of truth, overrides the heuristic).
 * Recomputes both ladders because evidence gating depends on it: turning it off
 * can complete quests that only lacked evidence; turning it on re-requires it.
 * No event — this is a device setting, not a gate action.
 */
export function setDeviceCanCapture(state, value) {
  const next = clone(state);
  next.deviceCanCapture = !!value;
  recomputeAll(next);
  return next;
}

/** Mark the first-run site tour as seen (per device). No event, no recompute. */
export function setSeenTour(state, value = true) {
  const next = clone(state);
  next.seenTour = !!value;
  return next;
}

// ---- daily check-in (team.dailyLog) ---------------------------------------
// Roles + end-of-day reflection, keyed by local date. This is team data, so it
// rides the existing Phase 2 snapshot ({ team, ... }). No new event types: these
// are notes, not gate actions.

/** Ensure today's blank entry exists. No-op (same ref) if it already does. */
export function ensureDailyToday(state, dateKey) {
  if (state.team?.dailyLog?.[dateKey]) return state;
  const next = clone(state);
  if (!next.team) return next;
  if (!next.team.dailyLog) next.team.dailyLog = {};
  next.team.dailyLog[dateKey] = blankDayEntry();
  return next;
}

/** Set one role name for a given day. Autosaved as the kid types. */
export function setRole(state, dateKey, roleKey, value) {
  const next = clone(state);
  if (!next.team) return next;
  if (!next.team.dailyLog) next.team.dailyLog = {};
  const entry = next.team.dailyLog[dateKey] ?? blankDayEntry();
  entry.roles = { ...entry.roles, [roleKey]: value ?? '' };
  entry.updatedAt = nowIso();
  next.team.dailyLog[dateKey] = entry;
  return next;
}

/** Set the end-of-day reflection for a given day. Never gates anything. */
export function setReflection(state, dateKey, text) {
  const next = clone(state);
  if (!next.team) return next;
  if (!next.team.dailyLog) next.team.dailyLog = {};
  const entry = next.team.dailyLog[dateKey] ?? blankDayEntry();
  entry.reflection = text ?? '';
  entry.updatedAt = nowIso();
  next.team.dailyLog[dateKey] = entry;
  return next;
}

/** Remember that the "set up today's roles" bar was dismissed for this day. */
export function dismissSetupBar(state, dateKey) {
  const next = clone(state);
  next.setupBarDismissedOn = dateKey;
  return next;
}

// ---- selectors (read helpers, no mutation) --------------------------------

export function questStatus(state, ladderId, questId) {
  return state.ladders[ladderId]?.progress?.[questId]?.status ?? 'locked';
}

/** Current unlocked veteran tier field ('none' | 'bronze' | ... | 'platinum'). */
export function veteranTier(state) {
  return state.ladders.veteran?.tier ?? 'none';
}

/** Whether a veteran tier is unlocked (bronze is always open). */
export function isTierUnlocked(state, tierId) {
  return TIER_ORDER.indexOf(tierId) <= unlockedTierRank(state.ladders.veteran?.tier);
}

export function criteriaFor(state, ladderId, questId) {
  return state.ladders[ladderId]?.progress?.[questId]?.criteria ?? {};
}

/** The frontier quest: the first non-complete gated quest the team can work on. */
export function currentQuestId(state, ladderId) {
  const gated = gatedQuests(ladderId);
  const firstAvailable = gated.find(
    (q) => state.ladders[ladderId]?.progress?.[q.id]?.status === 'available'
  );
  if (firstAvailable) return firstAvailable.id;
  // All available are done — point at the last gated quest.
  return gated[gated.length - 1]?.id ?? null;
}

/** { done, total } for the gated quests of a ladder. */
export function progressCounts(state, ladderId) {
  const gated = gatedQuests(ladderId);
  const done = gated.filter(
    (q) => state.ladders[ladderId]?.progress?.[q.id]?.status === 'complete'
  ).length;
  return { done, total: gated.length };
}

export { getQuest };

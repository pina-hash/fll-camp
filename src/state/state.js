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

import { STORAGE_KEY, MENTOR_CODE, TIER_ORDER } from './config.js';
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

export function defaultState() {
  return {
    version: 'v1',
    team: null, // { name, createdAt } — null until onboarding completes
    activeLadder: 'rookie',
    ladders: {
      rookie: emptyLadder('rookie'),
      veteran: emptyLadder('veteran'),
    },
    needsMentor: false,
    events: [], // append-only — see appendEvent()
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
    events: Array.isArray(loaded.events) ? loaded.events : [],
  };
  if (state.activeLadder !== 'veteran') state.activeLadder = 'rookie';
  recomputeAll(state);
  return state;
}

// ---- gating / status recomputation ----------------------------------------

function criterionState(progress, idx) {
  return progress?.criteria?.[idx] === true;
}

function isComplete(progress, quest) {
  if (!quest) return false;
  return quest.criteria.every((_, idx) => criterionState(progress, idx));
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

  // Pass 1: completeness.
  for (const quest of gated) {
    const prog = ensureProgress(ladderState, quest.id);
    if (isComplete(prog, quest)) {
      prog.status = 'complete';
      if (!prog.completedAt) prog.completedAt = nowIso();
    } else {
      prog.completedAt = null;
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
    if (isComplete(prog, quest)) {
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
  next.team = { name: name.trim(), createdAt: nowIso() };
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
 * Toggle one self-check criterion. If this completes the quest, log a
 * `quest_complete` event. Status + downstream unlocks are recomputed.
 */
export function toggleCriterion(state, ladderId, questId, idx) {
  const next = clone(state);
  const ladderState = next.ladders[ladderId];
  const prog = ensureProgress(ladderState, questId);
  const wasComplete = prog.status === 'complete';

  prog.criteria[idx] = !prog.criteria[idx];
  recomputeLadder(next, ladderId);

  const nowComplete = next.ladders[ladderId].progress[questId].status === 'complete';
  if (!wasComplete && nowComplete) {
    appendEvent(next, 'quest_complete', { ladder: ladderId, questId });
  }
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

// ===========================================================================
// THE SINGLE STATE MODULE.
//
// Every read and write of persisted team state flows through this file. There
// is exactly one localStorage read (`loadState`) and one localStorage write
// (`persist`). Phase 2 adds a sync-to-Apps-Script call inside `persist` — and
// nowhere else — so the dashboard wiring is a one-file change.
//
// The Skill Hub is OPEN: nothing is locked, nothing is gated, there is no
// completion logic. Team data is the roster, the per-item strategy notes, and
// the daily check-in. All mutators take the current state and return a NEW one.
// ===========================================================================

import { STORAGE_KEY, STATE_VERSION, NOTE_MAX, ROSTER_MAX } from './config.js';
import { getItem } from './content.js';

// ---- time -----------------------------------------------------------------

/** ISO timestamp for events + updatedAt. Sortable and Sheet-friendly. */
function nowIso() {
  return new Date().toISOString();
}

/** Local calendar date as 'YYYY-MM-DD' (NOT UTC) — the key for team.dailyLog. */
export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ---- shape ----------------------------------------------------------------

export function defaultState() {
  return {
    version: STATE_VERSION,
    // { name, createdAt, members: [{ id, name }], dailyLog } — null until onboarding.
    // `members` is a roster the team keeps for itself: no auth, no gating. It is
    // the seam real student accounts drop into once emails are provisioned.
    team: null,
    // itemId -> { text, updatedAt }. The season's living strategy document:
    // one note per mission and per skill item, editable by anyone on the device.
    notes: {},
    needsMentor: false,
    // Per-device: has the first-run tour been seen HERE? Set true on finish/skip.
    seenTour: false,
    // Per-device UI: the local date the "set up today's roles" bar was dismissed.
    setupBarDismissedOn: '',
    events: [], // append-only — see appendEvent()
  };
}

/** A fresh, all-blank daily check-in entry. */
function blankDayEntry() {
  return {
    roles: { coder: '', operator: '', protoBuilder: '', planner: '' },
    reflection: '',
    updatedAt: nowIso(),
  };
}

let memberSeq = 0;
/** Roster ids only need to be unique within one team's list. */
function memberId() {
  memberSeq += 1;
  return `m${Date.now().toString(36)}${memberSeq}`;
}

// ---- persistence (the ONLY storage I/O) -----------------------------------

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return normalize(JSON.parse(raw));
  } catch (err) {
    console.warn('[fll-hub] could not load state, starting fresh:', err);
    return defaultState();
  }
}

/**
 * The single write point. Phase 2: after the localStorage write, fire a
 * non-blocking POST to the Apps Script endpoint here ({ team, notes, events }).
 * Keep this the ONLY place that persists state.
 */
export function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[fll-hub] could not persist state:', err);
  }
  // --- PHASE 2 SYNC HOOK (single integration point) ------------------------
  // syncToAppsScript(state); // POST { team, notes, events }
  // -------------------------------------------------------------------------
  return state;
}

/** Merge a loaded blob onto defaults so older/partial saves stay valid. */
function normalize(loaded) {
  // Discard any incompatible shape (e.g. a v2 camp-ladder blob) safely — no
  // crash, no migration. The camp ladder has no equivalent in the Skill Hub.
  if (!loaded || loaded.version !== STATE_VERSION) return defaultState();

  const base = defaultState();
  const state = {
    ...base,
    ...loaded,
    team: loaded.team ?? null,
    notes: typeof loaded.notes === 'object' && loaded.notes !== null ? loaded.notes : {},
    needsMentor: Boolean(loaded.needsMentor),
    seenTour: typeof loaded.seenTour === 'boolean' ? loaded.seenTour : false,
    setupBarDismissedOn:
      typeof loaded.setupBarDismissedOn === 'string' ? loaded.setupBarDismissedOn : '',
    events: Array.isArray(loaded.events) ? loaded.events : [],
  };
  // Backfill fields a partially-written team may be missing.
  if (state.team) {
    state.team = {
      ...state.team,
      members: Array.isArray(state.team.members) ? state.team.members : [],
      dailyLog:
        typeof state.team.dailyLog === 'object' && state.team.dailyLog !== null
          ? state.team.dailyLog
          : {},
    };
  }
  return state;
}

// ---- events (append-only) -------------------------------------------------

function appendEvent(state, type, extra = {}) {
  state.events.push({
    ts: nowIso(),
    type,
    teamName: state.team?.name ?? '',
    ...extra,
  });
}

// ---- immutability helper --------------------------------------------------

function clone(state) {
  return JSON.parse(JSON.stringify(state));
}

// ===========================================================================
// MUTATORS — each returns a NEW state. Persist via the hook.
// ===========================================================================

export function createTeam(state, { name, members = [] }) {
  const next = clone(state);
  next.team = {
    name: name.trim(),
    createdAt: nowIso(),
    members: members
      .map((m) => String(m ?? '').trim())
      .filter(Boolean)
      .slice(0, ROSTER_MAX)
      .map((n) => ({ id: memberId(), name: n })),
    dailyLog: {},
  };
  appendEvent(next, 'team_created', { memberCount: next.team.members.length });
  return next;
}

export function renameTeam(state, name) {
  const next = clone(state);
  if (next.team) next.team.name = name.trim();
  return next;
}

// ---- roster ---------------------------------------------------------------
// Informational only: no auth, no login, no gating. Prep for real accounts.

export function addMember(state, name) {
  const trimmed = String(name ?? '').trim();
  if (!trimmed) return state;
  const next = clone(state);
  if (!next.team) return next;
  if (!Array.isArray(next.team.members)) next.team.members = [];
  if (next.team.members.length >= ROSTER_MAX) return state;
  next.team.members.push({ id: memberId(), name: trimmed.slice(0, 40) });
  appendEvent(next, 'member_added');
  return next;
}

export function removeMember(state, id) {
  const next = clone(state);
  if (!next.team?.members) return next;
  next.team.members = next.team.members.filter((m) => m.id !== id);
  appendEvent(next, 'member_removed');
  return next;
}

// ---- strategy notes -------------------------------------------------------
// One free-text note per mission / skill item, keyed by item id. Autosaved as
// the team types, so no events are logged (they would be keystroke spam); the
// notes ride the Phase 2 snapshot instead.

export function setNote(state, itemId, text) {
  const next = clone(state);
  const trimmedText = String(text ?? '').slice(0, NOTE_MAX);
  if (trimmedText.length === 0) {
    delete next.notes[itemId];
  } else {
    next.notes[itemId] = { text: trimmedText, updatedAt: nowIso() };
  }
  return next;
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

/** Mark the first-run site tour as seen (per device). No event. */
export function setSeenTour(state, value = true) {
  const next = clone(state);
  next.seenTour = !!value;
  return next;
}

// ---- daily check-in (team.dailyLog) ---------------------------------------
// Roles + end-of-session reflection, keyed by local date. Team data, so it rides
// the Phase 2 snapshot. No event types: these are notes, not gate actions.

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

/** Set the end-of-session reflection for a given day. Never gates anything. */
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

/** The saved note text for an item ('' when none). */
export function noteText(state, itemId) {
  return state.notes?.[itemId]?.text ?? '';
}

/** Does this item have a non-empty strategy note? Drives the card flag. */
export function hasNote(state, itemId) {
  return (state.notes?.[itemId]?.text ?? '').trim().length > 0;
}

/** { done, total } — how many of a category's items have strategy notes. */
export function noteCounts(state, items) {
  const done = items.filter((item) => hasNote(state, item.id)).length;
  return { done, total: items.length };
}

export { getItem };

// ---------------------------------------------------------------------------
// useTeamState — the React-facing wrapper around the single state module.
//
// Components NEVER touch localStorage or build event objects directly. They call
// these action methods. Every action runs a mutator from state.js, then persists
// through the single write point. Phase 2 sync rides along in persist().
// ---------------------------------------------------------------------------

import { useCallback, useMemo, useState } from 'react';
import {
  loadState,
  persist,
  createTeam,
  renameTeam,
  addMember,
  removeMember,
  setNote,
  toggleMentor,
  setSeenTour,
  ensureDailyToday,
  setRole,
  setReflection,
  dismissSetupBar,
  noteText,
  hasNote,
  noteCounts,
} from './state.js';

export function useTeamState() {
  const [state, setState] = useState(() => loadState());

  // Run a mutator, persist the result (single write point), and re-render.
  const commit = useCallback((mutator) => {
    setState((prev) => persist(mutator(prev)));
  }, []);

  const actions = useMemo(
    () => ({
      createTeam: (info) => commit((s) => createTeam(s, info)),
      renameTeam: (name) => commit((s) => renameTeam(s, name)),

      // --- roster (informational; no auth, no gating) ---
      addMember: (name) => commit((s) => addMember(s, name)),
      removeMember: (id) => commit((s) => removeMember(s, id)),

      // --- strategy notes (the season's living strategy document) ---
      setNote: (itemId, text) => commit((s) => setNote(s, itemId, text)),

      toggleMentor: () => commit(toggleMentor),

      // --- first-run tour ---
      markTourSeen: () => commit((s) => setSeenTour(s, true)),

      // --- daily check-in (roles + reflection) ---
      ensureToday: (dateKey) => commit((s) => ensureDailyToday(s, dateKey)),
      setRole: (dateKey, roleKey, value) => commit((s) => setRole(s, dateKey, roleKey, value)),
      setReflection: (dateKey, text) => commit((s) => setReflection(s, dateKey, text)),
      dismissSetupBar: (dateKey) => commit((s) => dismissSetupBar(s, dateKey)),
    }),
    [commit]
  );

  return {
    state,
    ...actions,
    // selectors bound to current state for convenience
    noteText: (itemId) => noteText(state, itemId),
    hasNote: (itemId) => hasNote(state, itemId),
    noteCounts: (items) => noteCounts(state, items),
  };
}

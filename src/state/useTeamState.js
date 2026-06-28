// ---------------------------------------------------------------------------
// useTeamState — the React-facing wrapper around the single state module.
//
// Components NEVER touch localStorage or build event objects directly. They
// call these action methods. Every action runs a mutator from state.js, then
// persists through the single write point. Phase 2 sync rides along in
// persist() automatically — no component changes required.
// ---------------------------------------------------------------------------

import { useCallback, useMemo, useState } from 'react';
import {
  loadState,
  persist,
  createTeam,
  renameTeam,
  switchTrack,
  toggleCriterion,
  toggleMentor,
  signOff,
  isMentorCode,
  pendingSignoff,
  currentQuestId,
  progressCounts,
  questStatus,
  criteriaFor,
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
      switchTrack: (track) => commit((s) => switchTrack(s, track)),
      toggleCriterion: (ladderId, questId, idx) =>
        commit((s) => toggleCriterion(s, ladderId, questId, idx)),
      toggleMentor: () => commit(toggleMentor),
      // Validate synchronously (code-only, no state needed) so the boolean
      // return is reliable; persist only on success via the single write point.
      signOff: (toTier, code) => {
        const ok = isMentorCode(code);
        if (ok) commit((s) => signOff(s, toTier, code).state);
        return ok;
      },
    }),
    [commit]
  );

  return {
    state,
    ...actions,
    // selectors bound to current state for convenience
    pendingSignoff: pendingSignoff(state),
    currentQuestId: (ladderId) => currentQuestId(state, ladderId),
    progressCounts: (ladderId) => progressCounts(state, ladderId),
    questStatus: (ladderId, questId) => questStatus(state, ladderId, questId),
    criteriaFor: (ladderId, questId) => criteriaFor(state, ladderId, questId),
  };
}

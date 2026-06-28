// ---------------------------------------------------------------------------
// useTeamState — the React-facing wrapper around the single state module.
//
// Components NEVER touch localStorage, IndexedDB, or build event objects
// directly. They call these action methods. Every action runs a mutator from
// state.js, then persists through the single write point. Evidence capture is
// orchestrated here: blob -> media.js (IndexedDB), then the idbKey reference
// -> state.js. Phase 2 sync rides along in persist() automatically.
// ---------------------------------------------------------------------------

import { useCallback, useMemo, useState } from 'react';
import { EVIDENCE_MAX_BYTES } from './config.js';
import { putMedia, getMedia, mediaKey } from './media.js';
import {
  loadState,
  persist,
  createTeam,
  renameTeam,
  switchTrack,
  toggleCheck,
  logRun,
  popRun,
  setAnswer,
  setEvidence,
  toggleMentor,
  setDeviceCanCapture,
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

      // --- typed criterion actions ---
      toggleCheck: (ladderId, questId, idx) => commit((s) => toggleCheck(s, ladderId, questId, idx)),
      logRun: (ladderId, questId, idx, result) =>
        commit((s) => logRun(s, ladderId, questId, idx, result)),
      popRun: (ladderId, questId, idx) => commit((s) => popRun(s, ladderId, questId, idx)),
      setAnswer: (ladderId, questId, idx, text) =>
        commit((s) => setAnswer(s, ladderId, questId, idx, text)),

      // --- evidence: write blob to IndexedDB, then store the reference ---
      // Returns { ok, reason } so the UI can show a friendly rejection.
      captureEvidence: async (ladderId, questId, idx, file, media) => {
        if (!file) return { ok: false, reason: 'no-file' };
        if (file.size > EVIDENCE_MAX_BYTES) return { ok: false, reason: 'too-big' };
        const key = mediaKey(ladderId, questId, idx);
        try {
          await putMedia(key, file);
        } catch {
          return { ok: false, reason: 'store-failed' };
        }
        commit((s) =>
          setEvidence(s, ladderId, questId, idx, {
            media,
            idbKey: key,
            capturedAt: new Date().toISOString(),
          })
        );
        return { ok: true };
      },
      // Resolve an object URL for a stored blob (caller revokes it).
      getEvidenceUrl: async (idbKey) => {
        try {
          const blob = await getMedia(idbKey);
          return blob ? URL.createObjectURL(blob) : null;
        } catch {
          return null;
        }
      },

      toggleMentor: () => commit(toggleMentor),
      setDeviceCanCapture: (value) => commit((s) => setDeviceCanCapture(s, value)),
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

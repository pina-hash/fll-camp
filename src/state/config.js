// ---------------------------------------------------------------------------
// Single source of truth for app-wide constants.
// Change MENTOR_CODE here (one place) to rotate the tier sign-off code.
// ---------------------------------------------------------------------------

/** localStorage key for the entire app state blob. v2 = typed criteria gate. */
export const STORAGE_KEY = 'fll-camp-state-v2';

/** State schema version. Loads with a different version are discarded safely. */
export const STATE_VERSION = 'v2';

// ---- Criterion-type defaults (Workstream A gate redesign) -----------------

/** runlog: how many runs the kid logs, and how many hits are needed to pass. */
export const RUNLOG_N = 3;
export const RUNLOG_PASS = 2;

/** answer: minimum trimmed text length to count as satisfied. */
export const ANSWER_MIN = 8;

/** evidence: reject captures larger than this (~25 MB). */
export const EVIDENCE_MAX_BYTES = 25 * 1024 * 1024;

/** 4-digit code a mentor types to unlock the next tier at a tier boundary. */
export const MENTOR_CODE = '5669';

/** Expected length of the mentor code (drives the PIN input UI). */
export const MENTOR_CODE_LENGTH = 4;

/** The two tracks. Progress is namespaced per ladder so switching preserves both. */
export const LADDERS = ['rookie', 'veteran'];

/** Veteran tier order, low -> high. Used for gating + the medal climb. */
export const TIER_ORDER = ['bronze', 'silver', 'gold', 'platinum'];

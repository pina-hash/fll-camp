// ---------------------------------------------------------------------------
// Single source of truth for app-wide constants.
// ---------------------------------------------------------------------------

/** localStorage key for the entire app state blob. v3 = open Skill Hub. */
export const STORAGE_KEY = 'fll-season-state-v3';

/** State schema version. Loads with a different version are discarded safely. */
export const STATE_VERSION = 'v3';

/** The season this hub is built for. Shown in headers and the manifest copy. */
export const SEASON = 'BIOGLOW 2026–2027';

/** Max characters in one strategy note (per mission / per skill item). */
export const NOTE_MAX = 2000;

/** Max roster members a team can add. Roster is informational — never gates. */
export const ROSTER_MAX = 12;

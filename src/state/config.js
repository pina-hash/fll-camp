// ---------------------------------------------------------------------------
// Single source of truth for app-wide constants.
// Change MENTOR_CODE here (one place) to rotate the tier sign-off code.
// ---------------------------------------------------------------------------

/** localStorage key for the entire app state blob. */
export const STORAGE_KEY = 'fll-camp-state-v1';

/** 4-digit code a mentor types to unlock the next tier at a tier boundary. */
export const MENTOR_CODE = '5669';

/** Expected length of the mentor code (drives the PIN input UI). */
export const MENTOR_CODE_LENGTH = 4;

/** The two tracks. Progress is namespaced per ladder so switching preserves both. */
export const LADDERS = ['rookie', 'veteran'];

/** Veteran tier order, low -> high. Used for gating + the medal climb. */
export const TIER_ORDER = ['bronze', 'silver', 'gold', 'platinum'];

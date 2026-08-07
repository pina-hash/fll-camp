# CLAUDE.md — DBTI FLL Season Skill Hub (BIOGLOW 2026–2027)

> Keep this file current. When the schema, branding, content model, or Phase 2
> plan changes, update CLAUDE.md in the same change. It is the contract future
> work (especially the Phase 2 dashboard) relies on.

## Purpose

An **open, browsable season skill hub** for four competitive FLL teams in the
**BIOGLOW 2026–2027** season (SPIKE Prime). Teams meet **Fridays 4:30–6:00pm**
and **Saturdays 9:00–11:00am**. It runs on iPads and Windows laptops in a
browser and saves everything locally.

**Nothing is locked.** There are no tracks, no quest ladder, no sequential
unlocks, and no mentor sign-off codes — all of that was the summer-camp model and
is gone. Every team gets the whole season's content on day one and writes its own
**strategy notes** against it.

### Deployment model

Each of the four teams uses its own device(s). Separation is **per-device**
(one `localStorage` blob per browser). There is no multi-tenancy, no login, no
cross-team visibility — and none is planned for Phase 1.

## Stack

- **React + Vite**. Local path: `C:\fll-camp`.
- **GitHub Pages via GitHub Actions** (`.github/workflows/deploy.yml`): builds on
  push to `main` and deploys. The `dist/` folder is **not** committed — the Action
  builds it. `vite.config.js` sets `base: '/fll-camp/'` to match the repo name.
- **No backend in Phase 1.** All state is in `localStorage`.
- Mobile-first; targets iPad Safari and Windows Chrome. Large touch targets.
- Web app manifest + apple-touch icons so it installs to the home screen.
- **No offline-caching service worker** in this phase — season content changes and
  must never serve stale. Do not add one without revisiting this.

## The four categories (content model)

The hub is a tab row over four categories. Every category is a flat list of
**items**; every item opens a detail sheet that ends in a **team strategy notes**
box. That box is the only team-authored data an item carries.

| Category | id | Items | Source file |
|---|---|---|---|
| Robot Game Missions | `missions` | M01–M15 + Equipment Inspection + Precision Tokens | `src/state/missions.js` |
| Core Values | `core-values` | CV1–CV8 | `src/state/content.js` |
| Innovation Project | `project` | IP1–IP7 | `src/state/content.js` |
| Build & Programming | `build` | BP1–BP9 | `src/state/content.js` |

Shared item shape (one card component + one detail component renders all four):

```
{
  id,            // stable key — ALSO the strategy-note key. Never renumber.
  num,           // short badge ('M01', 'CV3', 'BP7')
  title,
  description,   // one plain line for the card
  pointsLabel?,  // missions only — compact points summary for the card
  scoring?,      // missions only — [{ label, points, bonus? }] in rulebook order
  caveats?,      // missions only — [string], conditions that zero or cap the score
  lesson?,       // non-mission items — the in-app teaching; must stand alone
  prompt,        // the question the strategy-notes box asks
  resourceId?    // optional key into resources.js for the "Go deeper" link
}
```

**Mission data provenance:** the official BIOGLOW Robot Game Rulebook (released
2026-08-04). `pointsLabel` is authored, not derived — several missions score "each"
and the rulebook piece counts are not restated here, so **no grand total is
claimed anywhere in the app**. If a rulebook update lands, edit `missions.js`
only; ids must stay stable or teams lose their notes.

## State module contract (the important part)

All reads/writes of persisted state flow through **one module**:

- `src/state/state.js` — the only file that touches `localStorage` (one read in
  `loadState`, one write in `persist`). All mutators live here and return new
  state. **The Phase 2 sync call goes inside `persist()` and nowhere else.**
- `src/state/useTeamState.js` — the React hook wrapping `state.js`. Components
  call its actions; they never touch storage or build event objects directly.
- `src/state/config.js` — `STORAGE_KEY`, `STATE_VERSION`, `SEASON`, `NOTE_MAX`,
  `ROSTER_MAX`.
- `src/state/missions.js` — BIOGLOW robot game content.
- `src/state/content.js` — the four `CATEGORIES` + the three non-mission item
  lists, plus `getItem` / `getCategory` lookups.
- `src/state/resources.js` — all external "Go deeper" deep links + mentor-page
  links + attribution string, in one place.
- `src/state/troubleshooter.js` — "Stuck?" symptom/checklist content.

### Persistence schema

`localStorage` key: **`fll-season-state-v3`** (`STATE_VERSION = 'v3'`). On load,
any blob whose `version` !== `'v3'` is discarded safely (no migration, no crash).
A leftover `fll-camp-state-v2` camp-ladder blob is simply ignored — the ladder has
no equivalent here.

```
{
  version: 'v3',
  team: {
    name,
    createdAt,
    members: [{ id, name }],   // roster — informational only, see below
    dailyLog                   // see DailyLog
  } | null,                    // null until onboarding
  notes: { [itemId]: { text, updatedAt } },   // the season strategy document
  needsMentor: boolean,
  seenTour: boolean,           // per-device; first-run tour seen here
  setupBarDismissedOn: string, // per-device; local date the setup bar was dismissed
  events: Event[]              // append-only
}

// Session check-in (Roles + reflection), keyed by LOCAL date 'YYYY-MM-DD'. Team
// data, so it rides the Phase 2 snapshot. No event types. todayKey() (state.js)
// returns the key; a new day starts a fresh entry, old days are kept.
DailyLog = { [dateKey:string]: {
  roles: { coder, operator, protoBuilder, planner },  // free text, none required
  reflection: string,                                  // end-of-session note
  updatedAt: ISOString
} }
```

**Roster (`team.members`)** — a plain add/remove list of names. **No auth, no
login, no gating**: it exists so the team can see itself, and it is the seam real
student accounts drop into once emails are provisioned. `ROSTER_MAX` caps it at
12. Editable at onboarding and any time from the team menu.

**Strategy notes (`notes`)** — one free-text note per item id, capped at
`NOTE_MAX` (2000 chars), autosaved as the team types, editable by anyone on the
device at any time. This is the season's living strategy document. An empty note
deletes its key rather than storing `''`.

### Event-log contract (dashboard-ready)

`events` is **append-only**. This array plus the `team` + `notes` snapshot is what
Phase 2 POSTs to a Google Sheet.

```
Event = { ts, type, teamName, memberCount? }

type ∈ {
  'team_created',      // onboarding; carries memberCount
  'member_added',
  'member_removed',
  'mentor_requested',  // needsMentor toggled ON
  'mentor_cleared'     // needsMentor toggled OFF
}
```

Strategy notes and the daily check-in deliberately log **no events** — they
autosave on every keystroke, so events would be keystroke spam. They ride the
snapshot instead.

## Phase 2 plan (not in this repo yet)

1. **Sync → Google Sheet via Apps Script.** Add a `fetch` POST inside `persist()`
   in `state.js` (the single write point) that sends `{ team, notes, events }` to
   a deployed Apps Script Web App. Make it non-blocking / best-effort so local use
   never breaks offline.
2. **Mentor dashboard** reads that Sheet to show each team's roster, which
   missions have a written plan, and which teams have `needsMentor = true`.

Because every write already funnels through `persist()`, wiring sync is a
one-file change.

## Resources contract

- Non-mission items teach with an in-app `lesson`; missions teach with their
  scoring breakdown. Either way the app stands alone — kids never *need* to leave.
- `src/state/resources.js` is the **single source of truth for every external
  link**. `RESOURCES` is keyed by a stable resource `id`; everything that points
  off-app references an entry by id so nothing is ever duplicated.

  ```
  RESOURCES[id] = {
    id, title, blurb,
    source: 'PrimeLessons' | 'FLL Tutorials',
    url,                      // verified deep link (never a homepage)
    topics: TopicKey[],       // browse-topic keys ([] = not surfaced on the library page)
    audience: 'student' | 'mentor'
  }
  ```

  Also exported: `TOPICS`, `MENTOR_LINK_IDS`, `ATTRIBUTION`, and helpers
  `resourceById(id)`, `resourcesForTopic(topicKey)`, `mentorLinks()`.
- **Three consumers, all by id:** an item's `resourceId` → "Go deeper" deep link
  (optional), the student **Resource Library** page, and the mentor page.
- **Resource Library** (hash route `#/resources`) — pure free-browse: no gating,
  no progress. Topics are banded section headers; under each, resource cards open
  the deep link in a new tab. Reachable from the menu and from a slim on-hub bar.
- `/mentor-resources` (hash route `#/mentor-resources`) lists every item that has
  a deep link, grouped by category, plus the mentor-only links.
- **Link policy:** every configured URL was verified to return 200 (2026-06-29).
  If one dies, fall back to the relevant index (`prime-index` Lessons.html or
  `fllt-index` category.html) and add `// TODO verify-link`. Never ship a dead
  link. Link only — never copy PrimeLessons / FLL Tutorials content into the app.

## Tour + session check-in

- **First-run site tour** (`SiteTour.jsx`). A centered modal carousel (6 steps,
  progress dots, Back/Next, Skip + X, swipe + arrow keys). Each step shows a small
  CSS-built **echo** of a real element (no images/screenshots). Gated by the
  per-device `seenTour` flag: auto-launches once when a team first reaches the hub;
  finish/skip/X/Esc/backdrop all call `markTourSeen`. The menu item **"How This
  Works"** reopens it any time, independent of the flag.
- **Roles + Session Check-In** (`TodayCheckin.jsx`, hash route `#/today`). Roles
  (Coder / Operator / Prototype Builder / Planner) + an end-of-session reflection,
  autosaved into `team.dailyLog[todayKey()]` via state.js mutators
  (`ensureDailyToday`, `setRole`, `setReflection`). Reuses the `DailyRhythm`
  component, which now shows the **Friday 4:30–6:00pm** and **Saturday
  9:00–11:00am** session shapes. Access: a menu item **"Session Roles"** and a
  slim, dismissible on-hub **setup bar**. Stuck + Request a Mentor remain the only
  two sticky bottom buttons.

## Branding tokens (see `src/styles/tokens.css`)

- Black `#0D0D0D`, gold `#F5B800` (accents `#C49200`, `#FFF8D6`, `#F0E080`).
- IDEA green `#1DB35A` (dark `#167540`, tint `#EBF7F1`, mid `#9ECFB4`).
- Fonts: **Oswald** (display/headers), **Inter** (body), via Google Fonts.
- Black headers, gold accents, green for "noted / go" states.

## Project layout

```
src/
  main.jsx              app entry
  App.jsx               screen orchestration + overlays
  state/
    config.js           constants (STORAGE_KEY, SEASON, NOTE_MAX, ROSTER_MAX)
    missions.js         BIOGLOW robot game content (M01–M15 + match basics)
    content.js          the four CATEGORIES + Core Values / Project / Build items
    resources.js        SINGLE source of truth for external links
    troubleshooter.js   "Stuck?" content
    state.js            SINGLE state module (only localStorage I/O + all mutators)
    useTeamState.js     React hook over state.js
  components/           Onboarding, RosterEditor, Hub, MissionCard, MissionDetail,
                        Troubleshooter, Menu, MentorResources, ResourceLibrary,
                        TodayCheckin, SiteTour, DailyRhythm, Modal
  styles/               tokens.css (branding), app.css
public/
  manifest.webmanifest, icons/   (PWA install assets)
scripts/generate-icons.mjs       (regenerate PNG icons from icon.svg)
.github/workflows/deploy.yml     (Pages build + deploy)
```

## Known debt

`src/styles/app.css` still carries rules for the removed camp ladder
(`.quest-card`, `.climb*`, `.tier*`, `.signoff-banner`, `.criterion`, `.runlog`,
`.evidence`, `.mentor-gate`, `.codeinput`, `.track-card`). Nothing references
them any more — they are dead weight, not a bug. Safe to delete in a follow-up
sweep; check `.criteria` / `.checklist` (still used by the Troubleshooter) and
`.answer__input` (still used by notes + the reflection box) before cutting.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build
- `npm run icons` — regenerate icons (needs `npm i -D sharp` first)

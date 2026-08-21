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
- **`public/build/comp-bot-manual.pdf` (21.9 MB) ships with the build.** It is by
  far the largest asset in the repo and is served from our own origin. It is
  fetched only when a team opens `#/build`, never on first paint, so it does not
  slow the hub down — but with no service worker it is re-fetched whenever the
  browser's HTTP cache misses. That is the accepted trade for not depending on
  someone else's Google Drive.

## The seven categories (content model)

The hub is a tab row over **seven** categories. Each category declares a `kind`
that says how it renders and what it stores:

- **`kind: 'items'`** — the original pattern, used by six categories. A flat list
  of **items**; every item opens a detail sheet that ends in a **team strategy
  notes** box. That box is the only team-authored data an item carries.
- **`kind: 'media'`** — used by the one Video & Resource Library category. A
  curated jump-off list of external links. **No strategy notes, no detail sheet,
  no team data of any kind**, so its entries never enter `ITEM_INDEX` and are not
  reachable through `getItem` / `ALL_ITEMS`.

| Category | id | kind | Contents | Source file |
|---|---|---|---|---|
| Meet the Robot | `robot` | items | ROBOT1–ROBOT6 | `src/state/content.js` |
| Robot Game Missions | `missions` | items | M01–M15 + Equipment Inspection + Precision Tokens | `src/state/missions.js` |
| Core Values | `core-values` | items | CV1–CV8 | `src/state/content.js` |
| Innovation Project | `project` | items | IP1–IP7 | `src/state/content.js` |
| Build & Programming | `build` | items | BP1–BP9 | `src/state/content.js` |
| Mechanisms Library | `mechanisms` | items | MECH1–MECH7 | `src/state/content.js` |
| Video & Resource Library | `media` | media | 11 external videos + PDF guides | `src/state/resources.js` (`MEDIA_ITEMS`) |

`content.js` also exports **`ITEM_CATEGORIES`** — `CATEGORIES` filtered to
`kind === 'items'`. Anything that walks categories expecting notes, items, or
`resourceId` must use that, not `CATEGORIES` (the mentor page does).

Shared item shape for the six `items` categories (one card component + one
detail component renders all six):

```
{
  id,            // stable key — ALSO the strategy-note key. Never renumber.
  num,           // short badge ('M01', 'CV3', 'BP7', 'MECH4', 'ROBOT1')
  title,
  description,   // one plain line for the card
  pointsLabel?,  // missions only — compact points summary for the card
  scoring?,      // missions only — [{ label, points, bonus? }] in rulebook order
  caveats?,      // missions only — [string], conditions that zero or cap the score
  lesson?,       // non-mission items — the in-app teaching; must stand alone
  fits?,         // mechanisms only — the "Missions this fits" line: one sentence
                 // naming the BIOGLOW missions whose physical demand it matches
  prompt,        // the question the strategy-notes box asks
  resourceId?,   // optional key into resources.js for the "Go deeper" link
  secondaryResourceId?  // optional second link, rendered under the primary one
}
```

An item may carry **two** deep links: `resourceId` is the primary, and
`secondaryResourceId` an optional lower-billing follow-up. Always resolve them
with **`itemResources(item)`** (resources.js) — never by reading the two fields
directly — so the detail sheet and the mentor page can't disagree. Only ROBOT4
uses the second slot today.

**Mechanisms Library** (`mechanisms`) is a plain `items` category — same card,
same detail sheet, same strategy note keyed by item id, same `ITEM_INDEX`
inclusion. Two things are specific to it: every item carries `fits` (rendered as
a green "Missions this fits" block under the lesson, `.fits` in app.css), and all
seven share one `resourceId` — `robot-designs` — because the items are
*conceptual explainers*, not step-by-step builds, and the worked builds live at
the PrimeLessons robot-design page. If a mechanism's `fits` line names a mission,
spell it `M09 Research Platform` — number plus the exact rulebook title from
`missions.js`.

**Meet the Robot** (`robot`) is a plain `items` category and sits **first** in
`CATEGORIES` — its tagline promises "start here", so it leads the tab row. Note
that the landing tab is still hardcoded `useState('missions')` in `App.jsx`, not
`CATEGORIES[0]`; `CATEGORIES[0]` is only the fallback for an unknown id in
`getCategory` / `Hub`. Change both if you want the app to open on the robot tab.
ROBOT3's legal-sensor list (force/touch, colour, distance, gyro) comes from the
Robot Game Rulebook's equipment section, which this repo does not carry — it was
supplied for this content, so re-check it against the rulebook before a season
briefing. ROBOT6's numbers are the `INSPECT` item's in `missions.js` (one launch
area, under 12 in, 20 points) and must stay in step with it. ROBOT4's primary
link is the official season build manual (`comp-bot-manual`) with the
PrimeLessons robot-design page demoted to `secondaryResourceId` — see the
at-risk warning in the link policy below.

Media entry shape for the `media` category (see `MEDIA_ITEMS` in `resources.js`):

```
{
  id,          // React key only — NO team data is stored against it
  kind,        // 'video' | 'guide' — drives the leading marker: ▶ play vs "Guide" badge
  title,       // authored, kid-facing label (not always the raw upload title)
  subtitle?,   // one line of context (e.g. "General coaching content, not season-specific")
  source,      // the creator: YouTube channel name, or PrimeLessons / FLL Tutorials
  url,         // verified deep link
  topics,      // MEDIA_TOPICS keys — an entry MAY carry more than one
  series?,     // MEDIA_SERIES id grouping a sequential run
  step?        // 1-based position within that series
}
```

**Media UI** (`MediaList.jsx`, rendered inline by `Hub.jsx` when
`category.kind === 'media'`). A row of **multi-select toggle chips** sits above
the list — one per `MEDIA_TOPICS` entry, **all active by default**; an entry shows
if it carries **any** active topic, so a multi-tagged entry appears under either
chip. With every chip off the list is empty and an inline note says so. After
filtering, consecutive entries sharing a `series` id are collected into one
numbered block under the series header, so a sequential run is never shuffled and
either shows whole or not at all. Cards are compact and terminal: title, optional
subtitle, source chip, topic chips, and an external link — no detail sheet, no
notes box. `kind` drives a deliberately distinct leading marker (a round gold ▶
for video, a rectangular green **Guide** badge for PDFs).

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
- `src/state/content.js` — the seven `CATEGORIES` (+ `ITEM_CATEGORIES`) + the five
  non-mission item lists, plus `getItem` / `getCategory` lookups. Media entries
  are excluded from `ITEM_INDEX` — they hold no team data.
- `src/state/resources.js` — all external "Go deeper" deep links + the media
  library + mentor-page links + attribution string, in one place.
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
    source: 'PrimeLessons' | 'FLL Tutorials' | 'Season Build Manual' | 'Baby Sharks (Team 33574)',
    url,                      // verified deep link (never a homepage)
    topics: TopicKey[],       // browse-topic keys ([] = not surfaced on the library page)
    audience: 'student' | 'mentor',
    deeplinkLabel?             // optional override for the "Go deeper ↗" / "Also see ↗" line
  }
  ```

  Also exported: `TOPICS`, `MENTOR_LINK_IDS`, `EXTRA_LEARNING_IDS`, `ATTRIBUTION`,
  `BABY_SHARKS_LESSON_INDEX` / `BABY_SHARKS_PYTHON_INDEX` /
  `BABY_SHARKS_ENGINEERING_INDEX` / `BABY_SHARKS_COURSES` / `babySharksCourses()` /
  `coursePageUrl()`, `BABY_SHARKS_FEEDBACK_URL`, the season-document
  exports (`SEASON_DOC_TIER1`, `SEASON_DOC_GROUPS`, `SEASON_DOCS_SOURCE_URL`,
  `FIRST_ATTRIBUTION`), and helpers `resourceById(id)`, `itemResources(item)`,
  `resourcesForTopic(topicKey)`, `mentorLinks()`, `extraLearningResources()`.
- **Three consumers of `RESOURCES`, all by id:** an item's deep links via
  `itemResources(item)` (optional, up to two), the student **Resource Library**
  page, and the mentor page.
- **`MEDIA_ITEMS` is a separate export in the same file**, backing the Video &
  Resource Library category. Same "one file owns every external link" rule, but
  deliberately not folded into `RESOURCES`: the shape differs (`kind`, `series`,
  multiple `topics`, no in-app item behind it) and it must never leak into
  `resourceById` / `resourcesForTopic` / `mentorLinks`. Also exported:
  `MEDIA_TOPICS`, `MEDIA_SERIES`, `mediaTopicLabel(key)`.
- **The FIRST season documents are a third separate export in the same file** —
  `SEASON_DOC_TIER1` / `SEASON_DOC_GROUPS`, backing the home-page season
  documents block. Same "one file owns every external link" rule, same reason
  they are not folded into `RESOURCES`: no in-app item sits behind them, they
  carry no topics or audience, and they must never leak into `resourceById` /
  `resourcesForTopic` / `mentorLinks`. See **Official FIRST season documents**
  below for the scope restriction and the Challenge Updates rule.
- **Resource Library** (hash route `#/resources`) — pure free-browse: no gating,
  no progress. Topics are banded section headers; under each, resource cards open
  the deep link in a new tab. Reachable from the menu and from a slim on-hub bar.
  It is a **separate surface from the media category**: the library page browses
  `RESOURCES`, the media tab browses `MEDIA_ITEMS`.
- `/mentor-resources` (hash route `#/mentor-resources`) lists every item that has
  a deep link, grouped by category, plus the mentor-only links. It walks
  `ITEM_CATEGORIES`, so the media category is correctly skipped.
- **Link policy:** every `RESOURCES` URL was verified to return 200 (2026-06-29);
  every `MEDIA_ITEMS` URL on 2026-08-07 (PDFs fetched directly, videos via the
  YouTube oEmbed endpoint). The one exception is `robot-designs`
  (`primelessons.org/en/RobotDesigns.html`, added 2026-08-07 for the Mechanisms
  Library) — the URL was supplied rather than fetch-verified, so **check it on the
  next link sweep**.
- **`comp-bot-manual` is NOT an external link — we host it.** The 225-step
  competition bot manual was a Google Drive file on an account we do not control;
  on 2026-08-08 that copy was downloaded and committed to
  `public/build/comp-bot-manual.pdf` (21.9 MB), and the resource's `url` now
  points at `LOCAL_ASSETS.compBotManual`. No Drive dependency, no third-party
  permissions, nothing to sweep. If the manual is revised, replace the file in
  `public/build/` — do not point the resource back at anyone's Drive.
  If a link dies, fall back to the relevant index
  (`prime-index` Lessons.html or `fllt-index` category.html) and add
  `// TODO verify-link`; for a dead media entry, replace or drop it. Never ship a
  dead link. Link only — never copy PrimeLessons / FLL Tutorials content, or
  embed video, into the app.

### Baby Sharks (FTC Team 33574) course library

Three free PDF courses shared with us **directly** by Team 33574; Mr. Garza has
committed our teams to using them and is giving feedback. **Link only** — same
rule as PrimeLessons / FLL Tutorials: never copy, mirror, rehost, or reproduce
their PDF content into this app.

- **All three courses render on the home page**, from ONE component and ONE data
  source — never fork it, and never add a second copy of the course data.
  `BABY_SHARKS_COURSES` (resources.js) lists the three by resource id with a
  `badge` and a lesson index; `babySharksCourses()` resolves each to its
  `RESOURCES` entry, so the URL, title, and blurb still live in exactly one place.
  `BabySharksCourse.jsx` renders in two places:
  - `variant="home"` — a `.homeblock` at the top of the hub. **All three
    courses**, each a `.course` card: title + `badge`, a clamped blurb, a one-row
    CTA that opens the PDF **without expanding anything** (one tap from the home
    page), and a "Jump to a lesson" `<details>` holding that course's index.
  - `variant="inline"` (the default) — the collapsed `<details>` above the Build &
    Programming items. **Season coding course ONLY**: the other two are not FLL
    content and have no business in that tab.

  Both variants share the same lesson-row and feedback JSX, so they cannot drift.
- **Lesson rows are real page jumps.** Every index entry carries a `page`, read
  from **the PDF's own embedded outline** (via pypdf, not guessed), and the row is
  an `<a>` to `coursePageUrl(url, page)` → `…pdf#page=N`. Because iOS Safari's PDF
  viewer commonly **ignores** `#page=` and opens at page 1, each row **also prints
  its page number** (`.lessonrow__page`) — that visible number is what makes the
  jump work on an iPad, so do not remove it. The three indexes are
  `BABY_SHARKS_LESSON_INDEX` (15 rows), `BABY_SHARKS_PYTHON_INDEX` (14) and
  `BABY_SHARKS_ENGINEERING_INDEX` (20). **If a course PDF is revised, re-read its
  outline and update these page numbers** or every row points at the wrong lesson.
- `baby-sharks-fll-coding` carries `topics: ['driving', 'sensors', 'strategy']`,
  so it appears on the Resource Library page too — which is why its `blurb` is
  kept **location-neutral** and must not name where the lesson index lives.
- Three lesson-specific ids point at the **same** PDF but exist purely to name the
  right lesson on a specific item's "Go deeper" line, via `secondaryResourceId`:
  `baby-sharks-l2-driving` (BP3, BP4 → `#page=9`, L2 Basic movement),
  `baby-sharks-l5-sensors` (BP7 → `#page=15`, L5 Sensors), and
  `baby-sharks-l5-5-reliability` (BP5, BP9 → `#page=19`, L5.5 Robot consistency).
  Each sets `deeplinkLabel: 'Baby Sharks lesson ↗'` so the detail sheet doesn't
  show the mechanisms-only "More training designs ↗" text — see `deeplinkLabel`
  above. Their page anchors must stay in step with `BABY_SHARKS_LESSON_INDEX`.
- **`baby-sharks-python`** and **`baby-sharks-engineering`** are optional, **not
  FLL season content**. They now appear on the home page alongside the season
  course (the teams asked for all three in one place), but they keep `topics: []`
  so they never enter a topic band, they are excluded from the Build & Programming
  tab, and they carry the `badge: 'Optional — not FLL'` chip — styled grey
  (`.chip--optional`), deliberately not green or gold, so they cannot read as part
  of the season skill path. They also still surface in the Resource Library's
  **"Extra Learning (Optional)"** section (`EXTRA_LEARNING_IDS` /
  `extraLearningResources()`).
- `ATTRIBUTION` (shown on every page that already credits PrimeLessons / FLL
  Tutorials) now also credits Baby Sharks / Team 33574 for all three courses. A
  short feedback line — "Our teams are giving feedback on these courses" — with a
  link to `BABY_SHARKS_FEEDBACK_URL` appears once under the courses home block,
  again in Build & Programming, and again in the Extra Learning section (the
  Ripple Effect page has the feedback form embedded on it; no separate form URL).
- **Fallback / verify-link status:** the three PDF URLs are hosted on a Wix
  "premium files" bucket (`09e0be48-...filesusr.com`) whose bot protection
  rejects a **default** curl/headless user agent — but it serves normally to a
  **browser** user agent. `curl -A '<browser UA>' <url>` returned all three PDFs
  in full on 2026-08-20 (52 / 37 / 67 pages), which is also how the lesson-index
  page numbers were read. So **do not treat a failed automated check on these
  three URLs as a dead link** — retry with a browser UA first — and **do not fall
  back to the Ripple Effect page** (`https://team33574.wixsite.com/baby-sharks/blank-2`),
  which would collapse three distinct courses onto one generic destination.
  Last confirmed working: 2026-08-20.

## Tour + session check-in

- **First-run site tour** (`SiteTour.jsx`). A centered modal carousel (6 steps,
  progress dots, Back/Next, Skip + X, swipe + arrow keys). Each step shows a small
  CSS-built **echo** of a real element (no images/screenshots). The categories
  step — its title, its list of names, and its tab echo — is **derived from
  `CATEGORIES`**, never written out, because a hardcoded count goes stale the
  moment a category is added. Gated by the
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

## Home-page primary blocks

Three primary entry points sit at the top of `app__main`, **above the category
tabs**, so none can be scrolled past. **The order is the teams' explicit
call — do not reshuffle it without asking:**

1. **Official FIRST season documents** (`.homeblock`)
2. **Build the Competition Bot** (`.build-bar`)
3. **Baby Sharks free courses** (`.homeblock`)

then setup bar → library bar → `Hub` (tabs). The two `.homeblock` sections share
one chrome — black head with a gold kicker, white body — deliberately a tier
apart from the solid-gold `.build-bar` between them and the slim outlined
`.library-bar` / `.setup-bar` below.

**Height budget.** The header + progress bar already cost ~190px, and the season
documents block leads, so the stack is tight. Measured collapsed at 394×854:
season docs 188→840 (fills the first screen), build bar starts at 856, courses at
1031. On an iPad (768×1024) all three start above the fold (205 / 747 / 863). So
on a phone **only the first block is fully above the fold** — that is the
arithmetic cost of leading with the tallest block, and it is accepted. Both
blocks were compacted to get here: Tier 2 docs live behind ONE outer fold (not
six), and `.course__blurb` is line-clamped to 2. **Anything added above the tabs
has to earn its height** — re-measure if you add or expand a block. The next
lever, if more is needed, is demoting the build bar or trimming Tier 1.

### Official FIRST season documents

`SeasonDocuments.jsx`, fed by `SEASON_DOC_TIER1` / `SEASON_DOC_GROUPS` in
`resources.js`. Every row is one tap straight to the file — never an
intermediate landing page, never a "go to the FIRST website" step.

- **Scope: Founders Edition, Grades 4–8 (Challenge) only.** Our four teams are
  Founders Edition Challenge teams. Do **not** add FLL Explore or Future Edition
  materials to this block anywhere.
- **Link only.** Never download, mirror, rehost, or reproduce FIRST content into
  this app — the same rule that governs PrimeLessons / FLL Tutorials / Baby
  Sharks. (The one self-hosted PDF in the repo is the competition bot build
  manual, which is not a FIRST publication.)
- **Data source:** `https://firstinspires.blob.core.windows.net/fll/challenge/2026-27/…`,
  the FIRST blob storage the season materials page serves from. The index page
  (`SEASON_DOCS_SOURCE_URL`,
  `firstinspires.org/resources/library/fll/season-materials`) appears **only in
  the block's footer** as a credit — no document routes through it. Doc shape is
  `{ id, title, url, kind, note?, warn? }` where `kind` is `'pdf' | 'web' |
  'video'`.
- **Tier 1** (always visible, no expand): Robot Game Rulebook, the interactive
  rulebook, Challenge Updates, Engineering Notebook. **Tier 2** sits behind ONE
  outer fold ("More season documents"), which contains six per-heading
  `<details>` groups: rules and participation, judging and awards, field and
  table setup, mission model building instructions (Element Overview, Prepack
  Overview, and Models 1–13 — generated from the URL pattern by `MODEL_BOOKS` so
  the two-digit zero padding can't drift), scoring, and videos. The outer fold
  exists for the height budget above: six always-visible group headers cost
  ~300px, and everything below this block pays for it.
- **Challenge Updates gets an alert treatment, not just a list position**
  (`warn` on the doc → `.docrow--warn`, gold on gold-pale). It carries rule
  **corrections that override the Rulebook**, and **FIRST revises it during the
  season** — a team running a mission by a superseded rule loses the points, and
  it is the single most-missed document in FLL. The copy tells students to
  **re-check it before every tournament**, and whoever sweeps links should also
  re-read the file itself and update the "last updated" `note` (currently
  8/04/26). Keep that framing if you touch this row.
- `FIRST_ATTRIBUTION` credits these as official FIRST LEGO League Challenge
  publications, alongside the existing `ATTRIBUTION` line for PrimeLessons / FLL
  Tutorials / Baby Sharks.
- **Link policy:** all 36 URLs were fetched on 2026-08-20 — every PDF returned
  `application/pdf` with a `%PDF` header. Unlike the Baby Sharks Wix bucket,
  `firstinspires.blob.core.windows.net` does **not** block automated fetching,
  so a failure there is a **real dead link**. On a dead link, add a
  `// TODO verify-link` naming the document and point **that one entry** at
  `SEASON_DOCS_SOURCE_URL` — never collapse the whole block onto the index page.

## The build manual (the season's action item)

Building the competition bot is what teams are doing right now, so it gets the
loudest surface in the app — not a link buried in an item sheet.

- **`.build-bar`** is the first child of `app__main`, above the session setup bar
  and above the category tabs: inverted black-on-gold so it cannot read as just
  another outlined bar, and **not dismissible**. When every team has built its
  bot, demote it (or gate it) — that is a deliberate one-line change in `App.jsx`.
- It routes to **`#/build`** (`BuildManual.jsx`), which **embeds the PDF in-app**
  via `<object data={LOCAL_ASSETS.compBotManual} type="application/pdf">`.
  `<object>` not `<iframe>`: iOS Safari's inline PDF rendering is unreliable, and
  `<object>` gives a real fallback slot when the browser refuses to embed. Two
  buttons above the viewer ("Open full screen", "Save to this device") always
  work, so a team is never stuck looking at a blank rectangle.
- ROBOT4 still links to the same resource, so the item sheet and the build bar
  lead to the same place.

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
    content.js          the seven CATEGORIES (+ ITEM_CATEGORIES) + Robot / Core
                        Values / Project / Build / Mechanisms items
    resources.js        SINGLE source of truth for external links: RESOURCES
                        (per-item + library), MEDIA_ITEMS (media category), and
                        SEASON_DOC_TIER1 / SEASON_DOC_GROUPS (FIRST season docs)
    troubleshooter.js   "Stuck?" content
    state.js            SINGLE state module (only localStorage I/O + all mutators)
    useTeamState.js     React hook over state.js
  components/           Onboarding, RosterEditor, Hub, MissionCard, MissionDetail,
                        MediaList, Troubleshooter, Menu, MentorResources,
                        ResourceLibrary, TodayCheckin, SiteTour, DailyRhythm,
                        BuildManual, BabySharksCourse, SeasonDocuments, Modal
  styles/               tokens.css (branding), app.css
public/
  manifest.webmanifest, icons/   (PWA install assets)
  build/comp-bot-manual.pdf      (21.9 MB — the season build, served by us)
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

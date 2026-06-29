# CLAUDE.md — DBTI FLL Summer Camp Mission Hub

> Keep this file current. When the schema, branding, gating model, or Phase 2
> plan changes, update CLAUDE.md in the same change. It is the contract future
> work (especially the Phase 2 dashboard) relies on.

## Purpose

A self-paced, **gated quest hub** for FLL robotics campers (grades 4–8, SPIKE
Prime, **UNEARTHED** season). Campers climb a ladder of quests, self-check
criteria to complete each one, and unlock the next. It runs on iPads and Windows
laptops in a browser, saves progress locally, and logs every gate event so a
Phase 2 mentor dashboard can read it.

Two tracks:

- **Rookie** (basic kit + expansion): 12 gated quests in 3 week-arcs + 1 optional
  ungated quest (`RX`). Arcs are visual only — no mentor sign-offs.
- **Veteran** (full LEGO): 9 quests across 4 tiers (Bronze → Silver → Gold →
  Platinum). Tier boundaries require a mentor sign-off.

## Stack

- **React + Vite**. Local path: `C:\fll-camp`.
- **GitHub Pages via GitHub Actions** (`.github/workflows/deploy.yml`): builds on
  push to `main` and deploys. The `dist/` folder is **not** committed — the Action
  builds it. `vite.config.js` sets `base: '/fll-camp/'` to match the repo name.
- **No backend in Phase 1.** All state is in `localStorage`.
- Mobile-first; targets iPad Safari and Windows Chrome. Large touch targets.
- Web app manifest + apple-touch icons so it installs to the home screen.
- **No offline-caching service worker** in this phase — camp content changes and
  must never serve stale. Do not add one without revisiting this.

## State module contract (the important part)

All reads/writes of persisted state flow through **one module**:

- `src/state/state.js` — the only file that touches `localStorage` (one read in
  `loadState`, one write in `persist`). All mutators live here and return new,
  recomputed state. **The Phase 2 sync call goes inside `persist()` and nowhere
  else.**
- `src/state/useTeamState.js` — the React hook wrapping `state.js`. Components
  call its actions; they never touch storage or build event objects directly.
- `src/state/config.js` — `STORAGE_KEY`, `STATE_VERSION`, `MENTOR_CODE` (single
  constant, change in one place), `TIER_ORDER`, and criterion-type defaults
  (`RUNLOG_N`, `RUNLOG_PASS`, `ANSWER_MIN`, `EVIDENCE_MAX_BYTES`).
- `src/state/quests.js` — quest content (Rookie + Veteran ladders), now with
  **typed criteria** + a per-quest `lesson` (micro-lesson).
- `src/state/media.js` — the **only** place IndexedDB is touched. Stores evidence
  blobs keyed `media:<ladder>:<questId>:<criterionIdx>`. The blob never leaves the
  device and is never part of the Phase 2 sync payload.
- `src/state/resources.js` — all external "Go deeper" deep links + mentor-page
  links + attribution string, in one place.
- `src/state/troubleshooter.js` — "Stuck?" symptom/checklist content.

### Criterion types (gate model — Workstream A)

Each quest criterion has a `type`. A quest completes when ALL its criteria are
satisfied per their type (`isCriterionSatisfied` in state.js is the single source
of truth, exported for the UI). Definitions live in `quests.js`; per-criterion
runtime state lives under `progress[questId].criteria[idx]`:

```
check    def { type:'check',  label }
         st  { type:'check', done:bool }                       satisfied: done === true

runlog   def { type:'runlog', label, n, pass }                 (default n=3, pass=2)
         st  { type:'runlog', runs:[{result:'hit'|'miss'}], n, pass }
                                                                satisfied: hits >= pass

evidence def { type:'evidence', media:'photo'|'video', label }
         st  { type:'evidence', media, idbKey, capturedAt }    satisfied: idbKey present
         (blob lives in IndexedDB via media.js; state stores only the idbKey)

answer   def { type:'answer', label, min }                     (default min=8)
         st  { type:'answer', text }                           satisfied: trim().length >= min
```

**Device camera setting — `deviceCanCapture` (top-level, per device).** A boolean
sibling of `team`/`ladders`/`events`, so it is per-browser and survives team and
ladder switches. Seeded by a light heuristic (`detectCanCapture`: true on
iPad/iPhone/Android or coarse-pointer touch devices, false on desktop/Windows);
the menu toggle "This device can film the robot" is the source of truth and
overrides the heuristic (`setDeviceCanCapture`).

When `deviceCanCapture === false`, `isCriterionSatisfied` returns `true` for every
`evidence` criterion, so evidence is **non-gating** — it never blocks completion,
the AND-gate and "finish every step" footer skip it, and it renders as clearly
**optional** (muted, capture still available so a laptop webcam can attach). When
`true`, evidence works as built (required, gating, IndexedDB capture). The derived
`hasEvidence` flag stays device-INDEPENDENT (true only when a blob actually
exists), so a dashboard treats missing evidence on no-camera devices as neutral,
not stuck. Toggling the setting recomputes both ladders.

### Persistence schema

`localStorage` key: **`fll-camp-state-v2`** (`STATE_VERSION = 'v2'`). On load, any
blob whose `version` !== `'v2'` is discarded safely (no migration, no crash) — a
stray v1 blob is simply ignored.

```
{
  version: 'v2',
  team: { name, createdAt } | null,          // null until onboarding
  activeLadder: 'rookie' | 'veteran',
  ladders: {
    rookie:  { progress: { [questId]: ProgressEntry } },
    veteran: { progress: { [questId]: ProgressEntry }, tier: TierField }
  },
  needsMentor: boolean,
  deviceCanCapture: boolean,                 // per-device; false => evidence non-gating
  events: Event[]                            // append-only
}

ProgressEntry = { status: 'locked'|'available'|'complete',
                  criteria: { [idx:number]: CriterionState },   // see criterion types
                  completedAt: ISOString|null,
                  hasEvidence: boolean }   // derived; true if any evidence criterion satisfied

TierField = 'none'|'bronze'|'silver'|'gold'|'platinum'   // highest tier unlocked
                                                          // ('none' = only Bronze open)
```

Progress is **namespaced per ladder**, so switching tracks preserves each track's
progress separately.

### Event-log contract (dashboard-ready)

`events` is **append-only**. This array plus a progress snapshot is what Phase 2
POSTs to a Google Sheet.

```
Event = { ts, type, ladder, questId?, tier?, teamName, result?, media? }

type ∈ {
  'team_created',      // onboarding; ladder = chosen track
  'quest_complete',    // a quest's criteria all satisfied; includes questId
  'tier_signoff',      // mentor code accepted; includes tier (the unlocked tier)
  'mentor_requested',  // needsMentor toggled ON
  'mentor_cleared',    // needsMentor toggled OFF
  'run_logged',        // a runlog Hit/Miss; includes questId + result ('hit'|'miss')
  'evidence_captured'  // a photo/video captured; includes questId + media ('photo'|'video')
}
```

**Media never syncs** — only the *fact* that evidence exists. Phase 2 POSTs the
events array + a progress snapshot (each `ProgressEntry` carries the derived
`hasEvidence` flag the dashboard reads). The IndexedDB blobs stay on-device.

### Gate model

- **Self-check:** a quest completes when all its criteria are satisfied (per the
  criterion types above). The next quest in the same tier/arc unlocks
  automatically.
- **Mentor sign-off:** only at veteran tier boundaries. When the final quest of a
  tier is self-checked complete, the app prompts for the 4-digit
  `MENTOR_CODE` (`src/state/config.js`, currently `5669`). On a correct code the
  next tier unlocks and a `tier_signoff` event is logged.
- Rookie has **no** sign-offs. Veteran sign-off quests: `V3 → Silver`,
  `V6 → Gold`, `V8 → Platinum`.

## Phase 2 plan (not in this repo yet)

1. **Run logger → Google Sheet via Apps Script.** Add a `fetch` POST inside
   `persist()` in `state.js` (the single write point) that sends
   `{ team, activeLadder, ladders, events }` to a deployed Apps Script Web App.
   Make it non-blocking / best-effort so local use never breaks offline.
2. **Mentor dashboard** reads that Sheet to show each team's position, recent
   `quest_complete` / `tier_signoff` events, and which teams have
   `needsMentor = true`.

Because every write already funnels through `persist()`, wiring sync is a
one-file change.

## Resources contract (Workstream B)

- Every quest has an in-app **micro-lesson** (`lesson` in `quests.js`) — the
  primary teaching; it must stand alone so kids never need to leave the app.
- `src/state/resources.js` is the **single source of truth for every external
  link**. `RESOURCES` is keyed by a stable resource `id`; everything that points
  off-app references an entry by id so nothing is ever duplicated.

  ```
  RESOURCES[id] = {
    id,                       // stable key
    title,                    // kid-friendly name
    blurb,                    // one short line — what it helps you do
    source: 'PrimeLessons' | 'FLL Tutorials',   // drives the source chip
    url,                      // verified deep link (never a homepage)
    topics: TopicKey[],       // browse-topic keys ([] = not surfaced on the library page)
    audience: 'student' | 'mentor'
  }
  ```

  Also exported: `TOPICS` (ordered browse topics — `new-to-fll`, `driving`,
  `sensors`, `building`, `missions`, `strategy`; the closing "More" group uses
  the `more` topic key), `QUEST_RESOURCE_IDS` (`questId -> resource id`),
  `MENTOR_LINK_IDS`, `ATTRIBUTION`, and helpers `resourceFor(questId)`,
  `resourcesForTopic(topicKey)`, `mentorLinks()`.
- **Three consumers, all by id:** the per-quest "Go deeper" deep link
  (`resourceFor`, optional, never gates completion), the student **Resource
  Library** page, and the mentor page. Quests not in `QUEST_RESOURCE_IDS` show no
  deep link.
- **Resource Library** (hash route `#/resources`) — a pure free-browse page:
  **no gating, no progress tracking**. Topics are banded section headers (same
  editorial system as the week-arcs); under each, resource cards (kid title,
  blurb, source chip, external-link affordance) open the deep link in a new tab.
  A closing "More" group holds the two index pages, and a Stuck link opens the
  troubleshooter. Reachable from the menu ("Resource Library", above "Mentor
  Resources") and from a slim on-ladder entry bar near the top of the main screen.
- The `/mentor-resources` page (hash route `#/mentor-resources`, linked from the
  menu) maps every quest to its resource (via `resourceFor`) plus the mentor-only
  links (`mentorLinks()`).
- **Link policy:** every configured URL was verified to return 200 (2026-06-29).
  If one dies, fall back to the relevant index (`prime-index` Lessons.html or
  `fllt-index` category.html) and add `// TODO verify-link`. Never ship a dead
  link. Link only — never copy PrimeLessons / FLL Tutorials slide or video
  content into the app.

## Branding tokens (see `src/styles/tokens.css`)

- Black `#0D0D0D`, gold `#F5B800` (accents `#C49200`, `#FFF8D6`, `#F0E080`).
- IDEA green `#1DB35A` (dark `#167540`, tint `#EBF7F1`, mid `#9ECFB4`).
- Medals: bronze `#C77D3A`, silver `#8C9196`, gold `#E0A400`, platinum `#5E86B0`.
- Fonts: **Oswald** (display/headers), **Inter** (body), via Google Fonts.
- Black headers, gold accents, green for "go/complete" states.

## Project layout

```
src/
  main.jsx              app entry
  App.jsx               screen orchestration + overlays
  state/
    config.js           constants (MENTOR_CODE, STORAGE_KEY, TIER_ORDER, type defaults)
    quests.js           Rookie + Veteran quest content (typed criteria + lessons)
    resources.js        SINGLE source of truth for external links (id-keyed:
                        per-quest deep links + Resource Library + mentor links + attribution)
    media.js            IndexedDB module — ONLY place IndexedDB is touched
    troubleshooter.js   "Stuck?" content
    state.js            SINGLE state module (only localStorage I/O + all mutators)
    useTeamState.js     React hook over state.js (+ evidence/IndexedDB orchestration)
  components/           Onboarding, Climb, QuestCard, QuestDetail, Criterion,
                        Evidence, Troubleshooter, MentorGate, Menu,
                        MentorResources, ResourceLibrary, DailyRhythm, Modal
  styles/               tokens.css (branding), app.css
public/
  manifest.webmanifest, icons/   (PWA install assets)
scripts/generate-icons.mjs       (regenerate PNG icons from icon.svg)
.github/workflows/deploy.yml      (Pages build + deploy)
```

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build
- `npm run icons` — regenerate icons (needs `npm i -D sharp` first)

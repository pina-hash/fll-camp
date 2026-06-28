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
- `src/state/config.js` — `STORAGE_KEY`, `MENTOR_CODE` (single constant, change in
  one place), `TIER_ORDER`.
- `src/state/quests.js` — quest content (Rookie + Veteran ladders).
- `src/state/troubleshooter.js` — "Stuck?" symptom/checklist content.

### Persistence schema

`localStorage` key: **`fll-camp-state-v1`**

```
{
  version: 'v1',
  team: { name, createdAt } | null,          // null until onboarding
  activeLadder: 'rookie' | 'veteran',
  ladders: {
    rookie:  { progress: { [questId]: ProgressEntry } },
    veteran: { progress: { [questId]: ProgressEntry }, tier: TierField }
  },
  needsMentor: boolean,
  events: Event[]                            // append-only
}

ProgressEntry = { status: 'locked'|'available'|'complete',
                  criteria: { [idx:number]: boolean },
                  completedAt: ISOString|null }

TierField = 'none'|'bronze'|'silver'|'gold'|'platinum'   // highest tier unlocked
                                                          // ('none' = only Bronze open)
```

Progress is **namespaced per ladder**, so switching tracks preserves each track's
progress separately.

### Event-log contract (dashboard-ready)

`events` is **append-only**. This array plus a progress snapshot is what Phase 2
POSTs to a Google Sheet.

```
Event = { ts, type, ladder, questId?, tier?, teamName }

type ∈ {
  'team_created',     // onboarding; ladder = chosen track
  'quest_complete',   // a quest's criteria all ticked; includes questId
  'tier_signoff',     // mentor code accepted; includes tier (the unlocked tier)
  'mentor_requested', // needsMentor toggled ON
  'mentor_cleared'    // needsMentor toggled OFF
}
```

### Gate model

- **Self-check:** a quest completes when all its criteria are ticked. The next
  quest in the same tier/arc unlocks automatically.
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
    config.js           constants (MENTOR_CODE, STORAGE_KEY, TIER_ORDER)
    quests.js           Rookie + Veteran quest content
    troubleshooter.js   "Stuck?" content
    state.js            SINGLE state module (only storage I/O + all mutators)
    useTeamState.js     React hook over state.js
  components/           Onboarding, Climb, QuestCard, QuestDetail,
                        Troubleshooter, MentorGate, Menu, DailyRhythm, Modal
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

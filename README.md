# DBTI FLL — Season Skill Hub (BIOGLOW 2026–2027)

An open season hub for four competitive FLL teams (SPIKE Prime, **BIOGLOW**
season). Every mission, value, project step, and robot skill is available from
day one — nothing is locked, nothing is sequential. Teams write their own
strategy notes against each item, and those notes are the season's living
strategy document.

> Live: **https://pina-hash.github.io/fll-camp/**

Sessions: **Fridays 4:30–6:00pm** and **Saturdays 9:00–11:00am**.

## The four categories

- **Robot Game Missions** — all 15 BIOGLOW missions with their scoring lines and
  the conditions that zero them, plus Equipment Inspection and Precision Tokens.
- **Core Values** — the six values, Gracious Professionalism, and what the
  judging session actually looks like.
- **Innovation Project** — the biodiversity theme, worked one step at a time from
  finding a problem to presenting it.
- **Build & Programming** — the robot skills every mission depends on, each
  linking out to a full guide.

Open any item and write your team's strategy in the notes box. It saves as you
type, on that device, and anyone on the team can edit it later.

## Teams and devices

Each team uses its own device(s). Separation is per-device — one saved state per
browser. There is no login, no accounts, and no cross-team visibility. The team
roster (add/remove member names, at onboarding or from the team menu) is
informational only; it is the seam real student accounts drop into later.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # preview the build
```

## Deploy

GitHub Pages via GitHub Actions. Pushing to `main` triggers
`.github/workflows/deploy.yml`, which builds and deploys. The `dist/` folder is
not committed. Set **Settings → Pages → Source = GitHub Actions** once.

`vite.config.js` sets `base: '/fll-camp/'` to match the repo name.

## Architecture

All persisted state flows through a single module (`src/state/state.js`) so the
Phase 2 sync-to-Google-Sheet wiring is a one-file change. See
[CLAUDE.md](CLAUDE.md) for the full schema, content model, event-log contract,
and Phase 2 plan.

## Phase 1 notes

- No backend; state is in `localStorage` (`fll-season-state-v3`).
- No offline service worker on purpose — season content changes and must never
  serve stale.
- Installs to the home screen (manifest + apple-touch icons).
- Mission data is from the official BIOGLOW Robot Game Rulebook (2026-08-04) and
  lives in `src/state/missions.js`. Item ids are stable — renumbering them would
  orphan teams' strategy notes.

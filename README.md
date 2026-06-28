# DBTI FLL Summer Camp — Mission Hub

A self-paced, gated quest hub for FLL robotics campers (SPIKE Prime, **UNEARTHED**
season). Campers pick a track, climb a ladder of quests, tick self-check criteria
to complete each one, and unlock the next. Progress saves locally; every gate
event is logged for a future mentor dashboard.

> Live: **https://pina-hash.github.io/fll-camp/**

## Tracks

- **Rookie** — 12 gated quests in 3 week-arcs + 1 optional side-quest.
- **Veteran** — 9 quests, Bronze → Silver → Gold → Platinum, with mentor sign-offs
  at tier boundaries (4-digit code).

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # preview the build
```

Mentor sign-off code lives in `src/state/config.js` (`MENTOR_CODE`).

## Deploy

GitHub Pages via GitHub Actions. Pushing to `main` triggers
`.github/workflows/deploy.yml`, which builds and deploys. The `dist/` folder is
not committed. Set **Settings → Pages → Source = GitHub Actions** once.

`vite.config.js` sets `base: '/fll-camp/'` to match the repo name.

## Architecture

All persisted state flows through a single module (`src/state/state.js`) so the
Phase 2 sync-to-Google-Sheet wiring is a one-file change. See
[CLAUDE.md](CLAUDE.md) for the full schema, event-log contract, and Phase 2 plan.

## Phase 1 notes

- No backend; state is in `localStorage` (`fll-camp-state-v1`).
- No offline service worker on purpose — camp content changes and must never
  serve stale.
- Installs to the home screen (manifest + apple-touch icons).

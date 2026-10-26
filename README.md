# Headshot Haven

A browser-based FPS aim trainer. A first-person **3D arena built with Three.js** (Gridshot, Spidershot and Strafe Track), plus a **reaction time test** and a **CPS test**. Global leaderboards run on an **Express + MongoDB** API.

Everything works without the backend: runs, personal bests and progress charts are stored on the device, and the leaderboard simply lights up when the API is reachable.

---

## Highlights

### 3D arena (`frontend/src/games/arena`)
- **First-person room** with a grid-textured map, cover blocks, real-time shadows, fog and emissive light strips. All textures are generated on a canvas at runtime, so there are no image assets.
- **Three modes**
  - **Gridshot**: 3 targets on a 5×4 grid at varying depths. Streaks multiply points up to 2×.
  - **Spidershot**: targets alternate between centre and a wide arc. Faster kills earn up to +150 bonus.
  - **Strafe Track**: an unpredictably strafing target. Score accrues for every frame your crosshair is on it.
- **Raw mouse input**: Pointer Lock with `unadjustedMovement` (bypasses OS acceleration), falling back to standard lock and then to cursor aim (trackpads, touch, embedded browsers).
- **Real sensitivity matching**: rotation per mouse count uses each game's yaw constant (Valorant, CS2/Apex, Overwatch 2, Fortnite), so muscle memory transfers 1:1. Shows cm/360 and the equivalent sens in every other game.
- **Horizontal FOV** setting converted to the camera's vertical FOV for any aspect ratio.
- **Weapon viewmodel** rendered in a separate scene and camera with a cleared depth buffer (the technique real shooters use), with recoil, mouse sway and muzzle flash.
- **Feedback**: pooled particle bursts and shockwave rings, bullet-hole decals on misses, hitmarkers, floating points and low-latency Web Audio.
- **Analytics** after every run: accuracy, kills/sec, average kill time, best streak, and a per-second performance chart.
- **Esc** pauses, **R** restarts instantly, **Space** starts. Sensitivity and FOV can be changed mid-game from the pause menu.

### Reaction & CPS
- **Reaction**: 5 attempts averaged, early-click detection, colour flips timestamped in the same animation frame as the paint (so React render time isn't measured), spread, and an approximate percentile.
- **CPS**: 5s / 10s boards, live rolling CPS, click ripples, peak 1-second window, average interval and a CPS-over-time chart.

### Platform
- **Leaderboards**: best score per player, per board (CPS variants are ranked separately; reaction time ranks ascending). Your global rank is returned on submit.
- **Profile**: personal bests, progress charts across your last 20 runs per mode, session history.
- **Settings**: crosshair editor with live preview and presets, target colour, graphics quality, volume, local data reset.
- **Accounts**: email/password with JWT, plus optional Google OAuth (the button appears only when the server has credentials).

---

## Tech stack

| Layer    | Tech |
| -------- | ---- |
| Frontend | React 19, React Router 7, Vite, Three.js, hand-written CSS (no UI kit), SVG charts |
| Backend  | Node.js, Express 5, Mongoose 8 / MongoDB, JWT, Passport (Google OAuth 2.0), Helmet, express-rate-limit |
| Testing  | Vitest (game and scoring logic), `node:test` + Supertest (API integration) |

## Project structure

```
HeadshotHaven/
├── frontend/
│   └── src/
│       ├── games/arena/      # Three.js engine: ArenaEngine, modes, weapon, effects, textures
│       ├── pages/            # Home, ArenaPage, ReactionPage, CpsPage, Leaderboards, Profile, Settings, Auth
│       ├── components/       # Navbar, Chart (SVG), Crosshair, HeroScene, SensitivityFields…
│       ├── contexts/         # Auth (server status + session), Settings (persisted)
│       ├── hooks/            # useRunRecorder: local save + leaderboard submit
│       └── lib/              # api client, game registry, sensitivity maths, local stats, audio
└── backend/
    ├── app.js                # Express app (exported for tests)
    ├── server.js             # DB connection with retry + listener
    ├── config/               # env, game rules/validation, passport
    ├── models/               # User (per-board bests map), GameScore
    ├── routes/               # auth, games, users, admin
    ├── scripts/seed.js       # demo players for local leaderboards
    └── test/                 # API integration tests
```

The arena engine is a plain class that owns the scene, input and game clock. React talks to it through a few methods (`begin`, `resume`, `restart`, `quit`, `applySettings`) and receives throttled HUD updates and events. Game modes contain no Three.js code: they only decide where targets spawn and how hits score, which keeps them unit-testable.

---

## Getting started

**Prerequisites:** Node.js 20+ and MongoDB (local or Atlas). MongoDB is only needed for accounts and leaderboards.

```bash
npm run install:all
cp backend/.env.example backend/.env   # then set JWT_SECRET
npm run seed                            # optional: demo players for the leaderboards
npm run dev                             # API on :5000, web on http://localhost:3000
```

Frontend only (fully playable offline):

```bash
cd frontend && npm install && npm run dev
```

In development Vite proxies `/api` to `localhost:5000`, so no CORS setup is needed.

### Environment

`backend/.env`. See [`backend/.env.example`](backend/.env.example).

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Mongo connection string |
| `JWT_SECRET` | Token signing secret (**required** in production) |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated. Also the OAuth redirect target |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | Optional Google sign-in |

`frontend/.env` (production builds only): `VITE_API_URL=https://your-api.example.com/api`

## Tests

```bash
npm test
```

- `frontend`: sensitivity conversions, FOV maths, score formulas, slot picking, CPS/reaction metrics.
- `backend`: registration and login validation, auth, score range and variant validation, per-player leaderboards, reaction ordering, CPS board separation. Runs against `MONGODB_TEST_URI` (default `mongodb://127.0.0.1:27017/headshot-haven-test`), which is dropped afterwards.

---

## API

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | – | Status, database state, whether Google sign-in is enabled |
| POST | `/api/auth/register` | – | Create account → `{ token, user }` |
| POST | `/api/auth/login` | – | Sign in → `{ token, user }` |
| GET | `/api/auth/me` | ✔ | Current user (incl. per-board bests) |
| GET | `/api/auth/google` | – | Google OAuth (when configured) |
| POST | `/api/games/:game` | ✔ | Submit `{ score, variant?, gameData? }` → `{ isPersonalBest, userBest, rank }` |
| GET | `/api/games/:game/leaderboard?variant=` | – | Top 25, best score per player |
| GET | `/api/games/history?game=&limit=` | ✔ | Your recent runs |
| DELETE | `/api/games/reset-scores` | ✔ | Reset your scores (optionally one game) |
| GET/PUT | `/api/users/profile` | ✔ | Read / update username and avatar |
| PUT | `/api/users/change-password` | ✔ | Change password |
| GET | `/api/users/stats` | ✔ | Bests and run counts |
| DELETE | `/api/users/account` | ✔ | Delete account and scores |
| * | `/api/admin/*` | admin | Users, scores and dashboard management |

Games: `gridshot`, `spidershot`, `tracking`, `reaction` (ms, lower is better), `cps` (variants `5s`, `10s`). Scores are range-checked server-side, submissions and auth are rate-limited, and the API returns `503` instead of hanging when the database is down.

## Deployment

- **Frontend**: any static host. `npm run build` outputs `frontend/dist`. `public/_redirects` handles SPA routing on Netlify (use an equivalent rewrite on Vercel). Without `VITE_API_URL` the site runs in offline mode.
- **Backend**: any Node host (Render, Railway, Fly) with MongoDB Atlas. Set `NODE_ENV=production`, `JWT_SECRET`, `MONGODB_URI` and `FRONTEND_URL`.

---

## Author

**Abdi Rahman Suufi** · [GitHub](https://github.com/Abdi-Suufi) · abdisuufi123@gmail.com

Original PHP version: [Headshot-Haven](https://github.com/Abdi-Suufi/Headshot-Haven)

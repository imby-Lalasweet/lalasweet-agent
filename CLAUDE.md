# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint check
```

No test suite is configured in this project.

## Environment Variables

Create a `.env` file at the project root:

```
VITE_ANTHROPIC_API_KEY=...
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

All env vars are prefixed `VITE_` and accessed via `import.meta.env`.

## Architecture

### State management
All application state lives in `src/App.jsx` — there is no external state library. `App` acts as the single source of truth, passing props and callbacks down to views. Navigation uses URL hash (`window.location.hash`) rather than React Router (despite react-router-dom being installed).

### Views (hash-based routing)
| Hash | View | Component |
|------|------|-----------|
| `#home` | Room list + quick actions | `HomeView` |
| `#room` | Single member's history | `RoomView` |
| `#mode` | Active AI mode form | `ModeView` |
| `#admin` | Admin panel | `AdminView` |

Login is handled outside the hash system — if `user` state is null, `LoginView` is rendered unconditionally.

### AI Layer (`src/services/aiService.js`)
Calls the Anthropic Messages API **directly from the browser** using `anthropic-dangerous-direct-browser-access: true`. No backend proxy. Models are defined in `src/utils/constants.js` under `AI_MODELS`.

### Data Layer (`src/services/supabase.js`)
Supabase is used for all persistence. If env vars are missing, `supabase` is `null` and all DB functions no-op gracefully. Auth supports both username/password (custom `users` table, SHA-256 hashed) and Google OAuth (via Supabase Auth, synced into the custom `users` table via `syncGoogleUser`).

Key tables:
- `users` — custom auth (username + password_hash)
- `rooms` — one per team member, owned by user
- `histories` — AI generation results, cascade-deleted with room
- `org_goals` — saved org goals per team, per user
- `level_guides` — global PDF (base64), one active at a time
- `working_style` — global text document injected into all system prompts
- `agent_logs` — all AI calls logged for admin review

Schema migrations are tracked in `supabase_migration_*.sql` files at the root.

### System Prompts (`src/utils/constants.js`)
- `BASE` — shared preamble (7 core values, level criteria)
- `SYS[1..4]` — mode-specific prompts built on top of `BASE`
- `workingStyle` (from DB) is appended to every system prompt at call time in `App.jsx:callAPI`
- `guide` (PDF from DB) is attached as a base64 document in every API call

### Styling
All styles are inline JS objects. Shared design tokens and style objects (`C`, `inp`, `lbl`, `crd`, `bP`, `bS`) are exported from `src/utils/constants.js`. The font is `Pretendard` (loaded via CSS or system fallback). UI is Korean-language throughout.

### Common UI Components (`src/components/ui/common.jsx`)
- `Md` — lightweight markdown renderer (bold, bullet, emoji headings, horizontal rules)
- `Shell` — page wrapper with back button
- `GS` — level guide status badge
- `CheckBtn` — toggle checkbox button
- `TabToggle` — segmented control

### Room + Mode Flow
A "room" represents one team member. Modes (1-4) generate AI content for that member. Generated results are stored as "histories" on the room. Mode 1 (initiative) supports a modify flow (`handleModify`) that sends the previous result back to the API for refinement. Initiatives can be "pinned" (`fixed_initiative`) on a room and auto-injected into modes 2-4 prompts.

### Deployment
Deployed to Vercel. `vercel.json` rewrites all routes to `index.html` for SPA routing.

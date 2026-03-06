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

All env vars are prefixed `VITE_` and accessed via `import.meta.env`. If Supabase vars are missing, `supabase` is `null` and all DB functions no-op gracefully.

---

## Architecture

### State Management
All application state lives in `src/App.jsx` — there is no external state library. `App` acts as the single source of truth, passing props and callbacks down to views.

Key state in `App.jsx`:
- `user` — logged-in user object (persisted in `localStorage` under `lalasweet_user`)
- `rooms` — array of room objects (each with nested `histories`)
- `currentRoom` — currently selected room
- `mode` — active AI mode (1-4)
- `guide` / `workingStyle` — global documents fetched from DB on login
- `selectedModel` — active AI model (persisted in `localStorage`)
- `draft` — form field cache (persisted in `localStorage` under `lalasweet_draft`)
- `toast` — `{ msg, type }` for notification display

Draft auto-save: every form value change calls `setDraft(...)` which immediately writes to `localStorage`. This survives page reloads.

### Views (hash-based routing)
| Hash | View | Component |
|------|------|-----------|
| `#home` | Room list + quick actions | `HomeView` |
| `#room` | Single member's history | `RoomView` |
| `#mode` | Active AI mode form | `ModeView` |
| `#admin` | Admin panel | `AdminView` |

Login is handled outside the hash system — if `user` state is null, `LoginView` is rendered unconditionally, regardless of hash.

Navigation: `window.location.hash = '#view'` sets the view. `react-router-dom` is installed but **not used**.

### AI Layer (`src/services/aiService.js`)
Calls the Anthropic Messages API **directly from the browser** using `anthropic-dangerous-direct-browser-access: true`. No backend proxy.

```js
// Core call signature
callAI({ system, messages, model, maxTokens })
// Returns: string (AI response text)
```

- `max_tokens`: 4096
- `temperature`: 0.7
- Models defined in `src/utils/constants.js` under `AI_MODELS`

Available models:
| Key | Model ID | Label |
|-----|----------|-------|
| `opus` | `claude-opus-4-20250514` | 오퍼스 (고성능) |
| `sonnet` | `claude-sonnet-4-20250514` | 소넷 (효율적) |

The model selector renders as an icon toggle in the bottom bar of `App.jsx`.

### Data Layer (`src/services/supabase.js`)
Supabase is used for all persistence.

**Auth flows:**
- **Username/password**: Custom `users` table, SHA-256 hashed in browser via `crypto.subtle`
- **Google OAuth**: Via Supabase Auth, synced into the custom `users` table via `syncGoogleUser()`
- `loginUser(username, password)` handles both flows; auto-registers on first login
- Session stored in `localStorage` (lalasweet_user key)

**Key tables:**

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | Custom auth | `id` (UUID), `username`, `password_hash`, `password_plain`, `email`, `created_at`, `last_login` |
| `rooms` | Team members | `id` (string), `team`, `name`, `level`, `role`, `created_at`, `updated_at`, `user_id`, `fixed_initiative` |
| `histories` | AI results | `id`, `room_id` (FK cascade), `mode`, `mode_label`, `result`, `info` (JSONB), `ts` |
| `org_goals` | Team goals per user | `team`, `goals`, `user_id`, `updated_at` (composite PK: team+user_id) |
| `level_guides` | Global PDF guide | `id`, `name`, `data` (base64), `created_at`, `updated_at` |
| `working_style` | Global text doc | `id`, `content`, `updated_at` |
| `agent_logs` | Audit trail | `ts` (PK), `mode`, `mode_label`, `name`, `team`, `role`, `level`, `result`, `date`, `user_id`, `username` |

**RLS policies**: All tables grant full access to the `authenticated` role. No row-level filtering.

**Key exported functions:**
```js
// Auth
loginUser(username, password) → { user } | { error }
syncGoogleUser(session) → user object
changeUserPassword(userId, oldPw, newPw) → { error }

// Rooms
getRooms(userId) → rooms[] with nested histories[]
saveRoom(room, userId) → upserted room
deleteRoom(roomId) → void

// Histories
addRoomHistory(roomId, entry) → void

// Org Goals
getOrgGoals(team, userId) → { goals }
saveOrgGoals(team, goals, userId) → void

// Global Docs
getLevelGuide() → { name, data }
saveLevelGuide(name, base64) → void
deleteLevelGuide() → void
getWorkingStyle() → { content }
saveWorkingStyle(content) → void
deleteWorkingStyle() → void

// Admin
getAgentLogs() → logs[]
saveAgentLog(entry) → void
clearAgentLogs() → void
getAllUsers() → users[]
deleteUser(userId) → void
resetUserPassword(userId) → sets to "1234"
```

Schema migrations are tracked in `supabase_migration_*.sql` files at the root, applied in this order:
1. `supabase_schema.sql` — initial schema
2. `supabase_migration_login.sql` — users table, user_id FKs, composite PK for org_goals
3. `supabase_migration_email.sql` — add email to users
4. `supabase_migration_rls_fix.sql` — authenticated RLS policies
5. `supabase_migration_working_style.sql` — working_style table
6. `supabase_migration_fixed_initiative.sql` — fixed_initiative column on rooms

### System Prompts (`src/utils/constants.js`)
- `BASE` — shared preamble: Lalasweet "value-based performance management" context, 7 core values, level criteria (L1–L5)
- `SYS[1]` – `SYS[4]` — mode-specific prompts that extend `BASE`
- `workingStyle` (from DB) is appended to every system prompt at call time in `App.jsx:callAPI`
- `guide` (PDF from DB) is always attached as a base64 document in every API call
- Org goals PDF is attached only when mode 1 uses PDF mode

**7 Core Values** (used across all prompts):
문제정의 / 목표설정 / 가설적 사고 / 피드백 / 이니셔티브 / 학습 / 원팀

**Level Criteria (L1–L5):**
- L1: 주어진 업무 수행 및 기록
- L2: 팀 목표 기여
- L3: 독립적 임팩트
- L4: 비즈니스 임팩트
- L5: 비즈니스 임팩트 + 조직 문제 해결

**Mode-specific prompt highlights:**
- **SYS[1] (Initiative)**: Leader expectation is TOP PRIORITY. Core/Challenge/BAU ratio 60:25:15. OKR connection generates ultra-detailed daily/weekly actions. Must tag values like `[문제정의/학습]`.
- **SYS[2] (Performance 1on1)**: GROW model agenda. Format: `📨 [YY.MM] Agenda (Name)`.
- **SYS[3] (Meeting Note)**: 600-char max, values-centric. Format: `📅 [YY.MM] Meeting Note`.
- **SYS[4] (Rapport 1on1)**: Psychological safety + One Team. Format: `☕️ [YY.MM] Agenda`.

### Styling
All styles are **inline JS objects** — no CSS modules, no Tailwind. Shared design tokens and style objects are exported from `src/utils/constants.js`.

**Design tokens (`C` object):**
```js
C.p    = '#2478FF'   // primary blue
C.g50  = '#F7F9FC'   // lightest gray (bg)
C.g100 = '#EEF2F7'
C.g200 = '#E2E8F2'
C.g400 = '#9AAAC0'
C.g600 = '#5A6B82'
C.g800 = '#1A2638'   // darkest (text)
C.gold = '#F5A623'
C.green= '#22C55E'
C.red  = '#EF4444'
C.w    = '#FFFFFF'
C.bg   = '#F7F9FC'
```

**Shared style objects:**
| Export | Purpose |
|--------|---------|
| `inp` | Input/textarea base styles |
| `lbl` | Label base styles |
| `crd` | Card container styles |
| `bP(ok)` | Primary button (disabled state via `ok` boolean) |
| `bS` | Secondary/ghost button |

Font: `Pretendard` (loaded via CSS or system fallback). UI is **Korean-language throughout**.

### Common UI Components (`src/components/ui/common.jsx`)
- **`Md(t)`** — lightweight markdown renderer (bold `**`, bullets `- `, emoji headings `# 🚀`, horizontal rules `---`)
- **`Shell({ children, title, onBack })`** — page wrapper with header bar and back button
- **`GS(guide)`** — level guide status badge (green ✓ loaded / gold ⚠️ not loaded)
- **`CheckBtn({ checked, onClick })`** — toggle checkbox button
- **`TabToggle({ value, onChange, options })`** — segmented control tabs

Toast notifications: `window.showToast(msg, type)` — custom event system, auto-dismisses after 3 seconds. Info = blue, error = red. Rendered in `App.jsx`.

---

## Views — Detailed

### `LoginView`
- Username + password fields with Enter key support
- Google OAuth button (calls `supabase.auth.signInWithOAuth`)
- Auto-registers on first username login
- Handles OAuth errors from hash params (`?error=...`)

### `HomeView`
- Room list with real-time search (name/team filter)
- "방 만들기" button → inline creation form (team, name, level, role)
- Quick mode selection modal (pick member → navigate to `#mode`)
- Password change modal
- Admin panel button (password: `sweet0110`)
- Logout (clears localStorage + Supabase session)

### `RoomView`
- Member details: team, name, level, role, last modified
- 4 mode buttons (🚀 이니셔티브 / 📅 1on1 / 📝 회의록 / ☕️ 라포 1on1)
- Pinned initiative: shows `fixed_initiative` from room, expandable, unpin button
- History list: mode label, timestamp, expandable result with copy-to-clipboard
- Delete room button (with confirmation)

### `ModeView` — 4-mode form wizard
**Mode 1 (이니셔티브 — Initiative):**
- Step 0: Org name, period, member name; toggle for existing initiative
- Step 1: Level, role, leader expectation (+ recent suggestions), pre-level toggle
- Step 2: Personal OKR (toggle "no OKR" or textarea input)
- Step 3: Org goals — text mode or PDF mode (upload/use saved)
- Step 4: Confirm all inputs + generate
- Result actions: Copy, Register (Flex link), Pin to room, Modify
  - Modify: specificity slider (60%–150%), sends previous result back to AI

**Mode 2 (1on1 아젠다 — Performance):**
- Input: name, level, role, initiatives (textarea), leader concern
- Confirm step → generate

**Mode 3 (회의록 — Meeting Note):**
- Input: name, meeting transcript (min 20 chars required)
- Direct generate (no confirm step)

**Mode 4 (라포 1on1 — Rapport):**
- Input: name, role, context
- Direct generate (no confirm step)

### `AdminView` — 4 tabs
1. **가이드 (Guide)**: Upload/replace/delete level guide PDF (max 4MB, stored as base64)
2. **워킹스타일 (Working Style)**: Edit global working style text document; save/delete
3. **로그 (Logs)**: View/filter agent logs by mode; clear all logs
4. **사용자 (Users)**: List all users; reset password to "1234"; delete user (cascades data)

Admin access password: `sweet0110` (hardcoded in `HomeView`)

---

## Room + Mode Flow

A "room" represents one team member. Modes (1-4) generate AI content for that member.

1. Create room with team, name, level, role
2. Select a mode → `ModeView` pre-fills name from `currentRoom`
3. Complete multi-step form → `callAPI()` in `App.jsx` assembles the prompt
4. Result is saved as a history entry on the room via `addRoomHistory()`
5. Result is also logged to `agent_logs` for admin review
6. Mode 1 results can be **pinned** (`fixed_initiative` column on room)
7. Pinned initiative auto-injects into the system prompt for modes 2-4

---

## Key Conventions

- **No external state library** — all state in `App.jsx`, prop-drilling only
- **No React Router** — hash-based navigation via `window.location.hash`
- **No CSS files** (beyond `index.css`/`App.css` for global resets) — all styles are inline JS objects using `C` tokens from `constants.js`
- **No backend** — Anthropic API called directly from browser with the `dangerous-direct-browser-access` header
- **Korean UI** — all user-facing text, labels, and prompts are in Korean
- **Graceful no-op** — all Supabase functions check `if (!supabase) return` to handle missing env vars
- **Draft persistence** — form state always written to `localStorage.lalasweet_draft` on change
- **Toast system** — use `window.showToast(msg, 'info'|'error')` for all user feedback

---

## File Map

```
src/
├── App.jsx                          # Root: state, routing, callAPI, toast
├── main.jsx                         # React entry point
├── App.css / index.css              # Global resets only
├── components/
│   ├── views/
│   │   ├── LoginView.jsx            # Auth (username/password + Google OAuth)
│   │   ├── HomeView.jsx             # Room list, quick actions, password change
│   │   ├── RoomView.jsx             # Member history, pinned initiative
│   │   ├── ModeView.jsx             # 4-mode AI generation wizard
│   │   └── AdminView.jsx            # Guide, working style, logs, user mgmt
│   └── ui/
│       └── common.jsx               # Md, Shell, GS, CheckBtn, TabToggle
├── services/
│   ├── aiService.js                 # Anthropic Messages API calls
│   └── supabase.js                  # All DB operations + auth
└── utils/
    └── constants.js                 # AI_MODELS, BASE/SYS prompts, C tokens, inp/lbl/crd/bP/bS

supabase_schema.sql                  # Initial DB schema
supabase_migration_*.sql             # Incremental migrations (apply in order)
vercel.json                          # SPA routing (all → index.html)
vite.config.js                       # Vite + React plugin
eslint.config.js                     # ESLint 9 flat config
```

---

## Deployment

Deployed to Vercel. `vercel.json` rewrites all routes to `index.html` for SPA routing. Set the three `VITE_*` environment variables in the Vercel project settings.

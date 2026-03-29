# LifeBlocks — Full Project Plan & Requirements

> This file captures the original prompt, requirements, and implementation plan for the LifeBlocks game project. Maintained throughout development.

---

## 📋 Original Prompt (User Requirements)

### Stack
- Next.js (App Router) + TypeScript
- Lucide icons
- Optional Zustand for state
- Optional PostgreSQL hooks (no strict backend dependency yet)
- Responsive — works on tablets, mobile phones, iOS and Android

---

### 🧠 Concept
- Each block = a **life decision**
- Each block has: cost, category, risk, insurance impact
- Player has a **configurable insurance balance (NOT fixed)**
- Game ends when:
  - insurance runs out
  - grid is full

---

### 🎮 CORE GAMEPLAY

#### Grid
- Size: 10x20
- No automatic falling
- User **drags blocks from a side panel and drops onto grid**
- Snap-to-grid behavior required

#### Block Structure
Each block is composed of **smaller units (mini-blocks)**:
- Each mini-block = % of total cost
- Example: Total cost = ₹10,000 → Block has 5 mini-blocks → each = ₹2,000
- This must be visually represented.

#### Block Types
```ts
type Block = {
  id: string
  type: "health" | "vehicle" | "property" | "lifestyle" | "insurance" | "fd" | "drinking" | "liability" | "assets"
  totalCost: number
  miniBlocks: number
  riskLevel: "low" | "medium" | "high"
  insured: boolean
}
```

#### Block Categories
- **health** → essential, medium risk
- **vehicle** → medium-high risk
- **property** → high risk
- **lifestyle** → no return (fun spend)
- **insurance** → reduces penalties
- **fd (Fixed Deposit)** → low risk, gives bonus on row completion
- **drinking** → high risk, negative multiplier
- **liability** → recurring penalty
- **assets** → long-term reward boost

---

### 🎯 Row Completion Logic
When a row is filled:
1. Sum all mini-block values → total row cost
2. Apply modifiers:
   - insured blocks → reduce penalty
   - fd/assets → bonus multiplier
   - drinking/liability → penalty multiplier
3. Apply result:
```ts
if (goodFinancialMix) {
  insuranceBalance += reward
  score += reward
} else {
  insuranceBalance -= penalty
}
```

---

### 💰 Insurance System
- Insurance is **dynamic (user-configurable at start)**
- Example: `insuranceBalance = userSelectedValue (e.g., 20000, 50000, 100000)`

---

### 🖱️ Drag & Drop Mechanics (CRITICAL)
- Blocks appear in a **side tray (queue panel)**
- User can: drag block, preview placement (ghost shadow), drop onto grid
- Must support: collision detection, invalid placement prevention
- Use: `react-dnd` OR pointer-based custom drag logic

---

### 🎨 UI / UX (HIGH PRIORITY)

#### Design must be:
- modern, playful, visually punchy, gamified

#### Required UI Elements:
1. 🎮 Game Board (center)
2. 📦 Block Tray (right side)
3. 💰 Insurance Meter (top)
4. ⭐ Score Display
5. 🔔 Animated Feedback: "+₹500 Smart Move", "-₹800 Risky Choice"

#### Visual Style:
- Bright gradients
- Soft shadows
- Rounded blocks
- Micro animations: hover scale, drop bounce, row clear animation

---

### 💾 Data Layer (Light Backend)
API placeholders:
- POST `/api/start`
- POST `/api/move`
- POST `/api/end`

Storage: local state (Zustand) + optional API hook (mock for now)

---

### 🏗️ Code Structure
```
/app
/components
  /game
    GameBoard.tsx
    Block.tsx
    MiniBlock.tsx
    DragLayer.tsx
    SideTray.tsx
    ScorePanel.tsx
/lib
  gameEngine.ts
  blockGenerator.ts
/store
  useGameStore.ts
/types
```

---

### ⚙️ Game Engine Responsibilities
- grid state
- placement validation
- row detection
- scoring logic
- insurance calculations

---

## 🏗️ Implementation Plan

### Stack Decisions
| Technology | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR + API routes built-in |
| Styling | Tailwind CSS 3.4 | Rapid responsive UI |
| State | Zustand 5 + immer | Zero-config, great DX, direct mutation |
| Drag-and-Drop | react-dnd + dnd-multi-backend | Auto HTML5↔Touch switching for iOS/Android |
| Animation | framer-motion 11 | Spring physics, AnimatePresence |
| Icons | lucide-react | Lightweight, tree-shakeable |

### Final Folder Structure
```
s:/P/LifeBlocks/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       ├── start/route.ts
│       ├── move/route.ts
│       └── end/route.ts
├── components/game/
│   ├── GameRoot.tsx         # DnD provider + phase routing
│   ├── GameLayout.tsx       # Playing/paused layout
│   ├── GameBoard.tsx        # 10×20 drop target + hover preview
│   ├── Block.tsx            # Draggable tray block
│   ├── MiniBlock.tsx        # Single colored cell
│   ├── DragLayer.tsx        # Custom drag ghost
│   ├── SideTray.tsx         # Block queue panel
│   ├── ScorePanel.tsx       # Score + combo
│   ├── InsuranceMeter.tsx   # Health bar
│   ├── FeedbackToast.tsx    # Animated pop-ups
│   ├── GameSetup.tsx        # Start screen
│   └── GameOver.tsx         # End screen
├── lib/
│   ├── gameEngine.ts
│   └── blockGenerator.ts
├── store/
│   └── useGameStore.ts
├── types/
│   └── index.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### Game Logic
- `BlockShape` = 2D bitmask `(0|1)[][]` → trivial collision detection
- Row evaluation multiplier system:
  - Bonus: fd/assets (+0.3), insured (+0.2), insurance block (+0.15), 4+ types (+0.25), combo (+0.1×n)
  - Penalty: drinking (-0.4), liability (-0.35), uninsured risk (-0.2)
- Atomic `placeBlock` action: validate → place → check rows → evaluate → update balance → check game-over

### DnD on Mobile
- `TouchBackend` with `delayTouchStart: 150` prevents accidental drags
- `touch-action: none` on the game board div
- Custom `DragLayer` replaces ugly HTML5 ghost

### Key Implementation Notes
| Issue | Solution |
|---|---|
| iOS touch drag | `TouchBackend` + `touch-action: none` on board |
| Merging DnD ref + regular ref | `useCallback` setter calling both refs |
| Rotation sync | Store rotated shape in Zustand, not component state |
| Immer + array reassignment | `draft.grid = clearRows(...)` |
| iOS viewport height | `min-h-dvh` not `min-h-screen` |

---

## 📊 Progress Tracker

### Phase 1: Foundation ✅
- [x] package.json + tsconfig + next.config + tailwind.config
- [x] npm install (with --legacy-peer-deps for React 19 compat)
- [x] LIFEBLOCKS_PLAN.md (this file)

### Phase 2: Core Logic ✅
- [x] types/index.ts
- [x] lib/gameEngine.ts
- [x] lib/blockGenerator.ts
- [x] store/useGameStore.ts

### Phase 3: Components ✅
- [x] app/layout.tsx + app/page.tsx + app/globals.css
- [x] components/game/GameRoot.tsx (DnD provider)
- [x] components/game/DragLayer.tsx
- [x] components/game/GameBoard.tsx
- [x] components/game/Block.tsx
- [x] components/game/MiniBlock.tsx
- [x] components/game/SideTray.tsx
- [x] components/game/ScorePanel.tsx
- [x] components/game/InsuranceMeter.tsx
- [x] components/game/FeedbackToast.tsx
- [x] components/game/GameSetup.tsx
- [x] components/game/GameOver.tsx
- [x] components/game/GameLayout.tsx

### Phase 4: API Routes ✅
- [x] app/api/start/route.ts
- [x] app/api/move/route.ts
- [x] app/api/end/route.ts

---

## 🔄 Change Log
- 2026-03-29: Project initialized, plan documented
- 2026-03-29: Full MVP complete — build passes, TypeScript clean, all 13 components written
- 2026-03-29: Added username field (GameSetup input → stored in Zustand → shown in header/GameOver/pause overlay)
- 2026-03-29: Added CalcPanel (left side of play area) — shows: Summary (total spent, net change, score), Category Breakdown with animated bars, Row Log with live calc history (delta, row value, block types, reason for each cleared row); calcHistory tracked in Zustand store (last 20 entries)
- 2026-03-29: Fixed grid scaling bug — GameBoard was expanding due to max-w-5xl container; fixed with explicit maxWidth: 360px wrapper + changed container to max-w-4xl
- 2026-03-29: Full responsive layout — CalcPanel hidden on mobile/tablet (lg breakpoint); shown as horizontal scrollable row below board on small screens; SideTray scrollable with max-height; GameSetup scrollable on small phones

### ✅ Grid Scale Fix + Full Responsive Layout (2026-03-29)
**Problem**: Changing container from max-w-xl → max-w-5xl caused the GameBoard (width:100%) to expand across the full width.

**Fix**:
- GameBoard wrapper div: `style={{ maxWidth: "360px" }}` — hard cap on board width
- Container: `max-w-4xl` (good for 3-column desktop layout)
- CalcPanel: `hidden lg:flex` (desktop column) + `flex lg:hidden` (mobile horizontal cards below board)
- SideTray: fixed `w-[100px] sm:w-[120px]` + `overflow-y-auto` with `max-height`
- GameSetup: `overflow-y-auto` + `items-start sm:items-center` for small phone scroll

**Responsive breakpoints**:
| Screen | Layout |
|--------|--------|
| < lg (< 1024px) | Board + SideTray (top) · CalcPanel horizontal cards (below) |
| ≥ lg (≥ 1024px) | CalcPanel (left) · Board (center) · SideTray (right) |

---

## 📋 Feature Requests Log

### ✅ Username + Calculations Panel (2026-03-29)
**Request**: Show calculations on the side of the play area + add username displayed at top.

**Implementation**:
- `username: string` added to `GameState`, collected in `GameSetup` (text input), shown in `GameLayout` header badge, pause overlay, and `GameOver` screen
- `CalcEntry` interface: `{ id, timestamp, rowValue, delta, reason, isGood, blocksInRow }`
- `calcHistory: CalcEntry[]` added to `GameState`; `placeBlock` action pushes a new entry for every completed row (kept to last 20)
- New `components/game/CalcPanel.tsx` — left panel with 3 sections:
  1. **Summary**: total spent, net insurance change, current score
  2. **By Category**: animated progress bars showing spending split across all 9 block types
  3. **Row Log**: scrollable feed of every row clear with green/red cards showing delta, row value, emoji block types, and modifier reason

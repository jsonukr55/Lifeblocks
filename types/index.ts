export type BlockType =
  | "health"
  | "vehicle"
  | "property"
  | "lifestyle"
  | "insurance"
  | "fd"
  | "drinking"
  | "liability"
  | "assets";

export type RiskLevel = "low" | "medium" | "high";

// 2D bitmask — 1 = occupied cell, 0 = empty
export type BlockShape = (0 | 1)[][];

export interface Block {
  id: string;
  type: BlockType;
  label: string;
  totalCost: number;
  miniBlocks: number; // count of 1s in shape
  riskLevel: RiskLevel;
  insured: boolean;
  shape: BlockShape;
  color: string; // Tailwind color key (e.g., "rose", "blue")
}

export interface PlacedBlock {
  block: Block;
  originRow: number;
  originCol: number;
}

export interface GridCell {
  blockId: string | null;
  miniBlockValue: number;
  type: BlockType | null;
  insured: boolean;
}

// Grid is GRID_ROWS rows × GRID_COLS cols
export type Grid = GridCell[][];

export type GamePhase = "setup" | "playing" | "paused" | "gameover";

export interface FeedbackMessage {
  id: string;
  text: string;
  type: "bonus" | "penalty" | "neutral";
  timestamp: number;
}

/** One entry in the live calculations log */
export interface CalcEntry {
  id: string;
  timestamp: number;
  rowValue: number;    // sum of all mini-block values in the row (amount invested)
  returnValue: number; // totalValue * multiplier (capital returned)
  delta: number;       // returnValue - rowValue (net profit/loss)
  reason: string;      // e.g. "FD bonus · Insured protection"
  isGood: boolean;
  blocksInRow: BlockType[]; // unique types in that row
}

export interface GameState {
  phase: GamePhase;
  grid: Grid;
  placedBlocks: PlacedBlock[];
  trayBlocks: Block[];
  score: number;
  insuranceBalance: number;
  initialInsurance: number;
  combo: number;
  feedback: FeedbackMessage | null;
  rowsCleared: number;
  username: string;
  calcHistory: CalcEntry[];
}

export interface RowClearResult {
  rowIndex: number;
  totalValue: number;
  returnValue: number; // totalValue * multiplier (capital returned to player)
  delta: number;       // returnValue - totalValue (net profit/loss)
  reason: string;
  isGood: boolean;
}

// react-dnd drag item
export interface DragItem {
  type: "BLOCK";
  block: Block;
  sourceIndex: number;
}

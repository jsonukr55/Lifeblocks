import { Grid, GridCell, Block, BlockShape, RowClearResult } from "@/types";

export const GRID_ROWS = 20;
export const GRID_COLS = 10;

export function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_ROWS }, () =>
    Array.from(
      { length: GRID_COLS },
      (): GridCell => ({
        blockId: null,
        miniBlockValue: 0,
        type: null,
        insured: false,
      })
    )
  );
}

/**
 * Returns true if the block shape can be placed at (row, col)
 * without going out-of-bounds or overlapping existing cells.
 */
export function canPlaceBlock(
  grid: Grid,
  shape: BlockShape,
  row: number,
  col: number
): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 0) continue;
      const gr = row + r;
      const gc = col + c;
      if (gr < 0 || gr >= GRID_ROWS || gc < 0 || gc >= GRID_COLS) return false;
      if (grid[gr][gc].blockId !== null) return false;
    }
  }
  return true;
}

/**
 * Returns a new grid with the block placed at (row, col).
 * Caller must ensure canPlaceBlock returns true first.
 */
export function placeBlockOnGrid(
  grid: Grid,
  block: Block,
  row: number,
  col: number
): Grid {
  const next = grid.map((r) => r.map((cell) => ({ ...cell })));
  const miniBlockValue = block.totalCost / block.miniBlocks;

  for (let r = 0; r < block.shape.length; r++) {
    for (let c = 0; c < block.shape[r].length; c++) {
      if (block.shape[r][c] === 0) continue;
      next[row + r][col + c] = {
        blockId: block.id,
        miniBlockValue,
        type: block.type,
        insured: block.insured,
      };
    }
  }
  return next;
}

/**
 * Returns indices of all fully-filled rows.
 */
export function checkCompletedRows(grid: Grid): number[] {
  const completed: number[] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    if (grid[r].every((cell) => cell.blockId !== null)) {
      completed.push(r);
    }
  }
  return completed;
}

/**
 * Evaluates a completed row and returns a financial result.
 * Positive delta = reward added to insurance + score.
 * Negative delta = penalty subtracted from insurance.
 */
export function evaluateRow(
  grid: Grid,
  rowIndex: number,
  combo: number
): RowClearResult {
  const row = grid[rowIndex];
  const totalValue = row.reduce((sum, cell) => sum + cell.miniBlockValue, 0);

  const types = new Set(row.map((c) => c.type).filter(Boolean));
  const hasInsured = row.some((c) => c.insured);
  const hasDrinking = types.has("drinking");
  const hasLiability = types.has("liability");
  const hasFd = types.has("fd");
  const hasAssets = types.has("assets");
  const hasInsuranceBlock = types.has("insurance");
  const uniqueTypeCount = types.size;

  let multiplier = 1.0;
  const reasons: string[] = [];

  // Bonuses
  if (hasFd || hasAssets) {
    multiplier += 0.3;
    reasons.push(hasFd && hasAssets ? "Investment combo" : hasFd ? "FD bonus" : "Asset bonus");
  }
  if (hasInsured) {
    multiplier += 0.2;
    reasons.push("Insured protection");
  }
  if (hasInsuranceBlock) {
    multiplier += 0.15;
    reasons.push("Insurance coverage");
  }
  if (uniqueTypeCount >= 4) {
    multiplier += 0.25;
    reasons.push("Diversified portfolio");
  }
  if (combo > 0) {
    multiplier += combo * 0.1;
    reasons.push(`${combo + 1}x combo`);
  }

  // Penalties
  if (hasDrinking) {
    multiplier -= 0.4;
    reasons.push("Drinking penalty");
  }
  if (hasLiability) {
    multiplier -= 0.35;
    reasons.push("Liability risk");
  }
  if (!hasInsured && (hasDrinking || hasLiability)) {
    multiplier -= 0.2;
    reasons.push("Uninsured risk");
  }

  // Clamp
  multiplier = Math.max(0.05, multiplier);

  const isGood = multiplier >= 1.0;
  const delta = isGood
    ? Math.round(totalValue * (multiplier - 1))
    : -Math.round(totalValue * (1 - multiplier));

  return {
    rowIndex,
    totalValue,
    delta,
    reason: reasons.length > 0 ? reasons.join(" · ") : "Row cleared",
    isGood,
  };
}

/**
 * Returns a new grid with the specified rows removed
 * and empty rows prepended at the top.
 */
export function clearRows(grid: Grid, rowIndices: number[]): Grid {
  const rowSet = new Set(rowIndices);
  const remaining = grid.filter((_, i) => !rowSet.has(i));
  const emptyRows = rowIndices.map(() =>
    Array.from(
      { length: GRID_COLS },
      (): GridCell => ({
        blockId: null,
        miniBlockValue: 0,
        type: null,
        insured: false,
      })
    )
  );
  return [...emptyRows, ...remaining];
}

/**
 * Game over if the top 2 rows have any occupied cells.
 */
export function isGridFull(grid: Grid): boolean {
  return (
    grid[0].some((c) => c.blockId !== null) ||
    grid[1].some((c) => c.blockId !== null)
  );
}

/**
 * Convert pixel position to grid cell coordinates.
 * Centers the block shape on the cursor.
 */
export function pixelToGrid(
  clientX: number,
  clientY: number,
  boardRect: DOMRect,
  shape: BlockShape
): { row: number; col: number } {
  const cellW = boardRect.width / GRID_COLS;
  const cellH = boardRect.height / GRID_ROWS;
  const rawCol = Math.floor((clientX - boardRect.left) / cellW);
  const rawRow = Math.floor((clientY - boardRect.top) / cellH);
  // Center block on cursor
  const col = rawCol - Math.floor(shape[0].length / 2);
  const row = rawRow - Math.floor(shape.length / 2);
  return { row, col };
}

/**
 * Calculate the final rank based on score.
 */
export function calculateRank(score: number): string {
  if (score >= 200000) return "Financial Guru";
  if (score >= 100000) return "Investment Expert";
  if (score >= 50000) return "Savvy Saver";
  if (score >= 20000) return "Cautious Planner";
  return "Beginner";
}

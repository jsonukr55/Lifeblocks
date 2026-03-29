"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { GameState, Block, FeedbackMessage, CalcEntry } from "@/types";
import {
  createEmptyGrid,
  canPlaceBlock,
  placeBlockOnGrid,
  checkCompletedRows,
  evaluateRow,
  clearRows,
  isGridFull,
} from "@/lib/gameEngine";
import { generateBlock, generateInitialTray, rotateShape } from "@/lib/blockGenerator";

interface GameActions {
  initGame: (initialInsurance: number, username: string) => void;
  placeBlock: (block: Block, row: number, col: number, trayIndex: number) => void;
  rotateBlockInTray: (trayIndex: number) => void;
  clearFeedback: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
}

type GameStore = GameState & GameActions;

const defaultState: GameState = {
  phase: "setup",
  grid: createEmptyGrid(),
  placedBlocks: [],
  trayBlocks: [],
  score: 0,
  insuranceBalance: 50000,
  initialInsurance: 50000,
  combo: 0,
  feedback: null,
  rowsCleared: 0,
  username: "",
  calcHistory: [],
};

export const useGameStore = create<GameStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      ...defaultState,

      initGame: (initialInsurance: number, username: string) => {
        set((state) => {
          state.phase = "playing";
          state.grid = createEmptyGrid();
          state.placedBlocks = [];
          state.trayBlocks = generateInitialTray(5);
          state.score = 0;
          state.insuranceBalance = initialInsurance;
          state.initialInsurance = initialInsurance;
          state.combo = 0;
          state.feedback = null;
          state.rowsCleared = 0;
          state.username = username.trim() || "Player";
          state.calcHistory = [];
        });
      },

      placeBlock: (block, row, col, trayIndex) => {
        const state = get();
        if (state.phase !== "playing") return;
        if (!canPlaceBlock(state.grid, block.shape, row, col)) return;

        set((draft) => {
          // 1. Deduct block cost — can go negative (debt allowed)
          const goingIntoDebt = draft.insuranceBalance < block.totalCost;
          draft.insuranceBalance -= block.totalCost;

          // 2. Place block on grid
          draft.grid = placeBlockOnGrid(draft.grid, block, row, col);

          // 3. Track placed block
          draft.placedBlocks.push({ block, originRow: row, originCol: col });

          // 4. Replenish tray
          draft.trayBlocks.splice(trayIndex, 1);
          draft.trayBlocks.push(generateBlock());

          // 5. Show debt warning (may be overridden by row-clear feedback below)
          if (goingIntoDebt) {
            draft.feedback = {
              id: uuidv4(),
              text: `⚠️ In Debt ₹${Math.abs(draft.insuranceBalance).toLocaleString("en-IN")} · Clear rows to recover!`,
              type: "penalty",
              timestamp: Date.now(),
            };
          }

          // 6. Check for completed rows
          const completedRows = checkCompletedRows(draft.grid);

          if (completedRows.length > 0) {
            let totalReturnValue = 0;
            let totalDelta = 0;
            let anyGood = false;

            completedRows.forEach((rowIdx) => {
              const result = evaluateRow(draft.grid, rowIdx, draft.combo);
              totalReturnValue += result.returnValue;
              totalDelta += result.delta;
              if (result.isGood) anyGood = true;

              const uniqueTypes = Array.from(
                new Set(draft.grid[rowIdx].map((c) => c.type).filter(Boolean))
              ) as import("@/types").BlockType[];

              const entry: CalcEntry = {
                id: uuidv4(),
                timestamp: Date.now(),
                rowValue: result.totalValue,
                returnValue: result.returnValue,
                delta: result.delta,
                reason: result.reason,
                isGood: result.isGood,
                blocksInRow: uniqueTypes,
              };
              draft.calcHistory.unshift(entry);
              if (draft.calcHistory.length > 20) draft.calcHistory.pop();
            });

            // Return capital from cleared rows + add to score
            draft.insuranceBalance += totalReturnValue;
            draft.score += totalReturnValue;

            if (totalDelta > 0) {
              draft.combo += 1;
            } else {
              draft.combo = 0;
            }

            draft.rowsCleared += completedRows.length;

            // Clear completed rows (must happen after evaluation)
            draft.grid = clearRows(draft.grid, completedRows);

            // Override feedback with row-clear result
            const absAmount = Math.abs(totalDelta);
            const prefix = totalDelta >= 0 ? "+" : "-";
            const msgType: FeedbackMessage["type"] =
              totalDelta > 0 ? "bonus" : totalDelta < 0 ? "penalty" : "neutral";

            const label =
              completedRows.length > 1
                ? `${completedRows.length} rows cleared!`
                : anyGood
                ? "Smart Move!"
                : "Risky Choice!";

            draft.feedback = {
              id: uuidv4(),
              text: `${prefix}₹${absAmount.toLocaleString("en-IN")} · ${label}`,
              type: msgType,
              timestamp: Date.now(),
            };
          } else {
            draft.combo = 0;
          }

          // 7. Game over when grid is full (debt alone doesn't end the game)
          if (isGridFull(draft.grid)) {
            draft.phase = "gameover";
          }
        });
      },

      rotateBlockInTray: (trayIndex) => {
        set((draft) => {
          const block = draft.trayBlocks[trayIndex];
          if (!block) return;
          draft.trayBlocks[trayIndex].shape = rotateShape(block.shape);
          // Recalculate miniBlocks count (doesn't change but ensures consistency)
          draft.trayBlocks[trayIndex].miniBlocks = block.shape
            .flat()
            .filter((v) => v === 1).length;
        });
      },

      clearFeedback: () => {
        set((draft) => {
          draft.feedback = null;
        });
      },

      pauseGame: () => {
        set((draft) => {
          if (draft.phase === "playing") draft.phase = "paused";
        });
      },

      resumeGame: () => {
        set((draft) => {
          if (draft.phase === "paused") draft.phase = "playing";
        });
      },

      resetGame: () => {
        set(() => ({
          ...defaultState,
          grid: createEmptyGrid(),
          trayBlocks: [],
        }));
      },
    }))
  )
);

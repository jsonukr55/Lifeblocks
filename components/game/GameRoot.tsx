"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { MultiBackend, TouchTransition } from "dnd-multi-backend";
import { useGameStore } from "@/store/useGameStore";
import GameSetup from "./GameSetup";
import GameLayout from "./GameLayout";
import GameOver from "./GameOver";

// Auto-switch between HTML5 (mouse) and Touch backend based on interaction type
const HTML5toTouch = {
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
    },
    {
      id: "touch",
      backend: TouchBackend,
      options: {
        enableMouseEvents: true,
        delayTouchStart: 100,
        ignoreContextMenu: true,
      },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

export default function GameRoot() {
  const phase = useGameStore((s) => s.phase);

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      {(phase === "setup") && <GameSetup />}
      {(phase === "playing" || phase === "paused") && <GameLayout />}
      {phase === "gameover" && <GameOver />}
    </DndProvider>
  );
}

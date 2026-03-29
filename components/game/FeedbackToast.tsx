"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function FeedbackToast() {
  const feedback = useGameStore((s) => s.feedback);
  const clearFeedback = useGameStore((s) => s.clearFeedback);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(clearFeedback, 2500);
    return () => clearTimeout(t);
  }, [feedback, clearFeedback]);

  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          key={feedback.id}
          initial={{ opacity: 0, y: -40, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`
            fixed top-4 left-1/2 -translate-x-1/2 z-50
            flex items-center gap-2 px-5 py-2.5 rounded-full
            font-bold text-sm shadow-2xl backdrop-blur-sm
            border whitespace-nowrap
            ${
              feedback.type === "bonus"
                ? "bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/40"
                : feedback.type === "penalty"
                ? "bg-red-500 border-red-400 text-white shadow-red-500/40"
                : "bg-slate-600 border-slate-500 text-white shadow-slate-600/40"
            }
          `}
        >
          {feedback.type === "bonus" ? (
            <TrendingUp className="w-4 h-4" />
          ) : feedback.type === "penalty" ? (
            <TrendingDown className="w-4 h-4" />
          ) : (
            <Minus className="w-4 h-4" />
          )}
          {feedback.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

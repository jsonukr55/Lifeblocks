"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Shield } from "lucide-react";

export default function InsuranceMeter() {
  const insuranceBalance = useGameStore((s) => s.insuranceBalance);
  const initialInsurance = useGameStore((s) => s.initialInsurance);

  const isInDebt = insuranceBalance < 0;
  const pct = Math.max(0, Math.min(100, (insuranceBalance / initialInsurance) * 100));
  const isLow = !isInDebt && pct < 25;
  const isCritical = !isInDebt && pct < 10;

  const barColor = isInDebt
    ? "from-red-700 to-red-500"
    : isCritical
    ? "from-red-600 to-red-400"
    : isLow
    ? "from-orange-500 to-amber-400"
    : pct > 70
    ? "from-emerald-500 to-green-400"
    : "from-yellow-500 to-amber-400";

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Shield
            className={`w-3.5 h-3.5 ${
              isCritical
                ? "text-red-400"
                : isLow
                ? "text-orange-400"
                : "text-emerald-400"
            }`}
          />
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Insurance
          </span>
        </div>
        <motion.span
          key={insuranceBalance}
          initial={{ scale: 1.15, color: isInDebt ? "#f87171" : isCritical ? "#f87171" : "#34d399" }}
          animate={{ scale: 1, color: isInDebt ? "#f87171" : isCritical ? "#f87171" : "#94a3b8" }}
          className={`text-xs font-bold tabular-nums ${
            isInDebt || isCritical ? "text-red-400" : "text-slate-400"
          }`}
        >
          {isInDebt ? "-" : ""}₹{Math.abs(insuranceBalance).toLocaleString("en-IN")}
        </motion.span>
      </div>

      <div className="relative h-3 bg-slate-800/80 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
        {/* Shine */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-full" />

        {/* Critical pulse overlay */}
        {isCritical && (
          <motion.div
            className="absolute inset-0 bg-red-500/30 rounded-full"
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
        )}
      </div>

      {/* Percentage / debt label */}
      <div className="flex justify-between text-[9px] text-slate-600">
        <span>0%</span>
        {isInDebt ? (
          <span className="text-red-500 font-bold animate-pulse">⚠️ DEBT</span>
        ) : (
          <span className={isCritical ? "text-red-500 font-bold" : isLow ? "text-orange-500" : ""}>
            {pct.toFixed(0)}%
          </span>
        )}
        <span>100%</span>
      </div>
    </div>
  );
}

"use client";
import React from "react";

export default function BusyOverlay({ show = false, rounded = "rounded-2xl" }) {
  if (!show) return null;
  return (
    <div className={`pointer-events-none absolute inset-0 ${rounded}`}>
      {/* dim backdrop */}
      <div className="absolute inset-0 bg-white/35 dark:bg-black/25 backdrop-blur-[1px]" />
      {/* top indeterminate bar */}
      <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden">
        <div className="loading-bar h-full w-1/2" />
      </div>
    </div>
  );
}

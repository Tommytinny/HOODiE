"use client";
import React from "react";

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border bg-slate-800 p-3 h-56"></div>
      ))}
    </div>
  );
}

export default function SkeletonLoader() { return <GridSkeleton />; }

import React from "react";

// Individual atomic skeleton elements
export const SkeletonPulse: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`bg-slate-200/80 dark:bg-slate-800/80 rounded animate-pulse ${className}`} />
  );
};

// 1. Grid of Stats Cards
export const CardSkeletonList: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="glass-card p-6 rounded-3xl border border-white/20 dark:border-white/5 flex items-center justify-between"
        >
          <div className="space-y-3 flex-1 mr-4">
            {/* Lighter sub-heading */}
            <SkeletonPulse className="h-3 w-1/2 rounded-full" />
            {/* Massive main value */}
            <SkeletonPulse className="h-7 w-3/4 rounded-full" />
          </div>
          {/* Circular/Square icon area */}
          <SkeletonPulse className="h-11 w-11 rounded-2xl flex-shrink-0" />
        </div>
      ))}
    </div>
  );
};

// 2. Table / List Row Loading
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center">
        <SkeletonPulse className="h-5 w-40 rounded-full" />
        <SkeletonPulse className="h-8 w-24 rounded-lg" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="py-4 px-6">
                  <SkeletonPulse className="h-3.5 w-24 rounded-full" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r} className="hover:bg-slate-50/20 dark:hover:bg-slate-850/10">
                {Array.from({ length: cols }).map((_, c) => (
                  <td key={c} className="py-5 px-6">
                    {c === 0 ? (
                      <div className="flex items-center gap-3">
                        {/* Avatar/Icon fallback */}
                        <SkeletonPulse className="h-8 w-8 rounded-full flex-shrink-0" />
                        <SkeletonPulse className="h-4 w-28 rounded-full" />
                      </div>
                    ) : c === cols - 1 ? (
                      <div className="flex gap-2">
                        <SkeletonPulse className="h-7 w-12 rounded-lg" />
                        <SkeletonPulse className="h-7 w-12 rounded-lg" />
                      </div>
                    ) : (
                      <SkeletonPulse className="h-3.5 w-20 rounded-full" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 3. Grid / Directory Card Loading (For Students, Faculty, Batches)
export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1 mr-4">
              {/* Badge */}
              <SkeletonPulse className="h-3.5 w-16 rounded-full" />
              {/* Title / Name */}
              <SkeletonPulse className="h-5 w-3/4 rounded-full" />
              {/* Secondary Details */}
              <SkeletonPulse className="h-3 w-1/2 rounded-full" />
            </div>
            {/* Avatar block */}
            <SkeletonPulse className="h-10 w-10 rounded-xl flex-shrink-0" />
          </div>
          
          <hr className="border-slate-100 dark:border-slate-850" />
          
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <SkeletonPulse className="h-3 w-20 rounded-full" />
              <SkeletonPulse className="h-3 w-24 rounded-full" />
            </div>
            <div className="flex justify-between items-center">
              <SkeletonPulse className="h-3 w-16 rounded-full" />
              <SkeletonPulse className="h-3 w-32 rounded-full" />
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <SkeletonPulse className="h-8 flex-1 rounded-xl" />
            <SkeletonPulse className="h-8 w-10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

// 4. Analytics / Chart Loading
export const ChartSkeleton: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-3xl space-y-6">
      <div className="flex justify-between items-center">
        <SkeletonPulse className="h-5 w-48 rounded-full" />
        <SkeletonPulse className="h-8 w-32 rounded-lg" />
      </div>
      {/* Wave bar layout to simulate a bar chart */}
      <div className="h-64 flex items-end justify-between px-4 pb-2 border-b border-slate-200 dark:border-slate-850">
        {[40, 75, 55, 90, 60, 80, 45, 70, 85, 50].map((h, i) => (
          <SkeletonPulse 
            key={i} 
            className="w-[7%] rounded-t-lg" 
            style={{ height: `${h}%` }} 
          />
        ))}
      </div>
      <div className="flex justify-between items-center px-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonPulse key={i} className="h-3 w-12 rounded-full" />
        ))}
      </div>
    </div>
  );
};

// 5. Config Form Loading (Whitelabel Settings, Support form, etc.)
export const FormSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 space-y-6">
      <div className="space-y-2">
        <SkeletonPulse className="h-6 w-1/3 rounded-full" />
        <SkeletonPulse className="h-3.5 w-1/2 rounded-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2.5">
            <SkeletonPulse className="h-3.5 w-24 rounded-full" />
            <SkeletonPulse className="h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>

      <div className="space-y-2.5">
        <SkeletonPulse className="h-3.5 w-24 rounded-full" />
        <SkeletonPulse className="h-24 w-full rounded-xl" />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
        <SkeletonPulse className="h-10 w-24 rounded-xl" />
        <SkeletonPulse className="h-10 w-36 rounded-xl" />
      </div>
    </div>
  );
};

// 6. Complete Module Panel skeleton
export const ModulePanelSkeleton: React.FC<{ type?: "grid" | "table" | "form" }> = ({ type = "grid" }) => {
  return (
    <div className="space-y-6">
      {/* Title & action button panel skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2 flex-1 max-w-sm">
          <SkeletonPulse className="h-7 w-2/3 rounded-full" />
          <SkeletonPulse className="h-3.5 w-1/2 rounded-full" />
        </div>
        <SkeletonPulse className="h-10 w-32 rounded-xl flex-shrink-0" />
      </div>
      
      {/* Render the selected visual style */}
      {type === "grid" && <GridSkeleton />}
      {type === "table" && <TableSkeleton rows={6} cols={5} />}
      {type === "form" && <FormSkeleton />}
    </div>
  );
};

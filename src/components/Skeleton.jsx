import React from 'react';

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-[28px] border border-slate-200/70 bg-white shadow-xl overflow-hidden">
          <div className="h-56 bg-slate-200/80 animate-pulse"></div>
          <div className="p-6 space-y-4">
            <div className="h-5 w-3/4 rounded-full bg-slate-200 animate-pulse"></div>
            <div className="h-4 w-1/2 rounded-full bg-slate-200 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-3 rounded-full bg-slate-200 animate-pulse"></div>
              <div className="h-3 rounded-full bg-slate-200 animate-pulse"></div>
              <div className="h-3 w-5/6 rounded-full bg-slate-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ButtonSkeleton = () => (
  <div className="inline-flex items-center gap-3 px-4 py-3 rounded-full bg-slate-200 animate-pulse" />
);

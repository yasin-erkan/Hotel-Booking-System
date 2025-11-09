import React from 'react';

const OwnerFooter = () => {
  return (
    <footer className="mt-auto border-t border-blue-500/20 bg-[linear-gradient(135deg,_rgba(15,23,42,0.92)_0%,_rgba(30,64,175,0.85)_100%)] text-slate-200 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <div>
          <p className="text-sm font-semibold text-blue-200/80">
            Owner Experience
          </p>
          <p className="mt-1 text-xs text-slate-300">
            Manage listings with confidence. Insights, controls and automations
            in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300/80">
          <span className="rounded-full border border-white/15 px-4 py-1">
            Support 24/7
          </span>
          <span className="rounded-full border border-white/15 px-4 py-1">
            Status Page
          </span>
          <span className="rounded-full border border-white/15 px-4 py-1">
            Release Notes
          </span>
        </div>
      </div>
      <div className="border-t border-white/10 bg-slate-900/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-4 text-xs text-slate-400/80 md:flex-row md:px-10">
          <p>© {new Date().getFullYear()} Atlas Host Console. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="transition hover:text-blue-200">
              Terms
            </a>
            <a href="#" className="transition hover:text-blue-200">
              Privacy
            </a>
            <a href="#" className="transition hover:text-blue-200">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default OwnerFooter;


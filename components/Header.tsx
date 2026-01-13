
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">GridSplit</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Image to Multi-Page PDF</span>
          </div>
        </div>

        <nav className="hidden lg:flex gap-6">
          <a href="#" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
          <a href="#" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Printer Settings</a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block h-8 w-[1px] bg-slate-200 mx-2"></div>
          <button className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-all">
            Feedback
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

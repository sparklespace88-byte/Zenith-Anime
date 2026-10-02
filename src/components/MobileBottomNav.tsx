import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, Bookmark, User as UserIcon, Shield, Search } from 'lucide-react';

export const MobileBottomNav: React.FC<{ onOpenSearch: () => void }> = ({ onOpenSearch }) => {
  const { currentView, navigateTo, currentUser, openAuthModal, theme } = useApp();

  return (
    <nav
      aria-label="Mobile Navigation"
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-white/95 border-slate-200 shadow-slate-300/40 text-slate-700'
          : 'bg-[#090b12]/95 border-white/10 text-white'
      }`}
    >
      <button
        onClick={() => navigateTo('home')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
          currentView === 'home' ? 'text-purple-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => navigateTo('browse')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
          currentView === 'browse' ? 'text-purple-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Compass className="w-4 h-4" />
        <span className="text-[10px]">Browse</span>
      </button>

      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-neutral-400 hover:text-neutral-200 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="text-[10px]">Search</span>
      </button>

      <button
        onClick={() => {
          if (currentUser) {
            navigateTo('profile');
          } else {
            openAuthModal('login');
          }
        }}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
          currentView === 'profile' ? 'text-purple-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Bookmark className="w-4 h-4" />
        <span className="text-[10px]">Watchlist</span>
      </button>

      {currentUser?.role === 'admin' ? (
        <button
          onClick={() => navigateTo('admin')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
            currentView === 'admin' ? 'text-amber-400 font-semibold' : 'text-amber-400/80 hover:text-amber-300'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span className="text-[10px]">Admin</span>
        </button>
      ) : (
        <button
          onClick={() => {
            if (currentUser) {
              navigateTo('profile');
            } else {
              openAuthModal('login');
            }
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
            currentView === 'profile' ? 'text-purple-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span className="text-[10px]">{currentUser ? 'Profile' : 'Sign In'}</span>
        </button>
      )}
    </nav>
  );
};

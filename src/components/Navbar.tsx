import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './UserAvatar';
import { Search, Flame, Bookmark, Shield, LogOut, User as UserIcon, Menu, X, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onSearchOpenChange?: (isOpen: boolean) => void;
  isExternalSearchOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchOpenChange, isExternalSearchOpen }) => {
  const {
    currentView,
    navigateTo,
    openBrowse,
    browseMode,
    currentUser,
    logout,
    openAuthModal,
    animeList,
    theme,
    toggleTheme
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Sync external search trigger (from mobile bottom nav)
  useEffect(() => {
    if (isExternalSearchOpen) {
      setIsSearchOpen(true);
      setTimeout(() => mobileInputRef.current?.focus(), 100);
    }
  }, [isExternalSearchOpen]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        onSearchOpenChange?.(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onSearchOpenChange]);

  // Filter anime for instant search results
  const searchResults = searchQuery.trim()
    ? animeList.filter(a =>
        a.published &&
        (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         a.altTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
         a.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())))
      ).slice(0, 5)
    : [];

  const handleSelectSearchItem = (animeId: string) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    onSearchOpenChange?.(false);
    setIsMobileMenuOpen(false);
    navigateTo('anime-detail', animeId);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      onSearchOpenChange?.(false);
      setIsMobileMenuOpen(false);
      navigateTo('browse');
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b transition-colors duration-200 ${
      theme === 'light'
        ? 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
        : 'bg-[#08090d]/95 border-white/10 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            navigateTo('home');
          }}
          className="text-left group flex items-center gap-2 focus:outline-none shrink-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white" />
          </div>
          <span className={`text-base sm:text-xl font-bold tracking-tight font-display transition-colors ${
            theme === 'light' ? 'text-slate-900' : 'text-white'
          }`}>
            Zenith<span className="text-purple-500">Anime</span>
          </span>
        </button>

        {/* Zone 2: Desktop clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <button
            onClick={() => navigateTo('home')}
            className={`transition-colors hover:text-white ${
              currentView === 'home' ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => openBrowse('all')}
            className={`transition-colors hover:text-white ${
              currentView === 'browse' && browseMode === 'all' ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            Browse Anime
          </button>
          <button
            onClick={() => openBrowse('popular')}
            className={`transition-colors hover:text-white ${
              currentView === 'browse' && browseMode === 'popular' ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => openBrowse('latest')}
            className={`transition-colors hover:text-white ${
              currentView === 'browse' && browseMode === 'latest' ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            Latest Releases
          </button>
        </nav>

        {/* Zone 3: Search bar + Actions (Guaranteed No Overflow) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Desktop Search Bar */}
          <div ref={searchRef} className="relative hidden md:block w-44 lg:w-64">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search anime, genres..."
                className="w-full bg-[#12151f] text-neutral-200 pl-8 pr-3 py-1.5 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 placeholder:text-neutral-500 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Desktop Autocomplete Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#121520] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5 z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Suggestions
                </div>
                {searchResults.map((anime) => (
                  <button
                    key={anime.id}
                    onClick={() => handleSelectSearchItem(anime.id)}
                    className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-white/5 text-left transition-colors"
                  >
                    <img
                      src={anime.posterImage}
                      alt={anime.title}
                      referrerPolicy="no-referrer"
                      className="w-8 h-10 object-cover rounded bg-neutral-800 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-white truncate">{anime.title}</div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <span className="text-amber-400 font-semibold">{anime.rating.toFixed(1)}</span>
                        <span>·</span>
                        <span>{anime.type}</span>
                        <span>·</span>
                        <span>{anime.releaseYear}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Search Trigger Icon */}
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              onSearchOpenChange?.(!isSearchOpen);
            }}
            aria-label="Search"
            className="md:hidden p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Switch Button */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center active:scale-90 ${
              theme === 'light'
                ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 ring-1 ring-amber-200'
                : 'text-amber-400 bg-white/5 hover:bg-white/10 hover:text-amber-300 ring-1 ring-white/10'
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform active:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-purple-600 transition-transform active:-rotate-45" />
            )}
          </button>

          {/* Watchlist shortcut button (desktop/tablet) */}
          {currentUser && (
            <button
              onClick={() => navigateTo('profile')}
              aria-label="View Watchlist"
              className="relative p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors hidden sm:flex items-center"
              title="My Watchlist"
            >
              <Bookmark className="w-4 h-4" />
              {currentUser.watchlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500"></span>
              )}
            </button>
          )}

          {/* User Auth or Profile Button */}
          {currentUser ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 sm:pr-3 rounded-full border border-white/10 bg-[#12151f] hover:border-purple-500/50 transition-all text-left"
              >
                <UserAvatar
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-500/40 shrink-0"
                />
                <span className="text-xs font-semibold text-white max-w-[70px] truncate hidden md:inline">
                  {currentUser.name}
                </span>
                {currentUser.role === 'admin' && (
                  <span className="text-[9px] text-amber-400 font-bold uppercase hidden sm:inline ml-0.5">Admin</span>
                )}
              </button>

              {/* Profile Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-[#121520] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{currentUser.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigateTo('profile');
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-neutral-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                      <span>My Profile & Watchlist</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('admin');
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-amber-300 hover:text-amber-200 hover:bg-white/5 flex items-center gap-2 font-medium"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-white/5 pt-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuthModal('login')}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="hidden sm:inline-block px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white border border-white/10 rounded-lg transition-colors whitespace-nowrap"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {isSearchOpen && (
        <div className="md:hidden bg-[#0c0e14] border-b border-white/10 px-3 py-2 animate-in fade-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anime, genres..."
              className="w-full bg-[#141722] text-neutral-200 pl-8 pr-8 py-2 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Mobile Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="mt-2 bg-[#121520] border border-white/10 rounded-xl overflow-hidden py-1 max-h-60 overflow-y-auto">
              {searchResults.map((anime) => (
                <button
                  key={anime.id}
                  onClick={() => handleSelectSearchItem(anime.id)}
                  className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-white/5 text-left border-b border-white/5 last:border-0"
                >
                  <img
                    src={anime.posterImage}
                    alt={anime.title}
                    referrerPolicy="no-referrer"
                    className="w-7 h-9 object-cover rounded bg-neutral-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-white truncate">{anime.title}</div>
                    <div className="text-[10px] text-neutral-400 flex items-center gap-1.5">
                      <span className="text-amber-400 font-semibold">{anime.rating.toFixed(1)}</span>
                      <span>·</span>
                      <span>{anime.type}</span>
                      <span>·</span>
                      <span>{anime.releaseYear}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0e14] border-b border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-150">
          <div className="flex flex-col gap-1 text-sm font-medium">
            <button
              onClick={() => {
                navigateTo('home');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-lg transition-colors ${
                currentView === 'home' ? 'bg-purple-600/20 text-purple-300 font-semibold' : 'hover:bg-white/5 text-neutral-200'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                openBrowse('all');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-lg transition-colors ${
                currentView === 'browse' && browseMode === 'all' ? 'bg-purple-600/20 text-purple-300 font-semibold' : 'hover:bg-white/5 text-neutral-200'
              }`}
            >
              Browse Anime Catalog
            </button>
            <button
              onClick={() => {
                openBrowse('popular');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-lg transition-colors ${
                currentView === 'browse' && browseMode === 'popular' ? 'bg-purple-600/20 text-purple-300 font-semibold' : 'hover:bg-white/5 text-neutral-200'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => {
                openBrowse('latest');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-lg transition-colors ${
                currentView === 'browse' && browseMode === 'latest' ? 'bg-purple-600/20 text-purple-300 font-semibold' : 'hover:bg-white/5 text-neutral-200'
              }`}
            >
              Latest Releases
            </button>
            <button
              onClick={() => {
                navigateTo('profile');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-lg transition-colors ${
                currentView === 'profile' ? 'bg-purple-600/20 text-purple-300 font-semibold' : 'hover:bg-white/5 text-neutral-200'
              }`}
            >
              My Profile & Watchlist
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => {
                  navigateTo('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2.5 rounded-lg hover:bg-white/5 text-amber-300 font-semibold flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Dashboard</span>
              </button>
            )}
            <button
              onClick={() => {
                navigateTo('about');
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-white/5 text-neutral-400 text-xs"
            >
              About Platform
            </button>
            <button
              onClick={() => {
                navigateTo('contact');
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-white/5 text-neutral-400 text-xs"
            >
              Contact Support
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

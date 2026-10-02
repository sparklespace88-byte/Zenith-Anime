import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AnimeCard } from '../components/AnimeCard';
import { FilterState } from '../types';
import { GENRES_LIST } from '../data/animeData';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

export const BrowseView: React.FC = () => {
  const { animeList, browseMode, browseGenre, browseNonce } = useApp();

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    genre: 'All',
    type: 'All',
    status: 'All',
    year: 'All',
    minRating: 0,
    sortBy: 'popularity'
  });

  const [visibleCount, setVisibleCount] = useState(12);

  // Navbar "Popular" / "Latest Releases" (and genre chips) open this page with a preset.
  useEffect(() => {
    setFilters({
      search: '',
      genre: browseGenre,
      type: 'All',
      status: 'All',
      year: 'All',
      minRating: 0,
      sortBy: browseMode === 'latest' ? 'newest' : 'popularity'
    });
    setVisibleCount(12);
  }, [browseMode, browseGenre, browseNonce]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Available release years derived from data
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(animeList.map(a => a.releaseYear))).sort((a, b) => b - a);
    return ['All', ...years.map(String)];
  }, [animeList]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.genre !== 'All') count++;
    if (filters.type !== 'All') count++;
    if (filters.status !== 'All') count++;
    if (filters.year !== 'All') count++;
    if (filters.minRating > 0) count++;
    return count;
  }, [filters]);

  // Filtered & Sorted anime list
  const filteredAnime = useMemo(() => {
    return animeList
      .filter((anime) => {
        if (!anime.published) return false;

        // Search query
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const matchTitle = anime.title.toLowerCase().includes(q);
          const matchAlt = anime.altTitle.toLowerCase().includes(q);
          const matchGenre = anime.genres.some(g => g.toLowerCase().includes(q));
          if (!matchTitle && !matchAlt && !matchGenre) return false;
        }

        // Genre filter
        if (filters.genre !== 'All' && !anime.genres.includes(filters.genre)) {
          return false;
        }

        // Type filter
        if (filters.type !== 'All' && anime.type !== filters.type) {
          return false;
        }

        // Status filter
        if (filters.status !== 'All' && anime.status !== filters.status) {
          return false;
        }

        // Year filter
        if (filters.year !== 'All' && anime.releaseYear !== parseInt(filters.year, 10)) {
          return false;
        }

        // Minimum Rating
        if (filters.minRating > 0 && anime.rating < filters.minRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'popularity') return (b.views || 0) - (a.views || 0);
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'newest') {
          if (b.releaseYear !== a.releaseYear) return b.releaseYear - a.releaseYear;
          // Same year: the anime with the most recent episode comes first.
          const latest = (x: typeof a) => x.episodes.reduce((m, e) => (e.releaseDate > m ? e.releaseDate : m), '');
          return latest(b).localeCompare(latest(a));
        }
        if (filters.sortBy === 'alphabetical') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [animeList, filters]);

  const displayedAnime = filteredAnime.slice(0, visibleCount);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      genre: 'All',
      type: 'All',
      status: 'All',
      year: 'All',
      minRating: 0,
      sortBy: 'popularity'
    });
    setVisibleCount(12);
  };

  return (
    <div className="pt-18 sm:pt-24 pb-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
          Browse Anime Catalog
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Filter through seasonal anime, movies, OVAs, and genres.
        </p>
      </div>

      {/* Filter Control Box */}
      <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-white/5 space-y-3 sm:space-y-5">
        {/* Top Search & Filter Toggle on Mobile */}
        <div className="flex gap-2 items-center justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search by title, genre..."
              className="w-full bg-[#0d0f17] text-neutral-200 pl-8 pr-3 py-2 rounded-xl text-xs border border-white/10 focus:outline-none focus:border-purple-500"
            />
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`sm:hidden flex items-center gap-1 px-3 py-2 rounded-xl text-xs border transition-colors ${
                showMobileFilters || activeFiltersCount > 0
                  ? 'bg-purple-600/20 border-purple-500/50 text-purple-300 font-semibold'
                  : 'bg-white/5 text-neutral-300 border-white/5'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs border border-white/5 transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Filters (Collapsible on mobile, always visible on tablet/desktop) */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3 pt-2 sm:pt-3 border-t border-white/5 ${showMobileFilters ? 'grid' : 'hidden sm:grid'}`}>
          {/* Genre */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Genre
            </label>
            <select
              value={filters.genre}
              onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
              className="w-full bg-[#0d0f17] text-neutral-200 px-2 py-1.5 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
            >
              {GENRES_LIST.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full bg-[#0d0f17] text-neutral-200 px-2 py-1.5 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Types</option>
              <option value="TV">TV Series</option>
              <option value="Movie">Movie</option>
              <option value="OVA">OVA</option>
              <option value="ONA">ONA</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full bg-[#0d0f17] text-neutral-200 px-2 py-1.5 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Statuses</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Year
            </label>
            <select
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              className="w-full bg-[#0d0f17] text-neutral-200 px-2 py-1.5 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>{yr === 'All' ? 'All Years' : yr}</option>
              ))}
            </select>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Rating
            </label>
            <select
              value={filters.minRating}
              onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
              className="w-full bg-[#0d0f17] text-neutral-200 px-2 py-1.5 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
            >
              <option value="0">All Ratings</option>
              <option value="8.0">★ 8.0 & Above</option>
              <option value="8.5">★ 8.5 & Above</option>
              <option value="9.0">★ 9.0 & Above</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="w-full bg-[#0d0f17] text-neutral-200 px-2 py-1.5 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Release Year</option>
              <option value="alphabetical">A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <p>
          Showing <span className="text-white font-bold">{displayedAnime.length}</span> of{' '}
          <span className="text-white font-bold">{filteredAnime.length}</span> titles
        </p>
      </div>

      {/* Anime Grid */}
      {displayedAnime.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-white/5 space-y-3 px-4">
          <p className="text-base sm:text-lg font-bold text-white font-display">No anime matches your filter criteria</p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search keywords, clear genre restrictions, or reset your filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
          {displayedAnime.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredAnime.length && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl glass-panel hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-all active:scale-95"
          >
            Load More Titles
          </button>
        </div>
      )}
    </div>
  );
};

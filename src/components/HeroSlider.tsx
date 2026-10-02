import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Info, Star, Bookmark, Check } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { animeList, navigateTo, isWatchlisted, updateWatchlist, removeFromWatchlist } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pick top featured anime
  const featuredAnime = animeList.filter(a => a.featured && a.published);
  const activeAnime = featuredAnime[currentIndex] || animeList[0];

  // Auto slide forward every 5 seconds, always (restarts after any slide change)
  useEffect(() => {
    if (featuredAnime.length <= 1) return;
    const timer = setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % featuredAnime.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, featuredAnime.length]);

  if (!activeAnime) return null;

  const inWatchlist = isWatchlisted(activeAnime.id);

  return (
    <div
      className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] lg:h-[580px] overflow-hidden bg-black select-none"
    >
      {/* Background Banner with Measured Scrim Overlay */}
      <div className="absolute inset-0">
        {featuredAnime.map((anime, idx) => (
          <img
            key={anime.id}
            src={anime.bannerImage}
            alt={anime.title}
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-[opacity,transform] duration-1000 ease-out ${
              idx === currentIndex ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
            }`}
            style={{ transitionDuration: idx === currentIndex ? '1000ms, 6000ms' : '1000ms, 1000ms' }}
          />
        ))}
        {/* Scrims: left & bottom fades */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090d] via-[#08090d]/85 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/40 to-transparent" />
        <div className="absolute inset-0 bg-[#08090d]/25" />
      </div>

      {/* Main Content Area */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-14 lg:pb-20">
        <div key={activeAnime.id} className="hero-text-in max-w-2xl space-y-2.5 sm:space-y-4">
          {/* Metadata Row: Zero-Pill discipline */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-300 font-medium">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              {activeAnime.rating.toFixed(1)}
            </span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span>{activeAnime.releaseYear}</span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span>{activeAnime.type}</span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span>{activeAnime.totalEpisodes} Eps</span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span className="text-purple-300 font-medium">{activeAnime.studio}</span>
          </div>

          {/* Anime Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-display drop-shadow-md">
            {activeAnime.title}
          </h1>

          {/* Alt Title / Subtitle */}
          {activeAnime.altTitle && (
            <p className="text-xs sm:text-sm text-purple-200/80 font-medium tracking-wide truncate max-w-lg">
              {activeAnime.altTitle}
            </p>
          )}

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
            {activeAnime.description}
          </p>

          {/* Genres */}
          <div className="text-[11px] sm:text-xs text-neutral-400 font-medium">
            {activeAnime.genres.slice(0, 4).join(' · ')}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            <button
              onClick={() => navigateTo('watch', activeAnime.id, 1)}
              className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
              <span>Watch Now</span>
            </button>

            <button
              onClick={() => navigateTo('anime-detail', activeAnime.id)}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl glass-panel hover:bg-white/10 text-neutral-200 hover:text-white font-medium text-xs sm:text-sm transition-all border border-white/10 whitespace-nowrap"
            >
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              <span>More Info</span>
            </button>

            <button
              onClick={() => {
                if (inWatchlist) {
                  removeFromWatchlist(activeAnime.id);
                } else {
                  updateWatchlist(activeAnime.id, 'watching');
                }
              }}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`p-2 sm:p-3 rounded-xl border transition-all ${
                inWatchlist
                  ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                  : 'glass-panel hover:bg-white/10 border-white/10 text-neutral-300 hover:text-white'
              }`}
            >
              {inWatchlist ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute right-3 sm:right-8 bottom-6 sm:bottom-12 flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 mr-2">
            {featuredAnime.map((anime, idx) => (
              <button
                key={anime.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-purple-500' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Anime } from '../types';
import { useApp } from '../context/AppContext';
import { Play, Star, Bookmark, Check } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime;
  compact?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, compact = false }) => {
  const { navigateTo, isWatchlisted, updateWatchlist, removeFromWatchlist } = useApp();
  const inWatchlist = isWatchlisted(anime.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(anime.id);
    } else {
      updateWatchlist(anime.id, 'watching');
    }
  };

  const handleCardClick = () => {
    navigateTo('anime-detail', anime.id);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo('watch', anime.id, 1);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative cursor-pointer flex flex-col rounded-xl overflow-hidden bg-[#10131c] border border-white/5 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20 active:scale-[0.98]"
    >
      {/* Poster Media Box with 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
        <img
          src={anime.posterImage}
          alt={anime.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Fallback scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25 opacity-70 group-hover:opacity-85 transition-opacity" />

        {/* Floating Rating Tag */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] sm:text-[11px] font-bold text-amber-300 border border-white/10">
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
          <span>{anime.rating.toFixed(1)}</span>
        </div>

        {/* Top-Right Quick Bookmark */}
        <button
          onClick={handleBookmarkClick}
          aria-label={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          className={`absolute top-2 right-2 p-1.5 rounded-md backdrop-blur-md transition-all ${
            inWatchlist
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-black/60 text-neutral-300 hover:text-white hover:bg-black/90'
          }`}
        >
          {inWatchlist ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Bookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        </button>

        {/* Centered Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none sm:pointer-events-auto">
          <button
            onClick={handlePlayClick}
            aria-label={`Watch ${anime.title}`}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg shadow-purple-600/50 transform scale-75 group-hover:scale-100 transition-all hover:bg-purple-500 pointer-events-auto"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
          </button>
        </div>

        {/* Bottom Banner Studio & Type */}
        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-300 font-medium">
          <span className="truncate max-w-[90px] sm:max-w-none">{anime.studio}</span>
          <span className="text-purple-300 font-bold uppercase text-[9px] sm:text-[10px] shrink-0 ml-1">
            {anime.type}
          </span>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-2 sm:p-3 flex flex-col flex-1 justify-between gap-1">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1 leading-snug">
            {anime.title}
          </h3>

          {!compact && (
            <p className="text-[10px] sm:text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
              {anime.genres.slice(0, 2).join(', ')}
            </p>
          )}
        </div>

        {/* Clean Unboxed Metadata with Guaranteed Single-Line & No Wrapping Bugs */}
        <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-neutral-400 mt-1 pt-1.5 border-t border-white/5 font-medium whitespace-nowrap">
          <div className="flex items-center gap-1 truncate text-neutral-400">
            <span>{anime.releaseYear}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>{anime.totalEpisodes} Eps</span>
          </div>
          <span className="text-emerald-400 font-semibold text-[9px] sm:text-[10px] shrink-0 uppercase tracking-tight">
            {anime.status}
          </span>
        </div>
      </div>
    </div>
  );
};

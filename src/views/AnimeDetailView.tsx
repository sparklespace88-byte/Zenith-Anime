import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CommentsSection } from '../components/CommentsSection';
import { AnimeCard } from '../components/AnimeCard';
import { ShareModal } from '../components/ShareModal';
import { WatchStatus } from '../types';
import {
  Play,
  ListVideo,
  Bookmark,
  Heart,
  Share2,
  ChevronDown,
  Star,
  Check,
  Clock,
  Sparkles
} from 'lucide-react';

export const AnimeDetailView: React.FC = () => {
  const {
    selectedAnimeId,
    getAnimeById,
    animeList,
    navigateTo,
    isFavorite,
    toggleFavorite,
    isWatchlisted,
    getWatchlistStatus,
    updateWatchlist,
    removeFromWatchlist
  } = useApp();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isWatchlistDropdownOpen, setIsWatchlistDropdownOpen] = useState(false);

  const anime = getAnimeById(selectedAnimeId || 'demon-slayer') || animeList[0];

  if (!anime) {
    return (
      <div className="pt-28 text-center text-neutral-400 px-4">
        <p>Anime playlist not found.</p>
        <button onClick={() => navigateTo('home')} className="mt-4 text-purple-400 underline">
          Return Home
        </button>
      </div>
    );
  }

  const favorite = isFavorite(anime.id);
  const inWatchlist = isWatchlisted(anime.id);
  const currentStatus = getWatchlistStatus(anime.id);

  // Related anime
  const relatedAnime = anime.relatedAnimeIds
    ? anime.relatedAnimeIds.map(id => getAnimeById(id)).filter(Boolean)
    : animeList.filter(a => a.id !== anime.id && a.genres.some(g => anime.genres.includes(g))).slice(0, 5);

  const handleStatusChange = (status: WatchStatus) => {
    updateWatchlist(anime.id, status);
    setIsWatchlistDropdownOpen(false);
  };

  return (
    <div className="pt-16 sm:pt-20 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* YouTube Playlist Layout: Sidebar + Episode List */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* Left / Top: Playlist Summary Card (YouTube style) */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-24 rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#141828] to-[#0c0e17] border border-white/10 shadow-2xl space-y-4">
            {/* Playlist Cover Poster */}
            <div className="relative aspect-video sm:aspect-[16/9] lg:aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 shadow-lg group">
              <img
                src={anime.posterImage || anime.bannerImage}
                alt={anime.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* YouTube Playlist Indicator Overlay */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 shadow">
                <ListVideo className="w-3.5 h-3.5 text-purple-400" />
                <span>{anime.episodes.length} Episodes</span>
              </div>

              {/* Rating Tag */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-xs font-bold text-amber-300 border border-white/10">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{anime.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Playlist Title & Meta */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                <span>{anime.studio}</span>
                <span>•</span>
                <span>{anime.language}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight leading-snug">
                {anime.title}
              </h1>

              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span>Playlist</span>
                <span>•</span>
                <span>{anime.episodes.length} videos</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">{anime.status}</span>
              </div>
            </div>

            {/* Action Buttons: Play All + Watchlist/Favorite */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => navigateTo('watch', anime.id, 1)}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play All (Episode 1)</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Watchlist Dropdown */}
                <div className="relative flex-1">
                  <button
                    onClick={() => setIsWatchlistDropdownOpen(!isWatchlistDropdownOpen)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                      inWatchlist
                        ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      <span className="truncate">{currentStatus ? currentStatus.replace(/_/g, ' ') : 'Watchlist'}</span>
                    </span>
                    <ChevronDown className="w-3 h-3 shrink-0 ml-1" />
                  </button>

                  {isWatchlistDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#121520] border border-white/10 rounded-xl shadow-2xl py-1 z-30 text-xs">
                      {(['watching', 'plan_to_watch', 'completed', 'dropped'] as WatchStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(st)}
                          className={`w-full px-3 py-1.5 text-left capitalize hover:bg-white/5 transition-colors ${
                            currentStatus === st ? 'text-purple-400 font-bold' : 'text-neutral-300'
                          }`}
                        >
                          {st.replace(/_/g, ' ')}
                        </button>
                      ))}
                      {inWatchlist && (
                        <button
                          onClick={() => {
                            removeFromWatchlist(anime.id);
                            setIsWatchlistDropdownOpen(false);
                          }}
                          className="w-full px-3 py-1.5 text-left text-rose-400 hover:bg-rose-500/10 border-t border-white/5 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Favorite Heart */}
                <button
                  onClick={() => toggleFavorite(anime.id)}
                  title={favorite ? 'Remove favorite' : 'Add to favorites'}
                  className={`p-2 rounded-xl border transition-all ${
                    favorite
                      ? 'bg-rose-600/20 border-rose-500/50 text-rose-400'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Share Button */}
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  title="Share playlist"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right / Main: YouTube-Style Episode Playlist Items */}
          <div className="flex-1 w-full space-y-4">
            
            {/* Playlist Header */}
            <div className="flex items-center justify-between px-1 pb-1 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ListVideo className="w-4 h-4 text-purple-400" />
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Episodes
                </h2>
                <span className="text-xs text-neutral-400">({anime.episodes.length})</span>
              </div>
              <span className="text-xs text-neutral-400">
                Audio: <span className="text-neutral-200 font-medium">{anime.language}</span>
              </span>
            </div>

            {/* YouTube Playlist Episodes Rows */}
            <div className="space-y-2">
              {anime.episodes.map((ep, index) => (
                <div
                  key={ep.id}
                  onClick={() => navigateTo('watch', anime.id, ep.episodeNumber)}
                  className="group cursor-pointer flex items-center gap-3 sm:gap-4 p-2 sm:p-2.5 rounded-xl bg-[#0f121b] hover:bg-[#181d2c] border border-white/5 hover:border-purple-500/30 transition-all active:scale-[0.99]"
                >
                  {/* Playlist Row Index / Number */}
                  <div className="w-5 sm:w-6 text-center shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-neutral-400 group-hover:hidden">
                      {index + 1}
                    </span>
                    <Play className="w-3.5 h-3.5 text-purple-400 fill-purple-400 mx-auto hidden group-hover:block" />
                  </div>

                  {/* 16:9 Video Thumbnail */}
                  <div className="relative w-32 sm:w-44 aspect-video rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                    <img
                      src={ep.thumbnail || anime.bannerImage}
                      alt={ep.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Hover Play Scrim */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-3 h-3 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-mono text-neutral-200">
                      {ep.duration}
                    </span>
                  </div>

                  {/* Title & Metadata (Clean YouTube style, No long text) */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-300 transition-colors truncate sm:line-clamp-2">
                      EP {ep.episodeNumber} - {ep.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
                      <span className="font-medium text-purple-400">Episode {ep.episodeNumber}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ep.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Discussion / Comments Section Below Playlist */}
            <div className="pt-8 border-t border-white/10 mt-8">
              <CommentsSection animeId={anime.id} />
            </div>

            {/* Recommended Titles */}
            {relatedAnime.length > 0 && (
              <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>More Anime Playlists</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {relatedAnime.map((rel) => (
                    rel && <AnimeCard key={rel.id} anime={rel} compact />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Social Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={anime.title}
      />
    </div>
  );
};

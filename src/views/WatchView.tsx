import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VideoPlayer } from '../components/VideoPlayer';
import { CommentsSection } from '../components/CommentsSection';
import { ShareModal } from '../components/ShareModal';
import {
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  ListVideo,
  Info,
  Check
} from 'lucide-react';

export const WatchView: React.FC = () => {
  const {
    selectedAnimeId,
    selectedEpisodeNumber,
    getAnimeById,
    animeList,
    navigateTo,
    isWatchlisted,
    updateWatchlist,
    removeFromWatchlist
  } = useApp();

  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [reactions, setReactions] = useState<Record<string, 'like' | 'dislike'>>(() => {
    try {
      return JSON.parse(localStorage.getItem('zenith_ep_reactions') || '{}');
    } catch {
      return {};
    }
  });

  const setReaction = (episodeId: string, type: 'like' | 'dislike') => {
    setReactions(prev => {
      const next = { ...prev };
      if (next[episodeId] === type) delete next[episodeId];
      else next[episodeId] = type;
      try { localStorage.setItem('zenith_ep_reactions', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const formatCount = (n: number) => n.toLocaleString('en-US');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const anime = getAnimeById(selectedAnimeId || 'demon-slayer') || animeList[0];

  if (!anime) {
    return (
      <div className="pt-32 text-center text-neutral-400">
        <p>Anime stream unavailable.</p>
        <button onClick={() => navigateTo('home')} className="mt-4 text-purple-400 underline">
          Return Home
        </button>
      </div>
    );
  }

  // Find active episode or default to ep 1
  const currentEp = anime.episodes.find(e => e.episodeNumber === selectedEpisodeNumber) || anime.episodes[0];
  const inWatchlist = isWatchlisted(anime.id);

  const handleEpisodeChange = (newEpNumber: number) => {
    navigateTo('watch', anime.id, newEpNumber);
  };

  const hasPrev = currentEp.episodeNumber > 1;
  const hasNext = currentEp.episodeNumber < anime.totalEpisodes;

  return (
    <div className="pt-16 sm:pt-20 pb-20 space-y-6 sm:space-y-8">
      {/* Player Section Container */}
      <div className={`mx-auto px-2.5 sm:px-6 lg:px-8 transition-all duration-300 ${
        isTheaterMode ? 'max-w-full' : 'max-w-7xl'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
          {/* Main Video Column */}
          <div className="flex-1 w-full space-y-3 sm:space-y-4">
            {/* The Video Player */}
            <VideoPlayer
              anime={anime}
              currentEpisode={currentEp}
              onEpisodeChange={handleEpisodeChange}
              isTheaterMode={isTheaterMode}
              onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
            />

            {/* Like / Dislike / Share & Quick Prev/Next */}
            <div className="glass-panel p-2.5 sm:p-3.5 rounded-xl border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {(() => {
                  const myReaction = reactions[currentEp.id];
                  const baseLikes = Math.round(currentEp.views * 0.04);
                  const baseDislikes = Math.round(currentEp.views * 0.002);
                  const btn = 'flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-semibold transition-all';
                  return (
                    <>
                      <button
                        onClick={() => setReaction(currentEp.id, 'like')}
                        className={`${btn} ${myReaction === 'like' ? 'bg-purple-600 border-purple-500 text-white' : 'glass-panel border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'}`}
                        title="Like"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{formatCount(baseLikes + (myReaction === 'like' ? 1 : 0))}</span>
                      </button>
                      <button
                        onClick={() => setReaction(currentEp.id, 'dislike')}
                        className={`${btn} ${myReaction === 'dislike' ? 'bg-red-600 border-red-500 text-white' : 'glass-panel border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'}`}
                        title="Dislike"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>{formatCount(baseDislikes + (myReaction === 'dislike' ? 1 : 0))}</span>
                      </button>
                      <button
                        onClick={() => setIsShareModalOpen(true)}
                        className={`${btn} glass-panel border-white/10 text-neutral-300 hover:text-white hover:bg-white/10`}
                        title="Share"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Share</span>
                      </button>
                    </>
                  );
                })()}
              </div>

              {/* Prev / Next buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleEpisodeChange(currentEp.episodeNumber - 1)}
                  disabled={!hasPrev}
                  className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    hasPrev
                      ? 'glass-panel hover:bg-white/10 border-white/10 text-white'
                      : 'border-white/5 text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Prev</span>
                </button>

                <button
                  onClick={() => handleEpisodeChange(currentEp.episodeNumber + 1)}
                  disabled={!hasNext}
                  className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    hasNext
                      ? 'bg-purple-600 hover:bg-purple-500 border-purple-500 text-white shadow-md shadow-purple-600/20'
                      : 'border-white/5 text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  <span className="hidden xs:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Title & Metadata Strip */}
            <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-white/5 space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-purple-400 mb-0.5">
                    <span>Episode {currentEp.episodeNumber}</span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span>{currentEp.duration}</span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span>{anime.studio}</span>
                  </div>
                  <h1 className="text-base sm:text-2xl font-bold text-white font-display">
                    {anime.title}: <span className="text-purple-300 font-normal">{currentEp.title}</span>
                  </h1>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (inWatchlist) {
                        removeFromWatchlist(anime.id);
                      } else {
                        updateWatchlist(anime.id, 'watching');
                      }
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold border transition-all ${
                      inWatchlist
                        ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                        : 'glass-panel hover:bg-white/10 border-white/10 text-neutral-300'
                    }`}
                  >
                    {inWatchlist ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Bookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    <span>{inWatchlist ? 'Saved' : 'Watchlist'}</span>
                  </button>

                  <button
                    onClick={() => navigateTo('anime-detail', anime.id)}
                    className="p-1.5 sm:p-2.5 rounded-xl glass-panel hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
                    title="Anime Details & Overview"
                  >
                    <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="p-1.5 sm:p-2.5 rounded-xl glass-panel hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
                    title="Share stream"
                  >
                    <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Episode synopsis if available */}
              {currentEp.synopsis && (
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-white/5 pt-3">
                  {currentEp.synopsis}
                </p>
              )}
            </div>

            {/* Comments & Discussion */}
            <div className="pt-6">
              <CommentsSection animeId={anime.id} episodeId={currentEp.id} />
            </div>
          </div>

          {/* Right Playlist Sidebar: Episode Selector */}
          <div className="w-full lg:w-80 shrink-0 glass-panel p-4 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <ListVideo className="w-4 h-4 text-purple-400" />
                <span>Episodes List</span>
              </h3>
              <span className="text-xs text-neutral-400 font-medium">
                {currentEp.episodeNumber} / {anime.episodes.length}
              </span>
            </div>

            {/* Scrollable list of episodes */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {anime.episodes.map((ep) => {
                const isActive = ep.episodeNumber === currentEp.episodeNumber;

                return (
                  <button
                    key={ep.id}
                    onClick={() => handleEpisodeChange(ep.episodeNumber)}
                    className={`w-full p-2 rounded-xl text-left flex items-center gap-3 transition-all ${
                      isActive
                        ? 'bg-purple-600/20 border border-purple-500/50 shadow-md'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="relative w-16 aspect-video rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                      <img
                        src={ep.thumbnail || anime.bannerImage}
                        alt={ep.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-purple-600/60 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-purple-400 uppercase">
                        Ep {ep.episodeNumber}
                      </div>
                      <div className={`text-xs font-medium truncate ${isActive ? 'text-white font-bold' : 'text-neutral-300'}`}>
                        {ep.title}
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        {ep.duration}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={`${anime.title} Episode ${currentEp.episodeNumber}`}
      />
    </div>
  );
};

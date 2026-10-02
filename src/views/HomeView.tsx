import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { HeroSlider } from '../components/HeroSlider';
import { AnimeCard } from '../components/AnimeCard';
import { Play, TrendingUp, Flame, Sparkles, Clock, ChevronRight, ChevronLeft, Star } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { animeList, navigateTo, openBrowse, currentUser } = useApp();
  const trendingScrollRef = useRef<HTMLDivElement>(null);

  const trendingAnime = animeList.filter(a => a.trending && a.published);
  const popularAnime = animeList.filter(a => a.popular && a.published);
  const latestAnime = animeList.filter(a => a.latest && a.published);

  // Continue Watching items from current user's history
  const continueWatchingItems = currentUser?.watchHistory
    .map(h => {
      const anime = animeList.find(a => a.id === h.animeId);
      const ep = anime?.episodes.find(e => e.episodeNumber === h.episodeNumber) || anime?.episodes[0];
      return { history: h, anime, episode: ep };
    })
    .filter(item => item.anime !== undefined) || [];

  const scrollTrending = (direction: 'left' | 'right') => {
    if (trendingScrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      trendingScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* 1. Hero Banner Slider */}
      <HeroSlider />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        {/* 2. Continue Watching (if user has history) */}
        {continueWatchingItems.length > 0 && (
          <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <h2 className="text-base sm:text-2xl font-bold text-white font-display">Continue Watching</h2>
              </div>
              <button
                onClick={() => navigateTo('profile')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-0.5"
              >
                <span>Full History</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {continueWatchingItems.slice(0, 4).map(({ history, anime, episode }) => {
                if (!anime) return null;
                const percent = Math.min(100, Math.round((history.progressSeconds / (history.durationSeconds || 1440)) * 100));

                return (
                  <div
                    key={`${history.animeId}-${history.episodeNumber}`}
                    onClick={() => navigateTo('watch', anime.id, history.episodeNumber)}
                    className="group relative cursor-pointer glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/40 transition-all active:scale-[0.98]"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                      <img
                        src={episode?.thumbnail || anime.bannerImage}
                        alt={anime.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white ml-0.5" />
                        </div>
                      </div>

                      {/* Progress bar line */}
                      <div className="absolute bottom-0 inset-x-0 h-1 sm:h-1.5 bg-black/60">
                        <div className="h-full bg-purple-500 transition-all" style={{ width: `${percent}%` }} />
                      </div>
                    </div>

                    <div className="p-2 sm:p-3">
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate">{anime.title}</h4>
                      <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 truncate">
                        Ep {history.episodeNumber} · {percent}% watched
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. Trending Anime (Horizontal Scroll Carousel) */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h2 className="text-base sm:text-2xl font-bold text-white font-display">Trending This Season</h2>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollTrending('left')}
                aria-label="Scroll left"
                className="p-1.5 sm:p-2 rounded-lg glass-panel hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors active:scale-95"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => scrollTrending('right')}
                aria-label="Scroll right"
                className="p-1.5 sm:p-2 rounded-lg glass-panel hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors active:scale-95"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          <div
            ref={trendingScrollRef}
            className="flex gap-2.5 sm:gap-4 overflow-x-auto pb-2 pt-1 scrollbar-none scroll-smooth snap-x -mx-3 px-3 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingAnime.map((anime) => (
              <div key={anime.id} className="w-[145px] sm:w-[190px] md:w-[210px] shrink-0 snap-start">
                <AnimeCard anime={anime} />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Popular Anime Grid */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <h2 className="text-base sm:text-2xl font-bold text-white font-display">Most Popular Anime</h2>
            </div>
            <button
              onClick={() => openBrowse('popular')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-0.5 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {popularAnime.slice(0, 10).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>

        {/* 5. Latest Releases (Episode Cards) */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h2 className="text-base sm:text-2xl font-bold text-white font-display">Latest Episodes</h2>
            </div>
            <button
              onClick={() => openBrowse('latest')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-0.5 transition-colors"
            >
              <span>Explore All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {latestAnime.map((anime) => {
              const latestEp = anime.episodes[anime.episodes.length - 1] || anime.episodes[0];
              return (
                <div
                  key={`latest-${anime.id}`}
                  onClick={() => navigateTo('watch', anime.id, latestEp?.episodeNumber || 1)}
                  className="group cursor-pointer glass-panel p-2.5 sm:p-3 rounded-xl border border-white/5 hover:border-purple-500/40 transition-all flex items-center gap-3 active:scale-[0.98]"
                >
                  <div className="relative w-24 sm:w-28 aspect-video rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                    <img
                      src={latestEp?.thumbnail || anime.posterImage}
                      alt={anime.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                      Episode {latestEp?.episodeNumber || 1}
                    </span>
                    <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-300 transition-colors truncate mt-0.5">
                      {anime.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-400 mt-1 whitespace-nowrap">
                      <span>{latestEp?.duration || '24m'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400 font-medium">{anime.status}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
                        {anime.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Genre Quick Jump */}
        <section className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/5 space-y-3 sm:space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-base sm:text-xl font-bold text-white font-display">Explore Anime by Genre</h2>
            <p className="text-[11px] sm:text-xs text-neutral-400">
              Filter through shounen, dark fantasy, sci-fi and seasonal collections.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1">
            {[
              'Action',
              'Fantasy',
              'Shounen',
              'Supernatural',
              'Adventure',
              'Sci-Fi',
              'Drama',
              'Comedy',
              'Dark Fantasy',
              'Mystery',
              'Romance'
            ].map((genre) => (
              <button
                key={genre}
                onClick={() => openBrowse('all', genre)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/5 hover:bg-purple-600/20 hover:border-purple-500/50 border border-white/5 text-[11px] sm:text-xs text-neutral-300 hover:text-white font-medium transition-all"
              >
                {genre}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

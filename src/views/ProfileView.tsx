import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/UserAvatar';
import { AnimeCard } from '../components/AnimeCard';
import { ANIME_AVATARS } from '../data/animeData';
import {
  User as UserIcon,
  Shield,
  Bookmark,
  Heart,
  History,
  Edit3,
  Play,
  LogOut,
  X,
  Check,
  Trash2,
  Camera,
  UploadCloud,
  Sparkles
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    logout,
    updateProfile,
    animeList,
    navigateTo,
    openAuthModal,
    showToast,
    removeFromWatchlist,
    clearWatchlist,
    clearWatchHistory,
    removeFromWatchHistory
  } = useApp();

  const [activeTab, setActiveTab] = useState<'watchlist' | 'favorites' | 'history'>('watchlist');
  const [watchlistFilter, setWatchlistFilter] = useState<string>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit fields
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isDirectSave = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select a valid image file (JPG, PNG, WebP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File Too Large', 'Please select an image smaller than 5MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setEditAvatar(dataUrl);
      if (isDirectSave) {
        updateProfile({ avatar: dataUrl });
        showToast('Avatar Updated', 'Your custom picture was uploaded and set as your avatar!', 'success');
        setIsAvatarModalOpen(false);
      } else {
        showToast('Image Loaded', 'Custom picture selected. Click "Save Changes" to apply.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  if (!currentUser) {
    return (
      <div className="pt-32 pb-24 text-center max-w-md mx-auto px-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-purple-600/20 text-purple-400 mx-auto flex items-center justify-center">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-display">Sign In to View Profile</h2>
        <p className="text-xs text-neutral-400">
          Track your anime watch history, manage custom collections, and sync progress across devices.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  // Filter Watchlist Anime
  const watchlistItems = currentUser.watchlist
    .filter(item => watchlistFilter === 'all' || item.status === watchlistFilter)
    .map(item => {
      const anime = animeList.find(a => a.id === item.animeId);
      return { anime, status: item.status, addedAt: item.addedAt };
    })
    .filter(item => item.anime !== undefined);

  // Favorites Anime
  const favoriteAnime = currentUser.favorites
    .map(id => animeList.find(a => a.id === id))
    .filter(Boolean);

  // History Items
  const historyItems = currentUser.watchHistory
    .map(h => {
      const anime = animeList.find(a => a.id === h.animeId);
      const ep = anime?.episodes.find(e => e.episodeNumber === h.episodeNumber) || anime?.episodes[0];
      return { history: h, anime, episode: ep };
    })
    .filter(item => item.anime !== undefined);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim(),
      bio: editBio.trim(),
      avatar: editAvatar.trim() || currentUser.avatar
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* 1. Profile Banner & Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <button
              type="button"
              onClick={() => {
                setEditAvatar(currentUser.avatar);
                setIsAvatarModalOpen(true);
              }}
              className="relative block rounded-full overflow-hidden focus:outline-none ring-2 ring-purple-500/50 hover:ring-purple-400 transition-all shadow-xl"
              title="Click to Change Anime Avatar"
            >
              <UserAvatar
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-semibold gap-1">
                <Camera className="w-5 h-5 text-white" />
                <span>Change</span>
              </div>
            </button>

            {/* Quick Camera Change Button */}
            <button
              type="button"
              onClick={() => {
                setEditAvatar(currentUser.avatar);
                setIsAvatarModalOpen(true);
              }}
              className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg ring-2 ring-[#08090d] transition-transform active:scale-90"
              title="Change Anime Avatar"
              aria-label="Change Anime Avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            {currentUser.role === 'admin' && (
              <span className="absolute -top-2 -left-2 px-2 py-0.5 rounded bg-amber-500 text-black font-extrabold text-[10px] uppercase shadow">
                Admin
              </span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  {currentUser.name}
                </h1>
                <p className="text-xs text-purple-400 font-medium">{currentUser.email}</p>
              </div>

              <div className="flex items-center gap-2 justify-center sm:justify-end">
                <button
                  onClick={() => {
                    setEditName(currentUser.name);
                    setEditBio(currentUser.bio || '');
                    setEditAvatar(currentUser.avatar);
                    setIsEditModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel hover:bg-white/10 text-neutral-200 text-xs border border-white/10 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs border border-rose-500/20 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              {currentUser.bio || 'Anime enthusiast watching through seasonal releases.'}
            </p>

            {currentUser.role === 'admin' && (
              <div className="pt-1 flex justify-center sm:justify-start">
                <button
                  onClick={() => navigateTo('admin')}
                  className="text-amber-400 font-semibold hover:underline flex items-center gap-1.5 text-xs"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Open Admin Dashboard</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-1 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/5 text-center">
          <div className="p-1 sm:p-2">
            <div className="text-lg sm:text-2xl font-bold text-white font-mono tabular-nums">
              {currentUser.watchlist.length}
            </div>
            <div className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider font-semibold truncate">Watchlist</div>
          </div>
          <div className="p-1 sm:p-2 border-x border-white/5">
            <div className="text-lg sm:text-2xl font-bold text-purple-400 font-mono tabular-nums">
              {currentUser.favorites.length}
            </div>
            <div className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider font-semibold truncate">Favorites</div>
          </div>
          <div className="p-1 sm:p-2">
            <div className="text-lg sm:text-2xl font-bold text-emerald-400 font-mono tabular-nums">
              {currentUser.watchHistory.length}
            </div>
            <div className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider font-semibold truncate">Watched</div>
          </div>
        </div>
      </div>

      {/* 2. Collection Tabs: Watchlist, Favorites, History */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex border-b border-white/10 gap-3 sm:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto whitespace-nowrap pb-0.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`pb-2.5 sm:pb-3 flex items-center gap-1.5 sm:gap-2 transition-all relative shrink-0 ${
              activeTab === 'watchlist'
                ? 'text-purple-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Watchlist ({currentUser.watchlist.length})</span>
            {activeTab === 'watchlist' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-2.5 sm:pb-3 flex items-center gap-1.5 sm:gap-2 transition-all relative shrink-0 ${
              activeTab === 'favorites'
                ? 'text-purple-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Favorites ({currentUser.favorites.length})</span>
            {activeTab === 'favorites' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
            )}
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2.5 sm:pb-3 flex items-center gap-1.5 sm:gap-2 transition-all relative shrink-0 ${
                activeTab === 'history'
                  ? 'text-purple-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>History ({currentUser.watchHistory.length})</span>
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
              )}
            </button>

            {/* Clear History Icon right next to History tab */}
            {activeTab === 'history' && currentUser.watchHistory.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsClearHistoryModalOpen(true);
                }}
                className="mb-2.5 p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/25 transition-all shadow-sm active:scale-90 flex items-center justify-center"
                title="Clear All Watch History"
                aria-label="Clear All Watch History"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Watchlist Content */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6">
            {/* Status Subfilters */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {['all', 'watching', 'plan_to_watch'].map((status) => (
                <button
                  key={status}
                  onClick={() => setWatchlistFilter(status)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                    watchlistFilter === status
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {status.replace(/_/g, ' ')}
                </button>
              ))}

              {/* Small Clear Watchlist Icon right in front of Plan To Watch */}
              {currentUser.watchlist.length > 0 && (
                <button
                  onClick={() => setIsClearModalOpen(true)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/25 transition-all shadow-sm active:scale-90 flex items-center justify-center"
                  title="Clear Watchlist"
                  aria-label="Clear Watchlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {['completed', 'dropped'].map((status) => (
                <button
                  key={status}
                  onClick={() => setWatchlistFilter(status)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                    watchlistFilter === status
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {status.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {watchlistItems.length === 0 ? (
              <div className="text-center py-16 glass-panel rounded-2xl border border-white/5 space-y-2">
                <Bookmark className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-sm font-semibold text-white">No titles in this list</p>
                <p className="text-xs text-neutral-400">Add titles from the home or browse catalog.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {watchlistItems.map(({ anime, status }) => (
                  anime && (
                    <div key={anime.id} className="relative group">
                      <AnimeCard anime={anime} />
                      <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-600 text-white shadow pointer-events-none">
                        {status.replace(/_/g, ' ')}
                      </span>
                      {/* Direct Remove from Watchlist button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlist(anime.id);
                        }}
                        className="absolute top-2 right-2 z-30 p-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 transition-transform active:scale-90"
                        title={`Remove ${anime.title} from watchlist`}
                        aria-label={`Remove ${anime.title} from watchlist`}
                      >
                        <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Favorites Content */}
        {activeTab === 'favorites' && (
          <div>
            {favoriteAnime.length === 0 ? (
              <div className="text-center py-16 glass-panel rounded-2xl border border-white/5 space-y-2">
                <Heart className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-sm font-semibold text-white">No favorite anime yet</p>
                <p className="text-xs text-neutral-400">Click the heart icon on any anime page to mark it as favorite.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {favoriteAnime.map((anime) => (
                  anime && <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: History Content with Progress Bar */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {historyItems.length === 0 ? (
              <div className="text-center py-16 glass-panel rounded-2xl border border-white/5 space-y-2">
                <History className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-sm font-semibold text-white">No watch history recorded</p>
                <p className="text-xs text-neutral-400">Start watching any episode to save your playback timestamps.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {historyItems.map(({ history, anime, episode }) => {
                  if (!anime) return null;
                  const percent = Math.min(100, Math.round((history.progressSeconds / (history.durationSeconds || 1440)) * 100));

                  return (
                    <div
                      key={`${history.animeId}-${history.episodeNumber}`}
                      onClick={() => navigateTo('watch', anime.id, history.episodeNumber)}
                      className="group cursor-pointer glass-panel p-3 rounded-xl border border-white/5 hover:border-purple-500/40 transition-all flex items-center gap-3.5"
                    >
                      <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                        <img
                          src={episode?.thumbnail || anime.bannerImage}
                          alt={anime.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <Play className="w-4 h-4 fill-white text-white" />
                        </div>
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-black/60">
                          <div className="h-full bg-purple-500" style={{ width: `${percent}%` }} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-purple-400 uppercase">
                          Episode {history.episodeNumber}
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-300 transition-colors truncate mt-0.5">
                          {anime.title}
                        </h4>
                        <div className="text-[11px] text-neutral-400 mt-1">
                          {percent}% watched
                        </div>
                      </div>

                      {/* Remove single item from history */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchHistory(history.animeId);
                        }}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 active:scale-90"
                        title="Remove from history"
                        aria-label="Remove from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0e111a] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white font-display">Edit Profile</h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#131622] text-neutral-200 px-3 py-2 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-neutral-300">Profile Avatar</label>
                  <span className="text-[10px] text-purple-400 font-medium">Anime Only & Custom Upload</span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#121520] border border-white/10 mb-3">
                  <UserAvatar
                    src={editAvatar || currentUser.avatar}
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-500 shrink-0"
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <p className="text-[11px] text-neutral-300 font-semibold truncate">Custom or Anime Character</p>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold transition-colors shadow">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Picture</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, false)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Popular Anime Avatars row */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-neutral-400 font-medium">Quick Anime Avatars:</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {ANIME_AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setEditAvatar(av.url)}
                        className={`relative shrink-0 w-11 h-11 rounded-full overflow-hidden border-2 transition-all ${
                          editAvatar === av.url
                            ? 'border-purple-500 ring-2 ring-purple-500/40 scale-105'
                            : 'border-white/10 opacity-75 hover:opacity-100 hover:border-purple-400/50'
                        }`}
                        title={`${av.name} (${av.series})`}
                      >
                        <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                        {editAvatar === av.url && (
                          <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell other otakus about your favorite genres and anime..."
                  className="w-full bg-[#131622] text-neutral-200 p-3 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear Watchlist Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#121520] border border-white/10 p-5 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Clear Watchlist?</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Are you sure you want to remove {watchlistFilter === 'all' ? 'all anime titles' : `all "${watchlistFilter.replace(/_/g, ' ')}" titles`} from your watchlist?
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearWatchlist(watchlistFilter === 'all' ? undefined : watchlistFilter);
                  setIsClearModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Watch History Confirmation Modal */}
      {isClearHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#121520] border border-white/10 p-5 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Clear Watch History?</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Are you sure you want to clear your entire watch history and saved playback progress?
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsClearHistoryModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearWatchHistory();
                  setIsClearHistoryModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anime Avatar & Custom Image Upload Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0e111a] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAvatarModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Change Profile Avatar
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Pick a popular Anime character avatar or upload your own custom picture from your phone/device.
              </p>
            </div>

            {/* Custom Image Upload Section */}
            <div className="p-4 rounded-xl border-2 border-dashed border-purple-500/40 bg-purple-950/20 space-y-3 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-1">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-purple-400" />
                  Upload Your Own Picture
                </span>
                <span className="text-[10px] text-neutral-400">JPG, PNG, WebP (Max 5MB)</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true)}
                className="hidden"
                id="direct-avatar-file-input"
              />

              <label
                htmlFor="direct-avatar-file-input"
                className="cursor-pointer flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-md shadow-purple-600/30 active:scale-95"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload From Device / Gallery</span>
              </label>
            </div>

            {/* Preset Anime Avatars Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Popular Anime Characters
                </h4>
                <span className="text-[10px] text-purple-400 font-semibold">{ANIME_AVATARS.length} Anime Characters</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {ANIME_AVATARS.map((avatar) => {
                  const isSelected = currentUser.avatar === avatar.url;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => {
                        updateProfile({ avatar: avatar.url });
                        setEditAvatar(avatar.url);
                        showToast('Avatar Updated', `Your avatar is now ${avatar.name}!`, 'success');
                        setIsAvatarModalOpen(false);
                      }}
                      className={`group relative p-2 rounded-xl border transition-all text-left flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/15 ring-2 ring-purple-500/40'
                          : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
                      }`}
                    >
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-neutral-900">
                        <img
                          src={avatar.url}
                          alt={avatar.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-purple-600/40 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                          {avatar.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 truncate">
                          {avatar.series}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold border border-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

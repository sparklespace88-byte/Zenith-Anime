import { IMG } from '../assets/images';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/UserAvatar';
import { Anime, AnimeType, AnimeStatus } from '../types';
import { SAMPLE_VIDEOS, GENRES_LIST } from '../data/animeData';
import { MYSQL_DATABASE_SQL } from '../data/sqlDump';
import {
  LayoutDashboard,
  Film,
  PlusCircle,
  Users,
  MessageSquare,
  Database,
  Trash2,
  Edit2,
  Check,
  Search,
  Shield,
  Eye,
  EyeOff,
  Download,
  Copy,
  AlertTriangle
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    currentUser,
    animeList,
    users,
    comments,
    addAnime,
    updateAnime,
    deleteAnime,
    addEpisode,
    deleteEpisode,
    toggleUserBlock,
    deleteComment,
    switchDemoUser,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'manage-anime' | 'add-anime' | 'episodes' | 'users' | 'comments' | 'sql-schema'
  >('overview');

  // Search & filter states within admin
  const [animeSearch, setAnimeSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [commentSearch, setCommentSearch] = useState('');

  // Add/Edit Anime State
  const [editingAnimeId, setEditingAnimeId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formAltTitle, setFormAltTitle] = useState('');
  const [formSynopsis, setFormSynopsis] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formGenres, setFormGenres] = useState<string[]>(['Action', 'Fantasy']);
  const [formYear, setFormYear] = useState(2024);
  const [formRating, setFormRating] = useState(8.5);
  const [formTotalEpisodes, setFormTotalEpisodes] = useState(12);
  const [formType, setFormType] = useState<AnimeType>('TV');
  const [formStatus, setFormStatus] = useState<AnimeStatus>('Ongoing');
  const [formStudio, setFormStudio] = useState('Studio MAPPA');
  const [formLanguage, setFormLanguage] = useState('Sub & Dub');
  const [formBannerImage, setFormBannerImage] = useState('');
  const [formPosterImage, setFormPosterImage] = useState('');

  // Add Episode Form State
  const [selectedAnimeForEpisode, setSelectedAnimeForEpisode] = useState(animeList[0]?.id || '');
  const [epNumber, setEpNumber] = useState(1);
  const [epTitle, setEpTitle] = useState('');
  const [epDuration] = useState('24m');
  const [epVideoUrl, setEpVideoUrl] = useState(SAMPLE_VIDEOS.action1);
  const [epThumbnail] = useState('');

  // SQL Copy state
  const [sqlCopied, setSqlCopied] = useState(false);

  // Authorization Check
  if (currentUser?.role !== 'admin') {
    return (
      <div className="pt-32 pb-24 text-center max-w-lg mx-auto px-4 space-y-5">
        <div className="w-16 h-16 rounded-full bg-rose-600/20 text-rose-400 mx-auto flex items-center justify-center">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-display">Administrator Access Required</h2>
        <p className="text-xs text-neutral-400 leading-relaxed">
          You are currently signed in as a standard user. Admin privileges are required to modify the database catalog, moderate reviews, and configure nodes.
        </p>
        <button
          onClick={() => switchDemoUser('user-admin')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg transition-all"
        >
          Switch to Admin Otaku (Demo)
        </button>
      </div>
    );
  }

  // Stats calculation
  const totalAnime = animeList.length;
  const totalEpisodes = animeList.reduce((acc, a) => acc + a.episodes.length, 0);
  const totalUsers = users.length;
  const totalComments = comments.length;
  const totalViews = animeList.reduce((acc, a) => acc + (a.views || 0), 0);

  // Handle Anime Form Submit
  const handleAnimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Validation Error', 'Title is required.', 'error');
      return;
    }

    const defaultBanner = formBannerImage.trim() || IMG.HERO_DEMON_SLAYER_BANNER;
    const defaultPoster = formPosterImage.trim() || IMG.POSTER_DEMON_SLAYER;

    if (editingAnimeId) {
      updateAnime(editingAnimeId, {
        title: formTitle.trim(),
        altTitle: formAltTitle.trim(),
        description: formDescription.trim(),
        synopsis: formSynopsis.trim(),
        genres: formGenres,
        releaseYear: formYear,
        rating: formRating,
        totalEpisodes: formTotalEpisodes,
        type: formType,
        status: formStatus,
        studio: formStudio.trim(),
        language: formLanguage,
        bannerImage: defaultBanner,
        posterImage: defaultPoster
      });
      setEditingAnimeId(null);
    } else {
      addAnime({
        title: formTitle.trim(),
        altTitle: formAltTitle.trim(),
        description: formDescription.trim(),
        synopsis: formSynopsis.trim(),
        genres: formGenres,
        releaseYear: formYear,
        rating: formRating,
        ratingCount: 1,
        totalEpisodes: formTotalEpisodes,
        type: formType,
        status: formStatus,
        studio: formStudio.trim(),
        language: formLanguage,
        bannerImage: defaultBanner,
        posterImage: defaultPoster,
        published: true,
        views: 0,
        episodes: [
          {
            id: `ep-1-${Date.now()}`,
            animeId: '',
            episodeNumber: 1,
            title: 'Episode 1: The Beginning',
            duration: '24m',
            thumbnail: defaultPoster,
            videoUrl: SAMPLE_VIDEOS.action1,
            releaseDate: new Date().toISOString().split('T')[0],
            views: 0
          }
        ]
      });
    }

    // Reset Form
    setFormTitle('');
    setFormAltTitle('');
    setFormSynopsis('');
    setFormDescription('');
    setFormBannerImage('');
    setFormPosterImage('');
    setActiveTab('manage-anime');
  };

  const handleStartEditAnime = (anime: Anime) => {
    setEditingAnimeId(anime.id);
    setFormTitle(anime.title);
    setFormAltTitle(anime.altTitle || '');
    setFormDescription(anime.description);
    setFormSynopsis(anime.synopsis || anime.description);
    setFormGenres(anime.genres);
    setFormYear(anime.releaseYear);
    setFormRating(anime.rating);
    setFormTotalEpisodes(anime.totalEpisodes);
    setFormType(anime.type);
    setFormStatus(anime.status);
    setFormStudio(anime.studio);
    setFormLanguage(anime.language);
    setFormBannerImage(anime.bannerImage);
    setFormPosterImage(anime.posterImage);
    setActiveTab('add-anime');
  };

  const handleAddEpisodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimeForEpisode || !epTitle.trim()) {
      showToast('Validation Error', 'Episode title is required.', 'error');
      return;
    }

    const targetAnime = animeList.find(a => a.id === selectedAnimeForEpisode);

    addEpisode(selectedAnimeForEpisode, {
      episodeNumber: Number(epNumber),
      title: epTitle.trim(),
      duration: epDuration.trim(),
      thumbnail: epThumbnail.trim() || targetAnime?.posterImage || '',
      videoUrl: epVideoUrl.trim() || SAMPLE_VIDEOS.action1,
      releaseDate: new Date().toISOString().split('T')[0],
      views: 0
    });

    setEpTitle('');
    setEpNumber(prev => Number(prev) + 1);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(MYSQL_DATABASE_SQL);
    setSqlCopied(true);
    showToast('SQL Copied', 'Complete MySQL schema copied to clipboard!', 'success');
    setTimeout(() => setSqlCopied(false), 2500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([MYSQL_DATABASE_SQL], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zenith_anime_database.sql';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded', 'zenith_anime_database.sql generated!', 'success');
  };

  return (
    <div className="pt-16 sm:pt-24 pb-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider border border-amber-500/30">
              Admin Portal
            </span>
            <span className="text-[11px] text-neutral-400">ZenithAnime Core Management</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white font-display mt-1">
            Site Administration Dashboard
          </h1>
        </div>

        {/* Navigation Tabs (Scrollable on mobile) */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-[#121520] border border-white/5 text-xs font-semibold overflow-x-auto whitespace-nowrap scrollbar-none max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'overview' ? 'bg-purple-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('manage-anime')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'manage-anime' ? 'bg-purple-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Anime Catalog</span>
          </button>
          <button
            onClick={() => {
              setEditingAnimeId(null);
              setActiveTab('add-anime');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'add-anime' ? 'bg-purple-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{editingAnimeId ? 'Edit Anime' : 'Add Anime'}</span>
          </button>
          <button
            onClick={() => setActiveTab('episodes')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'episodes' ? 'bg-purple-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Episodes</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'users' ? 'bg-purple-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'comments' ? 'bg-purple-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comments</span>
          </button>
          <button
            onClick={() => setActiveTab('sql-schema')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'sql-schema' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MySQL DB</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Total Anime</span>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">{totalAnime}</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Total Episodes</span>
              <div className="text-2xl font-bold text-purple-400 font-mono tabular-nums">{totalEpisodes}</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Registered Users</span>
              <div className="text-2xl font-bold text-indigo-400 font-mono tabular-nums">{totalUsers}</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">User Reviews</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">{totalComments}</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1 col-span-2 md:col-span-1">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Total Views</span>
              <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">{totalViews.toLocaleString()}</div>
            </div>
          </div>

          {/* Quick Actions & Recent Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recently Added Anime */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h3 className="text-sm font-bold text-white font-display">Recent Catalog Additions</h3>
                <button
                  onClick={() => setActiveTab('manage-anime')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                >
                  Manage All
                </button>
              </div>

              <div className="space-y-3">
                {animeList.slice(0, 4).map((anime) => (
                  <div key={anime.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={anime.posterImage}
                        alt={anime.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-14 object-cover rounded bg-neutral-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">{anime.title}</div>
                        <div className="text-neutral-400 text-[11px] mt-0.5">
                          {anime.releaseYear} · {anime.episodes.length} episodes · {anime.type}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {anime.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Registered Users */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h3 className="text-sm font-bold text-white font-display">Registered Users</h3>
                <button
                  onClick={() => setActiveTab('users')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                >
                  Manage Users
                </button>
              </div>

              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <div className="font-semibold text-white">{u.name}</div>
                        <div className="text-neutral-400 text-[11px]">@{u.username} · {u.email}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-neutral-400'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE ANIME */}
      {activeTab === 'manage-anime' && (
        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={animeSearch}
                onChange={(e) => setAnimeSearch(e.target.value)}
                placeholder="Search anime catalog..."
                className="w-full bg-[#0d0f17] text-neutral-200 pl-9 pr-3 py-2 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
              />
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => {
                setEditingAnimeId(null);
                setActiveTab('add-anime');
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all self-end sm:self-auto"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add New Anime</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3">Anime Title</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Episodes</th>
                  <th className="py-3 px-2">Rating</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Visibility</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {animeList
                  .filter(a => a.title.toLowerCase().includes(animeSearch.toLowerCase()))
                  .map((anime) => (
                    <tr key={anime.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3 flex items-center gap-3">
                        <img
                          src={anime.posterImage}
                          alt={anime.title}
                          referrerPolicy="no-referrer"
                          className="w-8 h-11 object-cover rounded bg-neutral-900 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-white truncate block">{anime.title}</span>
                          <span className="text-[10px] text-neutral-500">{anime.studio} · {anime.releaseYear}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 font-mono">{anime.type}</td>
                      <td className="py-3 px-2 font-mono tabular-nums">{anime.episodes.length} / {anime.totalEpisodes}</td>
                      <td className="py-3 px-2 font-mono tabular-nums text-amber-400">★ {anime.rating.toFixed(1)}</td>
                      <td className="py-3 px-2">
                        <span className="text-emerald-400">{anime.status}</span>
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => updateAnime(anime.id, { published: !anime.published })}
                          className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded ${
                            anime.published ? 'text-emerald-400 bg-emerald-400/10' : 'text-neutral-500 bg-neutral-500/10'
                          }`}
                        >
                          {anime.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{anime.published ? 'Published' : 'Hidden'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEditAnime(anime)}
                            className="p-1.5 rounded hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                            title="Edit Anime"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${anime.title}?`)) {
                                deleteAnime(anime.id);
                              }
                            }}
                            className="p-1.5 rounded hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete Anime"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ADD / EDIT ANIME FORM */}
      {activeTab === 'add-anime' && (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6 max-w-3xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h2 className="text-xl font-bold text-white font-display">
              {editingAnimeId ? 'Edit Anime Title' : 'Add New Anime to Catalog'}
            </h2>
            {editingAnimeId && (
              <button
                onClick={() => {
                  setEditingAnimeId(null);
                  setActiveTab('manage-anime');
                }}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleAnimeSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Anime Title (English / Standard) *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Bleach: Thousand-Year Blood War"
                  className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Alternative Title (Romaji / Japanese)</label>
                <input
                  type="text"
                  value={formAltTitle}
                  onChange={(e) => setFormAltTitle(e.target.value)}
                  placeholder="e.g. ブリーチ 千年血戦篇"
                  className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as AnimeType)}
                  className="w-full bg-[#0d0f17] text-neutral-200 px-2.5 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                >
                  <option value="TV">TV Series</option>
                  <option value="Movie">Movie</option>
                  <option value="OVA">OVA</option>
                  <option value="ONA">ONA</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as AnimeStatus)}
                  className="w-full bg-[#0d0f17] text-neutral-200 px-2.5 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Release Year</label>
                <input
                  type="number"
                  value={formYear}
                  onChange={(e) => setFormYear(parseInt(e.target.value, 10))}
                  className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Rating (1-10)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={formRating}
                  onChange={(e) => setFormRating(parseFloat(e.target.value))}
                  className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Total Episodes</label>
                <input
                  type="number"
                  value={formTotalEpisodes}
                  onChange={(e) => setFormTotalEpisodes(parseInt(e.target.value, 10))}
                  className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Studio</label>
                <input
                  type="text"
                  value={formStudio}
                  onChange={(e) => setFormStudio(e.target.value)}
                  placeholder="e.g. MAPPA, ufotable, Bones"
                  className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Audio / Language</label>
                <input
                  type="text"
                  value={formLanguage}
                  onChange={(e) => setFormLanguage(e.target.value)}
                  placeholder="e.g. Sub & Dub"
                  className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Poster & Banner URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Poster Image URL</label>
                <input
                  type="url"
                  value={formPosterImage}
                  onChange={(e) => setFormPosterImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Cover / Banner Image URL</label>
                <input
                  type="url"
                  value={formBannerImage}
                  onChange={(e) => setFormBannerImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Genres Tag Selector */}
            <div>
              <label className="block font-medium text-neutral-300 mb-1.5">Select Genres</label>
              <div className="flex flex-wrap gap-2">
                {GENRES_LIST.filter(g => g !== 'All').map((genre) => {
                  const isSelected = formGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setFormGenres(formGenres.filter(g => g !== genre));
                        } else {
                          setFormGenres([...formGenres, genre]);
                        }
                      }}
                      className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <label className="block font-medium text-neutral-300 mb-1">Synopsis & Plot Description</label>
              <textarea
                rows={4}
                value={formSynopsis}
                onChange={(e) => {
                  setFormSynopsis(e.target.value);
                  setFormDescription(e.target.value);
                }}
                placeholder="Detailed summary of the anime narrative..."
                className="w-full bg-[#0d0f17] text-neutral-200 p-3 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('manage-anime')}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-600/30"
              >
                {editingAnimeId ? 'Save Anime Changes' : 'Publish Anime'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: EPISODE MANAGEMENT */}
      {activeTab === 'episodes' && (
        <div className="space-y-6">
          {/* Add episode form */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white font-display">Add Episode to Catalog</h3>
            <form onSubmit={handleAddEpisodeSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-400 mb-1">Select Anime</label>
                <select
                  value={selectedAnimeForEpisode}
                  onChange={(e) => setSelectedAnimeForEpisode(e.target.value)}
                  className="w-full bg-[#0d0f17] text-neutral-200 px-2.5 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                >
                  {animeList.map((a) => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-400 mb-1">Episode Number</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={epNumber}
                  onChange={(e) => setEpNumber(parseInt(e.target.value, 10))}
                  className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-neutral-400 mb-1">Episode Title</label>
                <input
                  type="text"
                  required
                  value={epTitle}
                  onChange={(e) => setEpTitle(e.target.value)}
                  placeholder="e.g. The Hashira Summit"
                  className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-medium text-neutral-400 mb-1">Video Stream URL (MP4 / WebM / HLS)</label>
                <input
                  type="url"
                  required
                  value={epVideoUrl}
                  onChange={(e) => setEpVideoUrl(e.target.value)}
                  className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold shadow-md transition-all"
                >
                  Upload Episode
                </button>
              </div>
            </form>
          </div>

          {/* List of episodes for selected anime */}
          {(() => {
            const currentSelectedAnime = animeList.find(a => a.id === selectedAnimeForEpisode) || animeList[0];
            return (
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h3 className="text-sm font-bold text-white font-display">
                    Existing Episodes: {currentSelectedAnime?.title}
                  </h3>
                  <span className="text-xs text-neutral-400 font-medium">
                    {currentSelectedAnime?.episodes.length} episodes uploaded
                  </span>
                </div>

                <div className="space-y-2">
                  {currentSelectedAnime?.episodes.map((ep) => (
                    <div
                      key={ep.id}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-bold text-purple-400 font-mono">#{ep.episodeNumber}</span>
                        <div className="min-w-0">
                          <span className="font-semibold text-white truncate block">{ep.title}</span>
                          <span className="text-[11px] text-neutral-400">{ep.duration} · {ep.releaseDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 font-mono text-[11px] hidden sm:inline truncate max-w-xs">
                          {ep.videoUrl}
                        </span>
                        <button
                          onClick={() => {
                            if (confirm(`Remove episode ${ep.episodeNumber}?`)) {
                              deleteEpisode(currentSelectedAnime.id, ep.id);
                            }
                          }}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 5: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white font-display">User Accounts & Roles</h3>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by username or email..."
                className="w-full bg-[#0d0f17] text-neutral-200 pl-8 pr-3 py-1.5 rounded-lg text-xs border border-white/10"
              />
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Joined</th>
                  <th className="py-3 px-2">Watchlist Items</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {users
                  .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                  .map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3 flex items-center gap-3">
                        <UserAvatar
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                        />
                        <div>
                          <div className="font-semibold text-white">{user.name}</div>
                          <div className="text-[11px] text-neutral-400">@{user.username} · {user.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          user.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-neutral-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-neutral-400">{user.joinedDate}</td>
                      <td className="py-3 px-2 font-mono tabular-nums">{user.watchlist.length}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          user.isBlocked ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'
                        }`}>
                          {user.isBlocked ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => toggleUserBlock(user.id)}
                          disabled={user.id === currentUser.id}
                          className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                            user.isBlocked
                              ? 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30'
                              : 'bg-rose-600/20 text-rose-300 hover:bg-rose-600/30'
                          } ${user.id === currentUser.id ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          {user.isBlocked ? 'Unblock' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: COMMENT MODERATION */}
      {activeTab === 'comments' && (
        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white font-display">Comment Moderation Queue</h3>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={commentSearch}
                onChange={(e) => setCommentSearch(e.target.value)}
                placeholder="Search reviews..."
                className="w-full bg-[#0d0f17] text-neutral-200 pl-8 pr-3 py-1.5 rounded-lg text-xs border border-white/10"
              />
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-3">
            {comments
              .filter(c => c.text.toLowerCase().includes(commentSearch.toLowerCase()) || c.userName.toLowerCase().includes(commentSearch.toLowerCase()))
              .map((comm) => {
                const targetAnime = animeList.find(a => a.id === comm.animeId);
                return (
                  <div key={comm.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{comm.userName}</span>
                        <span className="text-[11px] text-purple-400">on {targetAnime?.title || comm.animeId}</span>
                        <span className="text-neutral-500 text-[10px]">· {comm.createdAt}</span>
                      </div>
                      <p className="text-neutral-300 leading-relaxed">{comm.text}</p>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-3 pt-1">
                        <span>Score: {comm.rating ? `${comm.rating}/10` : 'None'}</span>
                        <span>Likes: {comm.likes}</span>
                        <span>Dislikes: {comm.dislikes}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteComment(comm.id)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition-colors shrink-0"
                      title="Delete inappropriate comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 7: MYSQL DATABASE DUMP & XAMPP GUIDE */}
      {activeTab === 'sql-schema' && (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <span>Production MySQL Schema & XAMPP Deployment</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Complete relational database definition (DDL), indexes, foreign keys, and seed data for local hosting.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 text-xs font-semibold transition-colors"
              >
                {sqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{sqlCopied ? 'Copied' : 'Copy SQL'}</span>
              </button>

              <button
                onClick={handleDownloadSql}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .sql File</span>
              </button>
            </div>
          </div>

          {/* Quick instructions */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>XAMPP / PHP / MySQL Localhost Installation Steps</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-neutral-300">
              <li>Start Apache & MySQL in the XAMPP Control Panel.</li>
              <li>Open <code className="text-amber-400">http://localhost/phpmyadmin</code> in your web browser.</li>
              <li>Click <strong>Import</strong> tab and upload the downloaded <code className="text-amber-400">zenith_anime_database.sql</code> file, or click <strong>SQL</strong> tab and paste the schema below.</li>
              <li>Execute the script. It creates the database <code className="text-amber-400">zenith_anime_db</code> with all 11 relational tables and initial sample anime records!</li>
            </ol>
          </div>

          {/* Code Viewer */}
          <div className="relative">
            <pre className="p-4 rounded-xl bg-[#090b10] border border-white/10 text-neutral-300 font-mono text-[11px] leading-relaxed max-h-96 overflow-y-auto select-all">
              {MYSQL_DATABASE_SQL}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

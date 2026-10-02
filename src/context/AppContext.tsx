import { IMG, serializeForStorage, parseFromStorage } from '../assets/images';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Anime, Episode, ReviewComment, User, WatchHistoryItem, WatchStatus } from '../types';
import { INITIAL_ANIME_LIST, INITIAL_COMMENTS, INITIAL_USERS } from '../data/animeData';
import { makeInitialAvatar } from '../components/UserAvatar';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export type BrowseMode = 'all' | 'popular' | 'latest';

export type LoginResult = 'ok' | 'not_found' | 'bad_password' | 'blocked' | 'error';

const toHex = (bytes: Uint8Array) => Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');

const makeSalt = (): string => toHex(crypto.getRandomValues(new Uint8Array(16)));

// Passwords are never stored in plain text: salted SHA-256 hash only.
const hashPassword = async (password: string, salt: string): Promise<string> => {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(new Uint8Array(digest));
};

// Demo accounts that ship with the project (admin, faizan_otaku, sakura_h) use this password.
const DEMO_ACCOUNT_PASSWORD = 'password123';

const isDefaultAvatar = (avatar: string): boolean =>
  !avatar ||
  avatar === IMG.AVATAR_TANJIRO ||
  avatar.startsWith('/src/assets') ||
  avatar.includes('images.unsplash.com/photo');

interface AppContextType {
  // Navigation & Routing
  currentView: string;
  selectedAnimeId: string | null;
  selectedEpisodeNumber: number;
  navigateTo: (view: string, animeId?: string, episodeNumber?: number) => void;
  browseMode: BrowseMode;
  browseGenre: string;
  browseNonce: number;
  openBrowse: (mode?: BrowseMode, genre?: string) => void;

  // Authentication
  currentUser: User | null;
  users: User[];
  login: (emailOrUsername: string, password: string) => Promise<LoginResult>;
  register: (name: string, username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  switchDemoUser: (userId: string) => void;
  toggleUserBlock: (userId: string) => void;

  // Anime Data & Admin CRUD
  animeList: Anime[];
  getAnimeById: (id: string) => Anime | undefined;
  addAnime: (newAnime: Omit<Anime, 'id'>) => Anime;
  updateAnime: (id: string, updatedFields: Partial<Anime>) => void;
  deleteAnime: (id: string) => void;

  // Episodes CRUD
  addEpisode: (animeId: string, episode: Omit<Episode, 'id' | 'animeId'>) => void;
  updateEpisode: (animeId: string, episodeId: string, updatedEpisode: Partial<Episode>) => void;
  deleteEpisode: (animeId: string, episodeId: string) => void;

  // User Actions (Watchlist, Favorites, History)
  isFavorite: (animeId: string) => boolean;
  toggleFavorite: (animeId: string) => void;
  isWatchlisted: (animeId: string) => boolean;
  getWatchlistStatus: (animeId: string) => WatchStatus | null;
  updateWatchlist: (animeId: string, status?: WatchStatus) => void;
  removeFromWatchlist: (animeId: string) => void;
  clearWatchlist: (statusFilter?: string) => void;
  recordWatchProgress: (animeId: string, episodeNumber: number, progressSeconds: number, durationSeconds: number) => void;
  getWatchProgress: (animeId: string, episodeNumber: number) => WatchHistoryItem | undefined;
  clearWatchHistory: () => void;
  removeFromWatchHistory: (animeId: string) => void;

  // Comments & Reviews
  comments: ReviewComment[];
  addComment: (animeId: string, text: string, rating?: number, episodeId?: string) => void;
  addReply: (commentId: string, text: string) => void;
  likeComment: (commentId: string) => void;
  dislikeComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;

  // Global UI State
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Auth Modal
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [browseMode, setBrowseMode] = useState<BrowseMode>('all');
  const [browseGenre, setBrowseGenre] = useState<string>('All');
  const [browseNonce, setBrowseNonce] = useState(0);
  const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>('demon-slayer');
  const [selectedEpisodeNumber, setSelectedEpisodeNumber] = useState<number>(1);

  // App Theme (Default Dark with localStorage persistence)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('zenith_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.error(e);
    }
    return 'dark';
  });

  // Sync theme with document element
  useEffect(() => {
    try {
      localStorage.setItem('zenith_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auth Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Anime State (with localStorage persistence)
  const [animeList, setAnimeList] = useState<Anime[]>(() => {
    try {
      const saved = localStorage.getItem('zenith_anime_list_v32');
      if (saved) return parseFromStorage<Anime[]>(saved);
      localStorage.removeItem('zenith_anime_list_v13'); localStorage.removeItem('zenith_anime_list_v14'); localStorage.removeItem('zenith_anime_list_v15'); localStorage.removeItem('zenith_anime_list_v16'); localStorage.removeItem('zenith_anime_list_v17'); localStorage.removeItem('zenith_anime_list_v18'); localStorage.removeItem('zenith_anime_list_v19'); localStorage.removeItem('zenith_anime_list_v20'); localStorage.removeItem('zenith_anime_list_v21'); localStorage.removeItem('zenith_anime_list_v22'); localStorage.removeItem('zenith_anime_list_v23'); localStorage.removeItem('zenith_anime_list_v24'); localStorage.removeItem('zenith_anime_list_v25'); localStorage.removeItem('zenith_anime_list_v26'); localStorage.removeItem('zenith_anime_list_v27'); localStorage.removeItem('zenith_anime_list_v28'); localStorage.removeItem('zenith_anime_list_v29'); localStorage.removeItem('zenith_anime_list_v30'); localStorage.removeItem('zenith_anime_list_v31');
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ANIME_LIST;
  });

  // Users State
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('zenith_users');
      if (saved) {
        const parsed = parseFromStorage<User[]>(saved);
        return parsed.map((u: User) => {
          if (!u.avatar || u.avatar.startsWith('/src/assets') || u.avatar.includes('images.unsplash.com/photo-1535713875002') || u.avatar.includes('images.unsplash.com/photo-1566492031773')) {
            return {
              ...u,
              avatar: u.id === 'user-admin'
                ? IMG.AVATAR_GOJO
                : IMG.AVATAR_TANJIRO
            };
          }
          return u;
        });
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USERS;
  });

  // Current Logged In User: starts signed out unless a session was saved by a real sign-in
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    let userToSet: User | null = null;
    try {
      // Old builds auto-signed everyone in as a default user; drop that legacy session key once
      localStorage.removeItem('zenith_active_user_id');
      const savedUserId = localStorage.getItem('zenith_session_user_id');
      if (savedUserId) {
        const found = users.find(u => u.id === savedUserId);
        if (found && !found.isBlocked) userToSet = found;
      }
    } catch (e) {
      console.error(e);
    }
    if (userToSet && (!userToSet.avatar || userToSet.avatar.startsWith('/src/assets') || userToSet.avatar.includes('images.unsplash.com/photo-1535713875002') || userToSet.avatar.includes('images.unsplash.com/photo-1566492031773'))) {
      userToSet = {
        ...userToSet,
        avatar: userToSet.id === 'user-admin'
          ? IMG.AVATAR_GOJO
          : IMG.AVATAR_TANJIRO
      };
    }
    return userToSet;
  });

  // Comments State
  const [comments, setComments] = useState<ReviewComment[]>(() => {
    try {
      const saved = localStorage.getItem('zenith_comments');
      if (saved) return parseFromStorage<ReviewComment[]>(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMMENTS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zenith_anime_list_v32', serializeForStorage(animeList));
    } catch (e) {
      console.error(e);
    }
  }, [animeList]);

  useEffect(() => {
    try {
      localStorage.setItem('zenith_users', serializeForStorage(users));
      if (currentUser) {
        localStorage.setItem('zenith_session_user_id', currentUser.id);
      } else {
        localStorage.removeItem('zenith_session_user_id');
      }
    } catch (e) {
      console.error(e);
    }
  }, [users, currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('zenith_comments', serializeForStorage(comments));
    } catch (e) {
      console.error(e);
    }
  }, [comments]);

  const showToast = (title: string, message?: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigateTo = (view: string, animeId?: string, episodeNumber?: number) => {
    setCurrentView(view);
    if (animeId !== undefined) {
      setSelectedAnimeId(animeId);
    }
    if (episodeNumber !== undefined) {
      setSelectedEpisodeNumber(episodeNumber);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Opens the catalog page preset to Popular / Latest Releases (or a genre).
  const openBrowse = (mode: BrowseMode = 'all', genre: string = 'All') => {
    setBrowseMode(mode);
    setBrowseGenre(genre);
    setBrowseNonce(n => n + 1);
    navigateTo('browse');
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(
      next === 'light' ? 'Light Theme Activated' : 'Dark Theme Activated',
      next === 'light' ? 'Switched to bright day mode.' : 'Switched to cinematic dark mode.',
      'info'
    );
  };

  // Auth Methods
  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (emailOrUsername: string, password: string): Promise<LoginResult> => {
    const input = emailOrUsername.trim().toLowerCase();
    const found = users.find(
      u => u.email.toLowerCase() === input ||
           u.username.toLowerCase() === input
    );

    if (!found) return 'not_found';

    try {
      let passwordOk = false;
      let upgraded: { passwordHash: string; salt: string } | null = null;

      if (found.passwordHash && found.salt) {
        passwordOk = (await hashPassword(password, found.salt)) === found.passwordHash;
      } else if (INITIAL_USERS.some(d => d.id === found.id) && password === DEMO_ACCOUNT_PASSWORD) {
        // Demo account without a stored hash: accept the demo password once and store a proper hash.
        passwordOk = true;
        const salt = makeSalt();
        upgraded = { salt, passwordHash: await hashPassword(password, salt) };
      }

      if (!passwordOk) return 'bad_password';
      if (found.isBlocked) {
        showToast('Access Restricted', 'Your account has been suspended by an administrator.', 'error');
        return 'blocked';
      }

      let signedIn: User = { ...found, ...(upgraded || {}) };
      // Accounts still on the default picture get the first letter of their email as profile picture.
      if (isDefaultAvatar(signedIn.avatar)) {
        signedIn = { ...signedIn, avatar: makeInitialAvatar(signedIn.email) };
      }

      setUsers(prev => prev.map(u => (u.id === signedIn.id ? signedIn : u)));
      setCurrentUser(signedIn);
      setIsAuthModalOpen(false);
      showToast('Welcome back!', `Signed in as ${signedIn.name}`, 'success');
      return 'ok';
    } catch (e) {
      console.error(e);
      return 'error';
    }
  };

  const register = async (name: string, username: string, email: string, password: string): Promise<boolean> => {
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedEmail = email.trim().toLowerCase();

    if (users.some(u => u.username.toLowerCase() === trimmedUsername)) {
      showToast('Registration Error', 'Username is already taken. Please choose another.', 'error');
      return false;
    }

    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      showToast('Registration Error', 'An account with this email already exists. Please sign in.', 'error');
      return false;
    }

    try {
      const salt = makeSalt();
      const passwordHash = await hashPassword(password, salt);

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        username: trimmedUsername,
        email: trimmedEmail,
        role: 'user',
        avatar: makeInitialAvatar(trimmedEmail),
        bio: 'New anime enthusiast on ZenithAnime.',
        joinedDate: new Date().toISOString().split('T')[0],
        isBlocked: false,
        passwordHash,
        salt,
        watchlist: [],
        favorites: [],
        watchHistory: []
      };

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsAuthModalOpen(false);
      showToast('Account Created!', `Welcome to ZenithAnime, ${newUser.name}!`, 'success');
      return true;
    } catch (e) {
      console.error(e);
      showToast('Registration Error', 'Could not create the account. Please try again.', 'error');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged Out', 'You have been signed out safely.', 'info');
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    showToast('Profile Updated', 'Your profile details have been saved.', 'success');
  };

  const switchDemoUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      showToast('Switched User', `Now browsing as ${target.name} (${target.role.toUpperCase()})`, 'info');
    }
  };

  const toggleUserBlock = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    const nextState = !target.isBlocked;
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, isBlocked: nextState } : u)));
    if (nextState && currentUser?.id === userId) {
      setCurrentUser(null);
    }
    showToast(nextState ? 'User Suspended' : 'User Reinstated', `${target.name} is now ${nextState ? 'blocked' : 'active'}.`, 'warning');
  };

  // Anime Helpers
  const getAnimeById = (id: string): Anime | undefined => {
    return animeList.find(a => a.id === id);
  };

  const addAnime = (newAnime: Omit<Anime, 'id'>): Anime => {
    const baseId = newAnime.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `anime-${Date.now()}`;
    const id = animeList.some(a => a.id === baseId) ? `${baseId}-${Date.now()}` : baseId;
    const created: Anime = {
      ...newAnime,
      id,
      published: newAnime.published !== undefined ? newAnime.published : true,
      views: 0
    };
    setAnimeList(prev => [created, ...prev]);
    showToast('Anime Added', `${created.title} has been added to the catalog.`, 'success');
    return created;
  };

  const updateAnime = (id: string, updatedFields: Partial<Anime>) => {
    setAnimeList(prev => prev.map(a => a.id === id ? { ...a, ...updatedFields } : a));
    showToast('Anime Updated', 'Catalog details have been refreshed.', 'success');
  };

  const deleteAnime = (id: string) => {
    setAnimeList(prev => prev.filter(a => a.id !== id));
    showToast('Anime Deleted', 'The title has been removed from the platform.', 'info');
  };

  // Episode Helpers
  const addEpisode = (animeId: string, episodeData: Omit<Episode, 'id' | 'animeId'>) => {
    const newEp: Episode = {
      ...episodeData,
      id: `${animeId}-ep-${episodeData.episodeNumber}`,
      animeId,
      views: 0
    };

    setAnimeList(prev => prev.map(a => {
      if (a.id === animeId) {
        const updatedEpisodes = [...a.episodes, newEp].sort((x, y) => x.episodeNumber - y.episodeNumber);
        return {
          ...a,
          episodes: updatedEpisodes,
          totalEpisodes: Math.max(a.totalEpisodes, updatedEpisodes.length)
        };
      }
      return a;
    }));

    showToast('Episode Uploaded', `Episode ${newEp.episodeNumber}: "${newEp.title}" is now available.`, 'success');
  };

  const updateEpisode = (animeId: string, episodeId: string, updatedEpisode: Partial<Episode>) => {
    setAnimeList(prev => prev.map(a => {
      if (a.id === animeId) {
        return {
          ...a,
          episodes: a.episodes.map(ep => ep.id === episodeId ? { ...ep, ...updatedEpisode } : ep)
        };
      }
      return a;
    }));
    showToast('Episode Updated', 'Episode changes saved successfully.', 'success');
  };

  const deleteEpisode = (animeId: string, episodeId: string) => {
    setAnimeList(prev => prev.map(a => {
      if (a.id === animeId) {
        return {
          ...a,
          episodes: a.episodes.filter(ep => ep.id !== episodeId)
        };
      }
      return a;
    }));
    showToast('Episode Removed', 'Episode has been deleted.', 'info');
  };

  // User Actions (Favorites & Watchlist)
  const isFavorite = (animeId: string): boolean => {
    return currentUser?.favorites.includes(animeId) ?? false;
  };

  const toggleFavorite = (animeId: string) => {
    if (!currentUser) {
      openAuthModal('login');
      showToast('Sign in required', 'Please sign in to add anime to your favorites.', 'info');
      return;
    }

    const alreadyFav = currentUser.favorites.includes(animeId);
    const newFavorites = alreadyFav
      ? currentUser.favorites.filter(id => id !== animeId)
      : [...currentUser.favorites, animeId];

    const updatedUser = { ...currentUser, favorites: newFavorites };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    showToast(
      alreadyFav ? 'Removed from Favorites' : 'Added to Favorites',
      alreadyFav ? 'Anime removed from your favorites list.' : 'Saved to your favorite anime collection!',
      'success'
    );
  };

  const isWatchlisted = (animeId: string): boolean => {
    return currentUser?.watchlist.some(w => w.animeId === animeId) ?? false;
  };

  const getWatchlistStatus = (animeId: string): WatchStatus | null => {
    const item = currentUser?.watchlist.find(w => w.animeId === animeId);
    return item ? item.status : null;
  };

  const updateWatchlist = (animeId: string, status: WatchStatus = 'watching') => {
    if (!currentUser) {
      openAuthModal('login');
      showToast('Sign in required', 'Please sign in to manage your watchlist.', 'info');
      return;
    }

    const existingIndex = currentUser.watchlist.findIndex(w => w.animeId === animeId);
    let newWatchlist = [...currentUser.watchlist];

    if (existingIndex >= 0) {
      newWatchlist[existingIndex] = {
        ...newWatchlist[existingIndex],
        status
      };
    } else {
      newWatchlist.push({
        animeId,
        status,
        addedAt: new Date().toISOString().split('T')[0]
      });
    }

    const updatedUser = { ...currentUser, watchlist: newWatchlist };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    showToast('Watchlist Updated', `Anime status set to "${status.replace(/_/g, ' ')}"`, 'success');
  };

  const removeFromWatchlist = (animeId: string) => {
    if (!currentUser) return;
    const newWatchlist = currentUser.watchlist.filter(w => w.animeId !== animeId);
    const updatedUser = { ...currentUser, watchlist: newWatchlist };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    showToast('Removed from Watchlist', 'Title removed from your watchlist.', 'info');
  };

  const clearWatchlist = (statusFilter?: string) => {
    if (!currentUser) return;
    let newWatchlist = currentUser.watchlist;
    if (!statusFilter || statusFilter === 'all') {
      newWatchlist = [];
    } else {
      newWatchlist = currentUser.watchlist.filter(w => w.status !== statusFilter);
    }
    const updatedUser = { ...currentUser, watchlist: newWatchlist };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    showToast(
      'Watchlist Cleared',
      !statusFilter || statusFilter === 'all'
        ? 'All anime have been removed from your watchlist.'
        : `All "${statusFilter.replace(/_/g, ' ')}" titles removed from your watchlist.`,
      'info'
    );
  };

  const recordWatchProgress = (
    animeId: string,
    episodeNumber: number,
    progressSeconds: number,
    durationSeconds: number
  ) => {
    if (!currentUser) return;

    const existingHistory = [...currentUser.watchHistory];
    const index = existingHistory.findIndex(h => h.animeId === animeId);

    const newItem: WatchHistoryItem = {
      animeId,
      episodeNumber,
      progressSeconds: Math.floor(progressSeconds),
      durationSeconds: Math.floor(durationSeconds),
      lastWatchedAt: new Date().toISOString()
    };

    if (index >= 0) {
      existingHistory[index] = newItem;
    } else {
      existingHistory.unshift(newItem);
    }

    const updatedUser = { ...currentUser, watchHistory: existingHistory };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const getWatchProgress = (animeId: string, episodeNumber: number): WatchHistoryItem | undefined => {
    return currentUser?.watchHistory.find(
      h => h.animeId === animeId && h.episodeNumber === episodeNumber
    );
  };

  const clearWatchHistory = () => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, watchHistory: [] };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    showToast('Watch History Cleared', 'Your entire watch history has been cleared.', 'info');
  };

  const removeFromWatchHistory = (animeId: string) => {
    if (!currentUser) return;
    const updatedHistory = currentUser.watchHistory.filter(h => h.animeId !== animeId);
    const updatedUser = { ...currentUser, watchHistory: updatedHistory };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    showToast('Removed from History', 'Episode removed from your watch history.', 'info');
  };

  // Comments & Reviews
  const addComment = (animeId: string, text: string, rating?: number, episodeId?: string) => {
    if (!currentUser) {
      openAuthModal('login');
      showToast('Sign in required', 'Please sign in to post a comment or review.', 'info');
      return;
    }

    const newComment: ReviewComment = {
      id: `comm-${Date.now()}`,
      animeId,
      episodeId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      text: text.trim(),
      rating,
      createdAt: 'Just now',
      likes: 0,
      dislikes: 0,
      replies: []
    };

    setComments(prev => [newComment, ...prev]);
    showToast('Comment Posted', 'Thank you for sharing your thoughts!', 'success');
  };

  const addReply = (commentId: string, text: string) => {
    if (!currentUser) {
      openAuthModal('login');
      showToast('Sign in required', 'Please sign in to reply.', 'info');
      return;
    }

    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              id: `rep-${Date.now()}`,
              commentId,
              userId: currentUser.id,
              userName: currentUser.name,
              userAvatar: currentUser.avatar,
              userRole: currentUser.role,
              text: text.trim(),
              createdAt: 'Just now',
              likes: 0
            }
          ]
        };
      }
      return c;
    }));

    showToast('Reply Posted', 'Your reply has been submitted.', 'success');
  };

  const likeComment = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        if (c.userVoted === 'like') {
          return { ...c, likes: Math.max(0, c.likes - 1), userVoted: undefined };
        }
        const dislikesDelta = c.userVoted === 'dislike' ? -1 : 0;
        return {
          ...c,
          likes: c.likes + 1,
          dislikes: Math.max(0, c.dislikes + dislikesDelta),
          userVoted: 'like'
        };
      }
      return c;
    }));
  };

  const dislikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        if (c.userVoted === 'dislike') {
          return { ...c, dislikes: Math.max(0, c.dislikes - 1), userVoted: undefined };
        }
        const likesDelta = c.userVoted === 'like' ? -1 : 0;
        return {
          ...c,
          dislikes: c.dislikes + 1,
          likes: Math.max(0, c.likes + likesDelta),
          userVoted: 'dislike'
        };
      }
      return c;
    }));
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    showToast('Comment Removed', 'The comment has been removed.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        selectedAnimeId,
        selectedEpisodeNumber,
        navigateTo,
        browseMode,
        browseGenre,
        browseNonce,
        openBrowse,

        currentUser,
        users,
        login,
        register,
        logout,
        updateProfile,
        switchDemoUser,
        toggleUserBlock,

        animeList,
        getAnimeById,
        addAnime,
        updateAnime,
        deleteAnime,

        addEpisode,
        updateEpisode,
        deleteEpisode,

        isFavorite,
        toggleFavorite,
        isWatchlisted,
        getWatchlistStatus,
        updateWatchlist,
        removeFromWatchlist,
        clearWatchlist,
        recordWatchProgress,
        getWatchProgress,
        clearWatchHistory,
        removeFromWatchHistory,

        comments,
        addComment,
        addReply,
        likeComment,
        dislikeComment,
        deleteComment,

        theme,
        toggleTheme,
        toasts,
        showToast,
        removeToast,

        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

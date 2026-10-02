export type AnimeType = 'TV' | 'Movie' | 'OVA' | 'ONA';
export type AnimeStatus = 'Ongoing' | 'Completed';
export type WatchStatus = 'watching' | 'plan_to_watch' | 'completed' | 'on_hold' | 'dropped';

export interface Episode {
  id: string;
  animeId: string;
  episodeNumber: number;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  releaseDate: string;
  views: number;
  synopsis?: string;
}

export interface CommentReply {
  id: string;
  commentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: 'user' | 'admin' | 'moderator';
  text: string;
  createdAt: string;
  likes: number;
}

export interface ReviewComment {
  id: string;
  animeId: string;
  episodeId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: 'user' | 'admin' | 'moderator';
  text: string;
  rating?: number; // 1 to 10
  createdAt: string;
  likes: number;
  dislikes: number;
  userVoted?: 'like' | 'dislike';
  replies: CommentReply[];
}

export interface Anime {
  id: string;
  title: string;
  altTitle: string;
  description: string;
  synopsis: string;
  genres: string[];
  releaseYear: number;
  rating: number; // e.g. 9.1
  ratingCount: number;
  totalEpisodes: number;
  type: AnimeType;
  status: AnimeStatus;
  studio: string;
  language: string;
  bannerImage: string;
  posterImage: string;
  trailerUrl?: string;
  featured?: boolean;
  trending?: boolean;
  popular?: boolean;
  latest?: boolean;
  published: boolean;
  episodes: Episode[];
  relatedAnimeIds?: string[];
  views: number;
}

export interface WatchHistoryItem {
  animeId: string;
  episodeNumber: number;
  progressSeconds: number;
  durationSeconds: number;
  lastWatchedAt: string;
}

export interface WatchlistItem {
  animeId: string;
  status: WatchStatus;
  addedAt: string;
  rating?: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  bio: string;
  joinedDate: string;
  isBlocked?: boolean;
  passwordHash?: string;
  salt?: string;
  watchlist: WatchlistItem[];
  favorites: string[]; // animeIds
  watchHistory: WatchHistoryItem[];
}

export interface FilterState {
  search: string;
  genre: string;
  type: string;
  status: string;
  year: string;
  minRating: number;
  sortBy: 'popularity' | 'rating' | 'newest' | 'alphabetical';
}

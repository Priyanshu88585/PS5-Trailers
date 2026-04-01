// ============================================
// GLOBAL TYPE DEFINITIONS
// ============================================

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin" | "superadmin";
  bio?: string;
  watchHistory: string[];
  likedVideos: string[];
  savedPlaylists: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail: string;
  thumbnailPublicId?: string;
  videoUrl: string;
  hlsUrl?: string;
  videoPublicId?: string;
  duration: number;
  views: number;
  likes: number;
  dislikes: number;
  category: VideoCategory;
  tags: string[];
  gameTitle: string;
  developer?: string;
  publisher?: string;
  releaseDate?: string;
  platform: string[];
  trailerType: TrailerType;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  isTrending: boolean;
  downloadUrl?: string;
  resolution?: "720p" | "1080p" | "1440p" | "4K";
  uploadedBy: string | User;
  commentCount: number;
  trendingScore: number;
  createdAt: string;
  updatedAt: string;
}

export type VideoCategory =
  | "action"
  | "adventure"
  | "rpg"
  | "racing"
  | "sports"
  | "horror"
  | "shooter"
  | "fighting"
  | "simulation"
  | "strategy"
  | "puzzle"
  | "platformer"
  | "open-world"
  | "exclusive"
  | "indie"
  | "other";

export type TrailerType =
  | "announcement"
  | "gameplay"
  | "cinematic"
  | "launch"
  | "dlc"
  | "update"
  | "teaser";

export interface Comment {
  _id: string;
  content: string;
  author: User;
  video: string;
  parentComment?: string;
  replies?: Comment[];
  likes: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  _id: string;
  user: string;
  video: string;
  type: "like" | "dislike";
  createdAt: string;
}

export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  owner: string | User;
  videos: string[] | Video[];
  isPublic: boolean;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalViews: number;
  totalLikes: number;
  totalVideos: number;
  totalUsers: number;
  viewsToday: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  topVideos: Video[];
  recentActivity: ActivityLog[];
  categoryBreakdown: { category: string; count: number }[];
}

export interface ActivityLog {
  _id: string;
  type: "view" | "like" | "comment" | "upload" | "download";
  user?: string;
  video?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface SearchFilters {
  q?: string;
  category?: VideoCategory;
  sort?: "newest" | "oldest" | "most-viewed" | "most-liked" | "trending";
  page?: number;
  limit?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type SidebarState = "expanded" | "collapsed" | "hidden";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

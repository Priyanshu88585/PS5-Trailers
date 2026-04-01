export const CATEGORIES = [
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "rpg", label: "RPG" },
  { value: "racing", label: "Racing" },
  { value: "sports", label: "Sports" },
  { value: "horror", label: "Horror" },
  { value: "shooter", label: "Shooter" },
  { value: "fighting", label: "Fighting" },
  { value: "simulation", label: "Simulation" },
  { value: "strategy", label: "Strategy" },
  { value: "puzzle", label: "Puzzle" },
  { value: "platformer", label: "Platformer" },
  { value: "open-world", label: "Open World" },
  { value: "exclusive", label: "PS5 Exclusive" },
  { value: "indie", label: "Indie" },
  { value: "other", label: "Other" },
];

export const TRAILER_TYPES = [
  { value: "announcement", label: "Announcement" },
  { value: "gameplay", label: "Gameplay" },
  { value: "cinematic", label: "Cinematic" },
  { value: "launch", label: "Launch Trailer" },
  { value: "dlc", label: "DLC" },
  { value: "update", label: "Update" },
  { value: "teaser", label: "Teaser" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "most-viewed", label: "Most Viewed" },
  { value: "most-liked", label: "Most Liked" },
  { value: "trending", label: "Trending" },
];

export const RESOLUTIONS = [
  { value: "720p", label: "720p HD" },
  { value: "1080p", label: "1080p Full HD" },
  { value: "1440p", label: "1440p 2K" },
  { value: "4K", label: "4K Ultra HD" },
];

export const PLATFORMS = ["PS5", "PS4", "PC", "Xbox", "Nintendo Switch", "Mobile"];

export const CATEGORY_COLORS: Record<string, string> = {
  action: "bg-red-500/20 text-red-400",
  adventure: "bg-green-500/20 text-green-400",
  rpg: "bg-purple-500/20 text-purple-400",
  racing: "bg-orange-500/20 text-orange-400",
  sports: "bg-blue-500/20 text-blue-400",
  horror: "bg-gray-500/20 text-gray-400",
  shooter: "bg-yellow-500/20 text-yellow-400",
  fighting: "bg-red-700/20 text-red-300",
  simulation: "bg-teal-500/20 text-teal-400",
  strategy: "bg-indigo-500/20 text-indigo-400",
  puzzle: "bg-pink-500/20 text-pink-400",
  platformer: "bg-cyan-500/20 text-cyan-400",
  "open-world": "bg-emerald-500/20 text-emerald-400",
  exclusive: "bg-ps5-blue/20 text-ps5-blue",
  indie: "bg-violet-500/20 text-violet-400",
  other: "bg-gray-500/20 text-gray-400",
};

export const TRAILER_TYPE_LABELS: Record<string, string> = {
  announcement: "Announcement",
  gameplay: "Gameplay",
  cinematic: "Cinematic",
  launch: "Launch",
  dlc: "DLC",
  update: "Update",
  teaser: "Teaser",
};

export const APP_NAME = "PS5 Trailers";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

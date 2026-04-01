import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Video, SearchFilters } from "@/types";

interface VideoState {
  videos: Video[];
  trending: Video[];
  featured: Video[];
  currentVideo: Video | null;
  relatedVideos: Video[];
  searchResults: Video[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  filters: SearchFilters;
}

const initialState: VideoState = {
  videos: [],
  trending: [],
  featured: [],
  currentVideo: null,
  relatedVideos: [],
  searchResults: [],
  isLoading: false,
  isFetching: false,
  error: null,
  pagination: { page: 1, total: 0, totalPages: 0, hasMore: false },
  filters: { sort: "newest", page: 1, limit: 20 },
};

export const fetchVideos = createAsyncThunk(
  "video/fetchVideos",
  async (filters: SearchFilters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters as Record<string, string>);
      const res = await fetch(`/api/videos?${params}`);
      if (!res.ok) throw new Error("Failed to fetch videos");
      return await res.json();
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

export const fetchTrending = createAsyncThunk(
  "video/fetchTrending",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/trending?limit=10");
      if (!res.ok) throw new Error("Failed to fetch trending");
      const data = await res.json();
      return data.data as Video[];
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  "video/fetchVideoById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/videos/${id}`);
      if (!res.ok) throw new Error("Video not found");
      const data = await res.json();
      return data.data as Video;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

export const searchVideos = createAsyncThunk(
  "video/searchVideos",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      return data.data as Video[];
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setCurrentVideo: (state, action: PayloadAction<Video | null>) => {
      state.currentVideo = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateVideoLikes: (state, action: PayloadAction<{ id: string; likes: number; liked: boolean }>) => {
      const { id, likes, liked } = action.payload;
      if (state.currentVideo?._id === id) {
        state.currentVideo.likes = likes;
      }
      const video = state.videos.find((v) => v._id === id);
      if (video) video.likes = likes;
    },
    incrementVideoViews: (state, action: PayloadAction<string>) => {
      if (state.currentVideo?._id === action.payload) {
        state.currentVideo.views += 1;
      }
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchVideos
      .addCase(fetchVideos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, pagination } = action.payload;
        if (pagination?.page === 1) {
          state.videos = data;
        } else {
          state.videos = [...state.videos, ...data];
        }
        state.pagination = pagination;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchTrending
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending = action.payload;
      })
      // fetchVideoById
      .addCase(fetchVideoById.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.isFetching = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      })
      // searchVideos
      .addCase(searchVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchVideos.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setCurrentVideo,
  setFilters,
  updateVideoLikes,
  incrementVideoViews,
  clearSearchResults,
  clearError,
} = videoSlice.actions;

export default videoSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "@/types";

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  isPosting: boolean;
  error: string | null;
  total: number;
}

const initialState: CommentState = {
  comments: [],
  isLoading: false,
  isPosting: false,
  error: null,
  total: 0,
};

export const fetchComments = createAsyncThunk(
  "comment/fetchComments",
  async (videoId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/comment?videoId=${videoId}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      return data;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

export const postComment = createAsyncThunk(
  "comment/postComment",
  async (
    { videoId, content, parentId }: { videoId: string; content: string; parentId?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, content, parentId }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      const data = await res.json();
      return data.data as Comment;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (commentId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/comment/${commentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete comment");
      return commentId;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload.data;
        state.total = action.payload.total || action.payload.data.length;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(postComment.pending, (state) => {
        state.isPosting = true;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.isPosting = false;
        if (action.payload.parentComment) {
          const parent = state.comments.find((c) => c._id === action.payload.parentComment);
          if (parent) {
            parent.replies = [...(parent.replies || []), action.payload];
          }
        } else {
          state.comments.unshift(action.payload);
          state.total += 1;
        }
      })
      .addCase(postComment.rejected, (state, action) => {
        state.isPosting = false;
        state.error = action.payload as string;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;

import mongoose, { Document, Schema } from "mongoose";

// ---- LIKE MODEL ----
export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  video: mongoose.Types.ObjectId;
  type: "like" | "dislike";
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
    type: { type: String, enum: ["like", "dislike"], required: true },
  },
  { timestamps: true }
);

LikeSchema.index({ user: 1, video: 1 }, { unique: true });
LikeSchema.index({ video: 1, type: 1 });

export const LikeModel =
  mongoose.models.Like || mongoose.model<ILike>("Like", LikeSchema);

// ---- PLAYLIST MODEL ----
export interface IPlaylist extends Document {
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  videos: mongoose.Types.ObjectId[];
  isPublic: boolean;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>(
  {
    name: {
      type: String,
      required: [true, "Playlist name is required"],
      trim: true,
      maxlength: [100, "Playlist name cannot exceed 100 characters"],
    },
    description: { type: String, maxlength: 500, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    isPublic: { type: Boolean, default: false },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

PlaylistSchema.index({ owner: 1, createdAt: -1 });

export const PlaylistModel =
  mongoose.models.Playlist || mongoose.model<IPlaylist>("Playlist", PlaylistSchema);

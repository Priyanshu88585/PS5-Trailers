import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";

export interface IVideo extends Document {
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
  category: string;
  tags: string[];
  gameTitle: string;
  developer?: string;
  publisher?: string;
  releaseDate?: Date;
  platform: string[];
  trailerType: string;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  isTrending: boolean;
  downloadUrl?: string;
  resolution?: string;
  fileSize?: number;
  uploadedBy: mongoose.Types.ObjectId;
  commentCount: number;
  trendingScore: number;
  lastTrendingUpdate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    thumbnail: { type: String, required: [true, "Thumbnail is required"] },
    thumbnailPublicId: { type: String },
    videoUrl: { type: String, required: [true, "Video URL is required"] },
    hlsUrl: { type: String },
    videoPublicId: { type: String },
    duration: { type: Number, default: 0 },
    views: { type: Number, default: 0, min: 0 },
    likes: { type: Number, default: 0, min: 0 },
    dislikes: { type: Number, default: 0, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        "action", "adventure", "rpg", "racing", "sports",
        "horror", "shooter", "fighting", "simulation", "strategy",
        "puzzle", "platformer", "open-world", "exclusive", "indie", "other",
      ],
      default: "other",
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    gameTitle: {
      type: String,
      required: [true, "Game title is required"],
      trim: true,
    },
    developer: { type: String, trim: true },
    publisher: { type: String, trim: true },
    releaseDate: { type: Date },
    platform: [{ type: String }],
    trailerType: {
      type: String,
      enum: ["announcement", "gameplay", "cinematic", "launch", "dlc", "update", "teaser"],
      default: "announcement",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    downloadUrl: { type: String },
    resolution: {
      type: String,
      enum: ["720p", "1080p", "1440p", "4K"],
      default: "1080p",
    },
    fileSize: { type: Number },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentCount: { type: Number, default: 0 },
    trendingScore: { type: Number, default: 0 },
    lastTrendingUpdate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Generate slug before save
VideoSchema.pre("save", async function (next) {
  if (this.isModified("title") || !this.slug) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await mongoose.models.Video?.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
  }
  next();
});

// Trending score calculation
VideoSchema.methods.calculateTrendingScore = function () {
  const ageHours = (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60);
  const gravity = 1.8;
  this.trendingScore =
    (this.views + this.likes * 2 + this.commentCount * 3) /
    Math.pow(ageHours + 2, gravity);
  return this.trendingScore;
};

// Indexes for performance
VideoSchema.index({ status: 1, createdAt: -1 });
VideoSchema.index({ category: 1, status: 1 });
VideoSchema.index({ trendingScore: -1, status: 1 });
VideoSchema.index({ isFeatured: 1, status: 1 });
VideoSchema.index({ views: -1, status: 1 });
VideoSchema.index({ title: "text", description: "text", tags: "text", gameTitle: "text" });

const VideoModel = mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema);
export default VideoModel;

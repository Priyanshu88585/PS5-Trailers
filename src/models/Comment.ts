import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  video: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId;
  likes: number;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    likes: { type: Number, default: 0, min: 0 },
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CommentSchema.index({ video: 1, parentComment: 1, createdAt: -1 });
CommentSchema.index({ author: 1, createdAt: -1 });

const CommentModel = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
export default CommentModel;

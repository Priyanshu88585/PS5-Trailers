import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import CommentModel from "@/models/Comment";
import VideoModel from "@/models/Video";
import { requireAuth, successResponse, errorResponse, handleApiError } from "@/lib/apiMiddleware";
import { z } from "zod";

const commentSchema = z.object({
  videoId: z.string().min(1),
  content: z.string().min(1).max(2000),
  parentId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const videoId = req.nextUrl.searchParams.get("videoId");
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = 20;

    if (!videoId) return errorResponse("Video ID is required", 400);

    // Fetch top-level comments with their replies
    const [comments, total] = await Promise.all([
      CommentModel.find({ video: videoId, parentComment: null, isDeleted: false })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("author", "name image")
        .lean(),
      CommentModel.countDocuments({ video: videoId, parentComment: null, isDeleted: false }),
    ]);

    // Fetch replies for each comment
    const commentIds = comments.map((c) => c._id);
    const replies = await CommentModel.find({
      parentComment: { $in: commentIds },
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .populate("author", "name image")
      .lean();

    const commentsWithReplies = comments.map((comment) => ({
      ...comment,
      replies: replies.filter(
        (r) => r.parentComment?.toString() === comment._id.toString()
      ),
    }));

    return successResponse(commentsWithReplies, undefined, 200);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { session, response } = await requireAuth();
    if (response) return response;

    await connectDB();
    const body = await req.json();
    const parsed = commentSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { videoId, content, parentId } = parsed.data;
    const userId = (session!.user as any).id;

    const comment = await CommentModel.create({
      content,
      author: userId,
      video: videoId,
      parentComment: parentId || null,
    });

    // Increment comment count on video
    await VideoModel.findByIdAndUpdate(videoId, { $inc: { commentCount: 1 } });

    const populated = await comment.populate("author", "name image");
    return successResponse(populated, "Comment posted", 201);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { session, response } = await requireAuth();
    if (response) return response;

    await connectDB();
    const commentId = req.nextUrl.searchParams.get("id");
    if (!commentId) return errorResponse("Comment ID is required", 400);

    const userId = (session!.user as any).id;
    const role = (session!.user as any).role;

    const comment = await CommentModel.findById(commentId);
    if (!comment) return errorResponse("Comment not found", 404);

    const isOwner = comment.author.toString() === userId;
    const isAdmin = role === "admin" || role === "superadmin";

    if (!isOwner && !isAdmin) {
      return errorResponse("Not authorized to delete this comment", 403);
    }

    await CommentModel.findByIdAndUpdate(commentId, { isDeleted: true, content: "[deleted]" });
    await VideoModel.findByIdAndUpdate(comment.video, { $inc: { commentCount: -1 } });

    return successResponse(null, "Comment deleted");
  } catch (err) {
    return handleApiError(err);
  }
}

import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { LikeModel } from "@/models/Like";
import VideoModel from "@/models/Video";
import UserModel from "@/models/User";
import { requireAuth, successResponse, errorResponse, handleApiError } from "@/lib/apiMiddleware";

export async function POST(req: NextRequest) {
  try {
    const { session, response } = await requireAuth();
    if (response) return response;

    await connectDB();
    const { videoId, type = "like" } = await req.json();
    if (!videoId) return errorResponse("Video ID is required", 400);

    const userId = (session!.user as any).id;
    const existing = await LikeModel.findOne({ user: userId, video: videoId });

    let liked = false;
    let likeDelta = 0;
    let dislikeDelta = 0;

    if (existing) {
      if (existing.type === type) {
        // Toggle off
        await existing.deleteOne();
        if (type === "like") { likeDelta = -1; liked = false; }
        else { dislikeDelta = -1; }
      } else {
        // Switch type
        await LikeModel.findByIdAndUpdate(existing._id, { type });
        if (type === "like") { likeDelta = 1; dislikeDelta = -1; liked = true; }
        else { likeDelta = -1; dislikeDelta = 1; liked = false; }
      }
    } else {
      await LikeModel.create({ user: userId, video: videoId, type });
      if (type === "like") { likeDelta = 1; liked = true; }
      else { dislikeDelta = 1; liked = false; }
    }

    // Update video counts atomically
    const video = await VideoModel.findByIdAndUpdate(
      videoId,
      {
        $inc: { likes: likeDelta, dislikes: dislikeDelta },
      },
      { new: true }
    ).select("likes dislikes");

    // Update user's liked videos
    if (liked) {
      await UserModel.findByIdAndUpdate(userId, { $addToSet: { likedVideos: videoId } });
    } else {
      await UserModel.findByIdAndUpdate(userId, { $pull: { likedVideos: videoId } });
    }

    return successResponse({ liked, likes: video?.likes || 0, dislikes: video?.dislikes || 0 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { session, response } = await requireAuth();
    if (response) return response;

    await connectDB();
    const videoId = req.nextUrl.searchParams.get("videoId");
    if (!videoId) return errorResponse("Video ID is required", 400);

    const userId = (session!.user as any).id;
    const like = await LikeModel.findOne({ user: userId, video: videoId });

    return successResponse({ liked: like?.type === "like", disliked: like?.type === "dislike" });
  } catch (err) {
    return handleApiError(err);
  }
}

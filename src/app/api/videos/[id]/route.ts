import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import VideoModel from "@/models/Video";
import UserModel from "@/models/User";
import { requireAdmin, requireAuth, successResponse, errorResponse, handleApiError } from "@/lib/apiMiddleware";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const video = await VideoModel.findById(params.id)
      .populate("uploadedBy", "name image email")
      .lean();
    if (!video) return errorResponse("Video not found", 404);

    // Increment views (fire and forget)
    VideoModel.findByIdAndUpdate(params.id, {
      $inc: { views: 1 },
      $set: { trendingScore: calcTrending(video as any) },
    }).exec();

    // Track watch history if logged in
    const session = await getServerSession(authOptions);
    if (session?.user) {
      const userId = (session.user as any).id;
      UserModel.findByIdAndUpdate(userId, {
        $addToSet: { watchHistory: params.id },
      }).exec();
    }

    // Get related videos by category
    const related = await VideoModel.find({
      _id: { $ne: params.id },
      category: (video as any).category,
      status: "published",
    })
      .sort({ trendingScore: -1 })
      .limit(8)
      .select("title thumbnail duration views likes slug category gameTitle")
      .lean();

    return successResponse({ video, related });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    await connectDB();
    const body = await req.json();

    const video = await VideoModel.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!video) return errorResponse("Video not found", 404);

    return successResponse(video, "Video updated successfully");
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    await connectDB();
    const video = await VideoModel.findByIdAndDelete(params.id);
    if (!video) return errorResponse("Video not found", 404);

    return successResponse(null, "Video deleted successfully");
  } catch (err) {
    return handleApiError(err);
  }
}

function calcTrending(video: { views: number; likes: number; commentCount: number; createdAt: Date }) {
  const ageHours = (Date.now() - new Date(video.createdAt).getTime()) / (1000 * 60 * 60);
  return (video.views + video.likes * 2 + video.commentCount * 3) / Math.pow(ageHours + 2, 1.8);
}

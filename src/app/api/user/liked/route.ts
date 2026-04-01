import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/models/User";
import { requireAuth, successResponse, handleApiError } from "@/lib/apiMiddleware";

export async function GET(req: NextRequest) {
  try {
    const { session, response } = await requireAuth();
    if (response) return response;

    await connectDB();
    const userId = (session!.user as any).id;

    const user = await UserModel.findById(userId)
      .populate({
        path: "likedVideos",
        select: "title thumbnail duration views likes slug category gameTitle trailerType createdAt",
        options: { limit: 100 },
      })
      .select("likedVideos");

    return successResponse(user?.likedVideos || []);
  } catch (err) {
    return handleApiError(err);
  }
}

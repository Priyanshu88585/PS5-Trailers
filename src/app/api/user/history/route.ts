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
        path: "watchHistory",
        select: "title thumbnail duration views likes slug category gameTitle trailerType createdAt",
        options: { sort: { updatedAt: -1 }, limit: 50 },
      })
      .select("watchHistory");

    return successResponse(user?.watchHistory || []);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { session, response } = await requireAuth();
    if (response) return response;

    await connectDB();
    const userId = (session!.user as any).id;

    await UserModel.findByIdAndUpdate(userId, { $set: { watchHistory: [] } });
    return successResponse(null, "Watch history cleared");
  } catch (err) {
    return handleApiError(err);
  }
}

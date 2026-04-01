import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/models/User";
import VideoModel from "@/models/Video";
import { requireAuth, successResponse, errorResponse, handleApiError } from "@/lib/apiMiddleware";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  image: z.string().url().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { session, response } = await requireAuth();
    if (response) return response;

    await connectDB();
    const userId = (session!.user as any).id;

    const user = await UserModel.findById(userId)
      .select("-password -__v")
      .lean();

    if (!user) return errorResponse("User not found", 404);
    return successResponse(user);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { session, response } = await requireAuth();
    if (response) return response;

    await connectDB();
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const userId = (session!.user as any).id;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { ...parsed.data },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!user) return errorResponse("User not found", 404);
    return successResponse(user, "Profile updated");
  } catch (err) {
    return handleApiError(err);
  }
}

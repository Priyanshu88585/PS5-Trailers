import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/models/User";
import { requireAuth, successResponse, errorResponse, handleApiError } from "@/lib/apiMiddleware";

export async function GET() {
  try {
    const { session, response } = await requireAuth();
    if (response) return response;

    await connectDB();
    const userId = (session!.user as any).id;

    const user = await UserModel.findById(userId).select("-password -__v").lean();
    if (!user) return errorResponse("User not found", 404);

    return successResponse(user);
  } catch (err) {
    return handleApiError(err);
  }
}

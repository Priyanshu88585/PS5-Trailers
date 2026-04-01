import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import VideoModel from "@/models/Video";
import { requireAdmin, successResponse, errorResponse, handleApiError } from "@/lib/apiMiddleware";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "newest";
    const status = searchParams.get("status") || "published";

    const query: Record<string, unknown> = { status };
    if (category && category !== "all") query.category = category;

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      "most-viewed": { views: -1 },
      "most-liked": { likes: -1 },
      trending: { trendingScore: -1 },
    };
    const sortQuery = sortOptions[sort] || sortOptions.newest;

    const [videos, total] = await Promise.all([
      VideoModel.find(query)
        .sort(sortQuery)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("uploadedBy", "name image")
        .lean(),
      VideoModel.countDocuments(query),
    ]);

    return successResponse(videos, undefined, 200);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    await connectDB();
    const body = await req.json();

    const video = await VideoModel.create({
      ...body,
      uploadedBy: (session!.user as any).id,
      status: body.status || "draft",
    });

    return successResponse(video, "Video created successfully", 201);
  } catch (err) {
    return handleApiError(err);
  }
}

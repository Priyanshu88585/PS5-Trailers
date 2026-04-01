import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import VideoModel from "@/models/Video";
import { successResponse, errorResponse, handleApiError } from "@/lib/apiMiddleware";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const q = req.nextUrl.searchParams.get("q")?.trim();
    const category = req.nextUrl.searchParams.get("category");
    const sort = req.nextUrl.searchParams.get("sort") || "relevance";
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");

    if (!q || q.length < 1) return errorResponse("Search query is required", 400);
    if (q.length < 2) return errorResponse("Search query must be at least 2 characters", 400);

    const query: Record<string, unknown> = {
      status: "published",
      $or: [
        { $text: { $search: q } },
        { title: { $regex: q, $options: "i" } },
        { gameTitle: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    };

    if (category && category !== "all") query.category = category;

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      relevance: { score: { $meta: "textScore" } as any, views: -1 },
      newest: { createdAt: -1 },
      "most-viewed": { views: -1 },
      "most-liked": { likes: -1 },
    };

    const [results, total] = await Promise.all([
      VideoModel.find(query, { score: { $meta: "textScore" } })
        .sort(sortMap[sort] || sortMap.relevance)
        .skip((page - 1) * limit)
        .limit(limit)
        .select("title thumbnail duration views likes slug category gameTitle trailerType createdAt")
        .lean(),
      VideoModel.countDocuments(query),
    ]);

    return successResponse(
      { results, total, query: q, page, totalPages: Math.ceil(total / limit) },
      undefined,
      200
    );
  } catch (err) {
    return handleApiError(err);
  }
}

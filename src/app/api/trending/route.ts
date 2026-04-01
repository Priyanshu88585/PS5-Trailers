import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import VideoModel from "@/models/Video";
import { successResponse, handleApiError } from "@/lib/apiMiddleware";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");

    // Recalculate trending scores and return top videos
    const videos = await VideoModel.find({ status: "published" })
      .sort({ trendingScore: -1, views: -1 })
      .limit(limit)
      .select("title thumbnail duration views likes slug category gameTitle trailerType trendingScore createdAt")
      .lean();

    // Batch update trending scores every hour
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const staleVideos = await VideoModel.find({
      status: "published",
      lastTrendingUpdate: { $lt: hourAgo },
    }).select("views likes commentCount createdAt");

    if (staleVideos.length > 0) {
      const bulkOps = staleVideos.map((v) => {
        const ageHours = (Date.now() - v.createdAt.getTime()) / (1000 * 60 * 60);
        const score = (v.views + v.likes * 2 + v.commentCount * 3) / Math.pow(ageHours + 2, 1.8);
        return {
          updateOne: {
            filter: { _id: v._id },
            update: { $set: { trendingScore: score, lastTrendingUpdate: new Date() } },
          },
        };
      });
      VideoModel.bulkWrite(bulkOps).catch(console.error);
    }

    return successResponse(videos);
  } catch (err) {
    return handleApiError(err);
  }
}

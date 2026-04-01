import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import VideoModel from "@/models/Video";
import UserModel from "@/models/User";
import CommentModel from "@/models/Comment";
import { requireAdmin, successResponse, handleApiError } from "@/lib/apiMiddleware";

export async function GET(req: NextRequest) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    await connectDB();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalVideos,
      totalUsers,
      totalComments,
      videoStats,
      topVideos,
      categoryBreakdown,
      recentVideos,
    ] = await Promise.all([
      VideoModel.countDocuments({ status: "published" }),
      UserModel.countDocuments({ isActive: true }),
      CommentModel.countDocuments({ isDeleted: false }),
      VideoModel.aggregate([
        { $match: { status: "published" } },
        {
          $group: {
            _id: null,
            totalViews: { $sum: "$views" },
            totalLikes: { $sum: "$likes" },
            avgDuration: { $avg: "$duration" },
          },
        },
      ]),
      VideoModel.find({ status: "published" })
        .sort({ views: -1 })
        .limit(5)
        .select("title thumbnail views likes commentCount slug gameTitle")
        .lean(),
      VideoModel.aggregate([
        { $match: { status: "published" } },
        { $group: { _id: "$category", count: { $sum: 1 }, totalViews: { $sum: "$views" } } },
        { $sort: { count: -1 } },
      ]),
      VideoModel.find({ status: "published" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title thumbnail views likes createdAt slug")
        .lean(),
    ]);

    const stats = videoStats[0] || { totalViews: 0, totalLikes: 0, avgDuration: 0 };

    return successResponse({
      totalVideos,
      totalUsers,
      totalComments,
      totalViews: stats.totalViews,
      totalLikes: stats.totalLikes,
      avgDuration: Math.round(stats.avgDuration),
      topVideos,
      categoryBreakdown: categoryBreakdown.map((c) => ({
        category: c._id,
        count: c.count,
        totalViews: c.totalViews,
      })),
      recentVideos,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

import type { Metadata } from "next";
import connectDB from "@/lib/db";
import VideoModel from "@/models/Video";
import AppLayout from "@/components/layout/AppLayout";
import VideoGrid from "@/components/video/VideoGrid";
import { Video } from "@/types";
import { Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "Trending PS5 Trailers",
  description: "The hottest PS5 game trailers right now.",
};

export const revalidate = 60;

async function getTrending() {
  try {
    await connectDB();
    return await VideoModel.find({ status: "published" })
      .sort({ trendingScore: -1, views: -1 })
      .limit(30)
      .lean();
  } catch {
    return [];
  }
}

export default async function TrendingPage() {
  const videos = await getTrending();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
            <Flame size={20} className="text-orange-400" fill="currentColor" />
          </div>
          <div>
            <h1 className="font-display font-black text-3xl text-white">Trending Now</h1>
            <p className="text-ps5-text-secondary text-sm mt-0.5">
              The hottest PS5 trailers — updated every hour
            </p>
          </div>
        </div>
        <VideoGrid videos={JSON.parse(JSON.stringify(videos)) as Video[]} />
      </div>
    </AppLayout>
  );
}

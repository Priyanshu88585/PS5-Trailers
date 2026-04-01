import type { Metadata } from "next";
import connectDB from "@/lib/db";
import VideoModel from "@/models/Video";
import AppLayout from "@/components/layout/AppLayout";
import VideoGrid from "@/components/video/VideoGrid";
import { Video } from "@/types";
import Link from "next/link";
import { CATEGORIES } from "@/utils/constants";

export const metadata: Metadata = {
  title: "Browse All PS5 Trailers",
  description: "Browse and discover all PS5 game trailers by category.",
};

export const revalidate = 120;

async function getBrowseData() {
  try {
    await connectDB();
    const videos = await VideoModel.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(40)
      .lean();
    return videos;
  } catch {
    return [];
  }
}

export default async function BrowsePage() {
  const videos = await getBrowseData();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">Browse Trailers</h1>
          <p className="text-ps5-text-secondary mt-2">Explore all PS5 game trailers</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/category/${cat.value}`}
              className="p-4 bg-ps5-surface border border-ps5-border hover:border-ps5-blue/50 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-card-hover group"
            >
              <h3 className="font-display font-bold text-white group-hover:text-ps5-blue transition-colors">{cat.label}</h3>
              <p className="text-ps5-text-muted text-xs mt-0.5 capitalize">{cat.value}</p>
            </Link>
          ))}
        </div>

        <h2 className="font-display font-bold text-xl text-white mb-5">Latest Trailers</h2>
        <VideoGrid videos={JSON.parse(JSON.stringify(videos)) as Video[]} />
      </div>
    </AppLayout>
  );
}

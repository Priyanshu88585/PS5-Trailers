import type { Metadata } from "next";
import connectDB from "@/lib/db";
import VideoModel from "@/models/Video";
import AppLayout from "@/components/layout/AppLayout";
import VideoGrid from "@/components/video/VideoGrid";
import { CATEGORIES, CATEGORY_COLORS } from "@/utils/constants";
import { Video } from "@/types";
import { notFound } from "next/navigation";

interface PageProps {
  params: { name: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cat = CATEGORIES.find((c) => c.value === params.name);
  return {
    title: cat ? `${cat.label} Trailers | PS5 Trailers` : "Category | PS5 Trailers",
    description: `Browse all ${cat?.label || params.name} PS5 game trailers`,
  };
}

export const revalidate = 120;

async function getCategoryVideos(category: string) {
  try {
    await connectDB();
    const videos = await VideoModel.find({ status: "published", category })
      .sort({ trendingScore: -1, createdAt: -1 })
      .limit(40)
      .lean();
    return videos;
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const cat = CATEGORIES.find((c) => c.value === params.name);
  if (!cat) notFound();

  const videos = await getCategoryVideos(params.name);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${CATEGORY_COLORS[params.name] || "bg-ps5-muted text-ps5-text-secondary border-ps5-border"}`}>
              {cat.label}
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
            {cat.label} Trailers
          </h1>
          <p className="text-ps5-text-secondary mt-2">
            {videos.length} trailer{videos.length !== 1 ? "s" : ""} in {cat.label}
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          {CATEGORIES.map((c) => (
            <a
              key={c.value}
              href={`/category/${c.value}`}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                c.value === params.name
                  ? "bg-ps5-blue border-ps5-blue text-white"
                  : "border-ps5-border text-ps5-text-secondary hover:border-ps5-blue/50 hover:text-white"
              }`}
            >
              {c.label}
            </a>
          ))}
        </div>

        <VideoGrid videos={JSON.parse(JSON.stringify(videos)) as Video[]} />
      </div>
    </AppLayout>
  );
}

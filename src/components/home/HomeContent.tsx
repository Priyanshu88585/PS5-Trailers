"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Sparkles, ChevronRight, Gamepad2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchVideos, fetchTrending } from "@/features/video/videoSlice";
import VideoCard from "@/components/video/VideoCard";
import { VideoGridSkeleton } from "@/components/ui/Skeleton";
import HeroSection from "./HeroSection";
import CategoryFilter from "./CategoryFilter";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Video } from "@/types";
import { CATEGORIES } from "@/utils/constants";

export default function HomeContent() {
  const dispatch = useAppDispatch();
  const { videos, trending, isLoading, pagination, filters } = useAppSelector((s) => s.video);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    dispatch(fetchTrending());
    dispatch(fetchVideos({ page: 1, limit: 20, sort: "newest" }));
  }, [dispatch]);

  const loadMore = useCallback(async () => {
    if (isFetchingMore || !pagination.hasMore) return;
    setIsFetchingMore(true);
    await dispatch(fetchVideos({ page: pagination.page + 1, limit: 20, category: activeCategory !== "all" ? activeCategory : undefined }));
    setIsFetchingMore(false);
  }, [dispatch, isFetchingMore, pagination, activeCategory]);

  const sentinelRef = useInfiniteScroll(loadMore, pagination.hasMore);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    dispatch(fetchVideos({
      page: 1,
      limit: 20,
      category: category !== "all" ? category : undefined,
    }));
  };

  const featuredVideo = trending[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {featuredVideo && <HeroSection video={featuredVideo} allTrending={trending.slice(0, 5)} />}

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        {/* Trending Row */}
        {trending.length > 1 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-ps5-gold" fill="currentColor" />
                <h2 className="font-display font-bold text-xl text-white">Trending Now</h2>
              </div>
              <Link href="/trending" className="flex items-center gap-1 text-ps5-blue text-sm hover:underline">
                See all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {trending.slice(1, 7).map((video, i) => (
                <div key={video._id} className="flex-shrink-0 w-64">
                  <VideoCard video={video} index={i} variant="default" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Video Grid Header */}
        <div className="flex items-center justify-between mb-5 mt-8">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-ps5-blue" />
            <h2 className="font-display font-bold text-xl text-white">
              {activeCategory === "all" ? "All Trailers" : CATEGORIES.find((c) => c.value === activeCategory)?.label || activeCategory}
            </h2>
            {pagination.total > 0 && (
              <span className="text-ps5-text-muted text-sm">({pagination.total})</span>
            )}
          </div>
          <select
            onChange={(e) => dispatch(fetchVideos({ page: 1, sort: e.target.value as any }))}
            className="bg-ps5-surface border border-ps5-border text-ps5-text-secondary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-ps5-blue/60 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="most-viewed">Most Viewed</option>
            <option value="most-liked">Most Liked</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        {/* Video Grid */}
        {isLoading && videos.length === 0 ? (
          <VideoGridSkeleton count={12} />
        ) : videos.length === 0 ? (
          <EmptyState category={activeCategory} />
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {videos.map((video, i) => (
                <VideoCard key={video._id} video={video} index={i} priority={i < 4} />
              ))}
            </div>

            {/* Infinite Scroll Sentinel */}
            {pagination.hasMore && (
              <div ref={sentinelRef} className="flex justify-center py-8">
                {isFetchingMore && (
                  <div className="flex items-center gap-3 text-ps5-text-muted">
                    <div className="w-5 h-5 border-2 border-ps5-blue/30 border-t-ps5-blue rounded-full animate-spin" />
                    <span className="text-sm">Loading more trailers...</span>
                  </div>
                )}
              </div>
            )}

            {!pagination.hasMore && videos.length > 0 && (
              <div className="text-center py-10 text-ps5-text-muted text-sm">
                You've seen all {pagination.total} trailers
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ category }: { category: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-20 h-20 bg-ps5-surface rounded-full flex items-center justify-center mb-6 border border-ps5-border">
        <Gamepad2 size={32} className="text-ps5-text-muted" />
      </div>
      <h3 className="text-white font-display font-bold text-xl mb-2">No trailers found</h3>
      <p className="text-ps5-text-muted max-w-sm">
        {category !== "all"
          ? `No trailers in the ${category} category yet. Check back soon!`
          : "No trailers uploaded yet. Check back soon!"}
      </p>
    </motion.div>
  );
}

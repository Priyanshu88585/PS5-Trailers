"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import VideoGrid from "@/components/video/VideoGrid";
import VideoCard from "@/components/video/VideoCard";
import { Video } from "@/types";
import { CATEGORIES } from "@/utils/constants";
import { cn } from "@/utils/cn";
import Link from "next/link";
import Image from "next/image";
import { Play, Eye } from "lucide-react";
import { formatViews, formatDuration } from "@/utils/format";

interface HomeClientProps {
  initialFeatured: Video[];
  initialTrending: Video[];
  initialRecent: Video[];
}

export default function HomeClient({ initialFeatured, initialTrending, initialRecent }: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [heroIndex, setHeroIndex] = useState(0);
  const [videos, setVideos] = useState(initialRecent);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const heroTimerRef = useRef<NodeJS.Timeout | null>(null);

  const featuredVideo = initialFeatured[heroIndex];

  // Auto-advance hero
  useEffect(() => {
    if (initialFeatured.length <= 1) return;
    heroTimerRef.current = setTimeout(() => {
      setHeroIndex((i) => (i + 1) % initialFeatured.length);
    }, 6000);
    return () => { if (heroTimerRef.current) clearTimeout(heroTimerRef.current); };
  }, [heroIndex, initialFeatured.length]);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const cat = activeCategory === "all" ? "" : `&category=${activeCategory}`;
    const res = await fetch(`/api/videos?page=${nextPage}&limit=20${cat}`);
    const data = await res.json();
    if (data.data?.length) {
      setVideos((prev) => [...prev, ...data.data]);
      setPage(nextPage);
    } else {
      setHasMore(false);
    }
    setIsLoadingMore(false);
  };

  const handleCategoryChange = async (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
    setHasMore(true);
    const catParam = cat === "all" ? "" : `&category=${cat}`;
    const res = await fetch(`/api/videos?page=1&limit=20${catParam}`);
    const data = await res.json();
    setVideos(data.data || []);
  };

  return (
    <div className="pb-12">
      {/* Hero Section */}
      {initialFeatured.length > 0 && featuredVideo && (
        <section className="relative mb-10">
          <div className="relative h-[45vw] min-h-[280px] max-h-[600px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image
                  src={featuredVideo.thumbnail}
                  alt={featuredVideo.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-ps5-void via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center px-6 sm:px-10 lg:px-16">
              <div className="max-w-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroIndex}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge-blue text-[11px]">FEATURED</span>
                      <span className="text-ps5-text-muted text-xs capitalize">{featuredVideo.category}</span>
                    </div>
                    <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-2 text-shadow">
                      {featuredVideo.title}
                    </h1>
                    <p className="text-ps5-text-secondary text-sm mb-5 line-clamp-2 max-w-md">
                      {featuredVideo.description}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link
                        href={`/video/${featuredVideo._id}`}
                        className="flex items-center gap-2.5 px-6 py-3 bg-ps5-blue hover:bg-ps5-blue-light text-white font-bold rounded-xl transition-all duration-200 shadow-ps5-blue hover:shadow-ps5-glow hover:-translate-y-0.5"
                      >
                        <Play size={18} fill="white" />
                        Watch Trailer
                      </Link>
                      <div className="flex items-center gap-3 text-ps5-text-secondary text-sm">
                        <span className="flex items-center gap-1.5">
                          <Eye size={14} />
                          {formatViews(featuredVideo.views)}
                        </span>
                        <span className="text-ps5-text-muted">·</span>
                        <span>{formatDuration(featuredVideo.duration)}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Hero Navigation */}
            {initialFeatured.length > 1 && (
              <>
                <button
                  onClick={() => setHeroIndex((i) => (i - 1 + initialFeatured.length) % initialFeatured.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-ps5-blue/70 backdrop-blur rounded-full flex items-center justify-center text-white transition-all duration-200 border border-white/10"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setHeroIndex((i) => (i + 1) % initialFeatured.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-ps5-blue/70 backdrop-blur rounded-full flex items-center justify-center text-white transition-all duration-200 border border-white/10"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Hero Dots */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {initialFeatured.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIndex(i)}
                      className={cn(
                        "rounded-full transition-all duration-300",
                        i === heroIndex ? "w-6 h-2 bg-ps5-blue" : "w-2 h-2 bg-white/40 hover:bg-white/70"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <div className="px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Trending Section */}
        {initialTrending.length > 0 && (
          <section>
            <SectionHeader icon={<Flame size={18} className="text-orange-400" fill="currentColor" />} title="Trending Now" href="/trending" />
            <div className="video-grid">
              {initialTrending.slice(0, 6).map((video, i) => (
                <VideoCard key={video._id} video={video as Video} index={i} priority={i < 3} />
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section>
          <SectionHeader icon={<Sparkles size={18} className="text-ps5-blue" />} title="Browse All" />
          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
            <CategoryPill label="All" value="all" active={activeCategory === "all"} onClick={handleCategoryChange} />
            {CATEGORIES.map((cat) => (
              <CategoryPill key={cat.value} label={cat.label} value={cat.value} active={activeCategory === cat.value} onClick={handleCategoryChange} />
            ))}
          </div>
          <VideoGrid videos={videos as Video[]} />

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="px-8 py-3 bg-ps5-surface hover:bg-ps5-elevated border border-ps5-border hover:border-ps5-blue/50 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-ps5-blue/40 border-t-ps5-blue rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : "Load More"}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, href }: { icon: React.ReactNode; title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        {icon}
        <h2 className="font-display font-bold text-xl text-white">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="text-ps5-blue text-sm font-semibold hover:underline flex items-center gap-1">
          See all <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

function CategoryPill({ label, value, active, onClick }: { label: string; value: string; active: boolean; onClick: (v: string) => void }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={cn(
        "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border",
        active
          ? "bg-ps5-blue border-ps5-blue text-white shadow-ps5-blue-sm"
          : "bg-transparent border-ps5-border text-ps5-text-secondary hover:border-ps5-blue/50 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

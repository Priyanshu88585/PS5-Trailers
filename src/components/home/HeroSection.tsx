"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Eye, Clock, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Video } from "@/types";
import { formatViews, formatDuration, formatRelativeTime } from "@/utils/format";
import { CATEGORY_COLORS } from "@/utils/constants";
import { cn } from "@/utils/cn";

interface HeroSectionProps {
  video: Video;
  allTrending: Video[];
}

export default function HeroSection({ video, allTrending }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeVideo = allTrending[activeIndex] || video;

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (allTrending.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % allTrending.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [allTrending.length]);

  return (
    <section className="relative w-full mb-8 overflow-hidden">
      {/* Background Image */}
      <div className="relative aspect-[21/9] min-h-[320px] max-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVideo._id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={activeVideo.thumbnail}
              alt={activeVideo.title}
              fill
              className="object-cover"
              priority
              quality={90}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-ps5-void via-ps5-void/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ps5-void via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-ps5-void/40 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="px-4 sm:px-6 lg:px-8 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVideo._id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {activeVideo.isTrending && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-ps5-gold/20 border border-ps5-gold/40 rounded-full text-ps5-gold text-xs font-bold">
                      <Zap size={11} fill="currentColor" />
                      TRENDING
                    </span>
                  )}
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold uppercase", CATEGORY_COLORS[activeVideo.category] || "bg-ps5-muted text-ps5-text-secondary")}>
                    {activeVideo.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight drop-shadow-2xl">
                  {activeVideo.title}
                </h1>

                {/* Game & meta */}
                <div className="flex items-center gap-4 text-ps5-text-secondary text-sm">
                  <span className="font-semibold text-white">{activeVideo.gameTitle}</span>
                  <span className="flex items-center gap-1"><Eye size={14} />{formatViews(activeVideo.views)} views</span>
                  <span className="flex items-center gap-1"><Clock size={14} />{formatDuration(activeVideo.duration)}</span>
                </div>

                {/* Description */}
                <p className="text-ps5-text-secondary text-sm leading-relaxed line-clamp-2 max-w-lg">
                  {activeVideo.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-3 pt-2">
                  <Link href={`/video/${activeVideo._id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2.5 px-6 py-3 bg-ps5-blue hover:bg-ps5-blue-light text-white font-bold rounded-xl shadow-ps5-blue transition-colors duration-200"
                    >
                      <Play size={18} fill="white" />
                      Watch Now
                    </motion.div>
                  </Link>
                  <span className="text-ps5-text-muted text-xs">{formatRelativeTime(activeVideo.createdAt)}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Arrows */}
        {allTrending.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i - 1 + allTrending.length) % allTrending.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all hidden sm:flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i + 1) % allTrending.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all hidden sm:flex"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dots */}
        {allTrending.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {allTrending.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === activeIndex ? "w-6 h-2 bg-ps5-blue" : "w-2 h-2 bg-white/30 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

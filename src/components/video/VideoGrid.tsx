"use client";

import { motion } from "framer-motion";
import VideoCard from "./VideoCard";
import { Video } from "@/types";
import { cn } from "@/utils/cn";

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  skeletonCount?: number;
  className?: string;
  variant?: "default" | "compact";
}

export default function VideoGrid({
  videos,
  isLoading = false,
  skeletonCount = 12,
  className,
  variant = "default",
}: VideoGridProps) {
  if (isLoading) {
    return (
      <div className={cn("video-grid", className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <VideoSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!videos.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-ps5-surface border border-ps5-border flex items-center justify-center mb-4">
          <span className="text-4xl">🎮</span>
        </div>
        <h3 className="font-display font-bold text-xl text-white mb-2">No videos found</h3>
        <p className="text-ps5-text-secondary text-sm max-w-xs">
          No trailers available in this category yet. Check back soon!
        </p>
      </motion.div>
    );
  }

  return (
    <div className={cn("video-grid", className)}>
      {videos.map((video, index) => (
        <VideoCard
          key={video._id}
          video={video}
          index={index}
          variant={variant}
          priority={index < 4}
        />
      ))}
    </div>
  );
}

export function VideoSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="skeleton aspect-video w-full" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="flex justify-between mt-2">
          <div className="skeleton h-3 w-1/4 rounded" />
          <div className="skeleton h-3 w-1/4 rounded" />
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Eye, Heart, Clock, Zap } from "lucide-react";
import { Video } from "@/types";
import { formatViews, formatDuration, formatRelativeTime } from "@/utils/format";
import { cn } from "@/utils/cn";
import { CATEGORY_COLORS, TRAILER_TYPE_LABELS } from "@/utils/constants";

interface VideoCardProps {
  video: Video;
  index?: number;
  variant?: "default" | "compact" | "featured" | "horizontal";
  priority?: boolean;
}

export default function VideoCard({
  video,
  index = 0,
  variant = "default",
  priority = false,
}: VideoCardProps) {
  if (variant === "horizontal") {
    return <HorizontalCard video={video} />;
  }

  if (variant === "featured") {
    return <FeaturedCard video={video} />;
  }

  if (variant === "compact") {
    return <CompactCard video={video} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/video/${video._id}`} className="group block">
        <div className="card-hover overflow-hidden rounded-xl">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-ps5-surface">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-ps5-blue/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-ps5-blue"
              >
                <Play size={22} className="text-white ml-0.5" fill="white" />
              </motion.div>
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded-md text-white text-xs font-mono font-medium">
              {formatDuration(video.duration)}
            </div>

            {/* Category Badge */}
            <div className="absolute top-2 left-2">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                  CATEGORY_COLORS[video.category] || "bg-ps5-muted text-ps5-text-secondary"
                )}
              >
                {video.category}
              </span>
            </div>

            {/* Trending Badge */}
            {video.isTrending && (
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-ps5-gold/20 border border-ps5-gold/40 rounded-md">
                <Zap size={10} className="text-ps5-gold" fill="currentColor" />
                <span className="text-ps5-gold text-[10px] font-bold">TRENDING</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-display font-bold text-sm text-white line-clamp-2 group-hover:text-ps5-blue transition-colors duration-200 leading-tight">
              {video.title}
            </h3>
            <p className="text-ps5-text-muted text-xs mt-1 font-medium">{video.gameTitle}</p>

            <div className="flex items-center justify-between mt-2.5">
              <div className="flex items-center gap-3 text-ps5-text-muted text-xs">
                <span className="flex items-center gap-1">
                  <Eye size={11} />
                  {formatViews(video.views)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={11} />
                  {formatViews(video.likes)}
                </span>
              </div>
              <span className="text-ps5-text-muted text-xs flex items-center gap-1">
                <Clock size={11} />
                {formatRelativeTime(video.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FeaturedCard({ video }: { video: Video }) {
  return (
    <Link href={`/video/${video._id}`} className="group block relative rounded-2xl overflow-hidden aspect-[21/9]">
      <Image
        src={video.thumbnail}
        alt={video.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 flex items-end p-8">
        <div className="max-w-lg">
          <span className="badge-blue mb-3 inline-flex">FEATURED</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-2 leading-tight">
            {video.title}
          </h2>
          <p className="text-ps5-text-secondary text-sm mb-4 line-clamp-2">{video.description}</p>
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-ps5-blue rounded-lg text-white font-bold shadow-ps5-blue"
            >
              <Play size={16} fill="white" />
              Watch Now
            </motion.div>
            <div className="flex items-center gap-3 text-ps5-text-secondary text-sm">
              <span className="flex items-center gap-1"><Eye size={14} />{formatViews(video.views)}</span>
              <span>{formatDuration(video.duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function HorizontalCard({ video }: { video: Video }) {
  return (
    <Link href={`/video/${video._id}`} className="group flex gap-3 p-2 rounded-xl hover:bg-ps5-surface transition-all duration-200">
      <div className="relative flex-shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-ps5-surface">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="160px"
        />
        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-white text-[10px] font-mono">
          {formatDuration(video.duration)}
        </div>
      </div>
      <div className="flex-1 min-w-0 py-1">
        <h4 className="font-semibold text-sm text-white line-clamp-2 group-hover:text-ps5-blue transition-colors duration-200 leading-tight">
          {video.title}
        </h4>
        <p className="text-ps5-text-muted text-xs mt-1">{video.gameTitle}</p>
        <div className="flex items-center gap-2 mt-2 text-ps5-text-muted text-xs">
          <span className="flex items-center gap-1"><Eye size={11} />{formatViews(video.views)}</span>
          <span>·</span>
          <span>{formatRelativeTime(video.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}

function CompactCard({ video }: { video: Video }) {
  return (
    <Link href={`/video/${video._id}`} className="group flex gap-3 hover:opacity-80 transition-opacity">
      <div className="relative flex-shrink-0 w-28 aspect-video rounded-lg overflow-hidden bg-ps5-surface">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover"
          sizes="112px"
        />
        <div className="absolute bottom-1 right-1 px-1 py-px bg-black/80 rounded text-white text-[10px] font-mono">
          {formatDuration(video.duration)}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-xs text-white line-clamp-2 leading-snug group-hover:text-ps5-blue transition-colors">
          {video.title}
        </h4>
        <p className="text-ps5-text-muted text-[11px] mt-0.5">{formatViews(video.views)} views</p>
      </div>
    </Link>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Heart, HeartOff, Download, Share2, Eye, Clock,
  Tag, Calendar, Monitor, Gamepad2, ChevronDown, ChevronUp,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoCard from "@/components/video/VideoCard";
import Comments from "@/components/comments/Comments";
import { Video } from "@/types";
import { formatViews, formatDuration, formatRelativeTime, formatDate } from "@/utils/format";
import { useAppDispatch } from "@/store";
import { updateVideoLikes } from "@/features/video/videoSlice";
import { cn } from "@/utils/cn";

interface VideoPageClientProps {
  video: Video;
  related: Video[];
}

export default function VideoPageClient({ video, related }: VideoPageClientProps) {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check like status
  useEffect(() => {
    if (!session) return;
    fetch(`/api/like?videoId=${video._id}`)
      .then((r) => r.json())
      .then((data) => { if (data.data) setLiked(data.data.liked); })
      .catch(() => {});
  }, [video._id, session]);

  const handleLike = async () => {
    if (!session) { toast.error("Sign in to like videos"); return; }
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video._id, type: "like" }),
      });
      const data = await res.json();
      if (data.success) {
        setLiked(data.data.liked);
        setLikeCount(data.data.likes);
        dispatch(updateVideoLikes({ id: video._id, likes: data.data.likes, liked: data.data.liked }));
        toast.success(data.data.liked ? "Added to liked videos!" : "Removed from liked videos");
      }
    } catch {
      toast.error("Failed to update like");
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  const descLong = (video.description?.length || 0) > 200;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 lg:gap-8">
        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Video Player */}
          <VideoPlayer
            src={video.videoUrl}
            hlsSrc={video.hlsUrl}
            poster={video.thumbnail}
            title={video.title}
            downloadUrl={video.downloadUrl}
            autoPlay={false}
          />

          {/* Video Title & Meta */}
          <div className="mt-4">
            <div className="flex flex-wrap items-start gap-2 mb-2">
              <span className={cn(
                "px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider",
                "bg-ps5-blue/20 text-ps5-blue border border-ps5-blue/30"
              )}>
                {video.category}
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-ps5-surface border border-ps5-border text-ps5-text-secondary capitalize">
                {video.trailerType}
              </span>
              {video.isTrending && (
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  🔥 TRENDING
                </span>
              )}
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight mb-3">
              {video.title}
            </h1>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 text-ps5-text-secondary text-sm mb-4">
              <span className="flex items-center gap-1.5">
                <Eye size={14} className="text-ps5-blue" />
                {formatViews(video.views)} views
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {formatDuration(video.duration)}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatRelativeTime(video.createdAt)}
              </span>
              {video.resolution && (
                <span className="flex items-center gap-1.5">
                  <Monitor size={14} />
                  {video.resolution}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pb-5 border-b border-ps5-border">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLike}
                disabled={isLiking}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border",
                  liked
                    ? "bg-ps5-danger/15 border-ps5-danger/40 text-ps5-danger hover:bg-ps5-danger/25"
                    : "bg-ps5-surface border-ps5-border text-ps5-text-secondary hover:border-ps5-blue/50 hover:text-white"
                )}
              >
                {liked ? <Heart size={16} fill="currentColor" /> : <Heart size={16} />}
                <span>{formatViews(likeCount)}</span>
                {liked ? "Liked" : "Like"}
              </motion.button>

              {video.downloadUrl && (
                <a
                  href={video.downloadUrl}
                  download
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-ps5-surface border border-ps5-border text-ps5-text-secondary hover:border-ps5-blue/50 hover:text-white transition-all duration-200"
                >
                  <Download size={16} />
                  Download
                </a>
              )}

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-ps5-surface border border-ps5-border text-ps5-text-secondary hover:border-ps5-blue/50 hover:text-white transition-all duration-200"
              >
                <Share2 size={16} />
                {copied ? "Copied!" : "Share"}
              </button>
            </div>

            {/* Game Info */}
            <div className="mt-5 p-4 bg-ps5-surface border border-ps5-border rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <Gamepad2 size={16} className="text-ps5-blue flex-shrink-0" />
                <div>
                  <p className="text-ps5-text-muted text-xs">Game Title</p>
                  <p className="text-white font-semibold text-sm">{video.gameTitle}</p>
                </div>
              </div>
              {video.developer && (
                <div className="flex items-center gap-2">
                  <span className="text-ps5-text-muted text-xs w-4" />
                  <div>
                    <p className="text-ps5-text-muted text-xs">Developer</p>
                    <p className="text-white text-sm">{video.developer}</p>
                  </div>
                </div>
              )}
              {video.platform?.length > 0 && (
                <div className="flex items-center gap-2">
                  <Monitor size={16} className="text-ps5-text-muted flex-shrink-0" />
                  <div>
                    <p className="text-ps5-text-muted text-xs">Platform</p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {video.platform.map((p) => (
                        <span key={p} className="px-2 py-0.5 bg-ps5-elevated border border-ps5-border rounded text-xs text-white">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-5">
              <div className={cn("text-ps5-text-secondary text-sm leading-relaxed", !showFullDesc && descLong && "line-clamp-3")}>
                {video.description}
              </div>
              {descLong && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="flex items-center gap-1 text-ps5-blue text-sm font-semibold mt-2 hover:underline"
                >
                  {showFullDesc ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show more</>}
                </button>
              )}
            </div>

            {/* Tags */}
            {video.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <Tag size={14} className="text-ps5-text-muted flex-shrink-0 mt-0.5" />
                {video.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full bg-ps5-surface border border-ps5-border text-ps5-text-secondary text-xs hover:border-ps5-blue/50 hover:text-ps5-blue transition-all duration-200"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Comments */}
            <Comments videoId={video._id} commentCount={video.commentCount || 0} />
          </div>
        </motion.div>

        {/* Sidebar - Related Videos */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-3"
        >
          <h3 className="font-display font-bold text-base text-white mb-4">Related Trailers</h3>
          {related.map((v) => (
            <VideoCard key={v._id} video={v} variant="horizontal" />
          ))}
          {related.length === 0 && (
            <p className="text-ps5-text-muted text-sm text-center py-8">No related trailers found</p>
          )}
        </motion.aside>
      </div>
    </div>
  );
}

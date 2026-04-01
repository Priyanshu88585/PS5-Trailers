"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { History, Heart, ListVideo, Settings, Edit2, Loader2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import VideoGrid from "@/components/video/VideoGrid";
import { formatDate } from "@/utils/format";
import { Video } from "@/types";

type Tab = "history" | "liked" | "playlists";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("history");
  const [watchHistory, setWatchHistory] = useState<Video[]>([]);
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    setIsLoading(true);
    Promise.all([
      fetch("/api/user/history").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/user/liked").then((r) => r.json()).catch(() => ({ data: [] })),
    ]).then(([history, liked]) => {
      setWatchHistory(history.data || []);
      setLikedVideos(liked.data || []);
    }).finally(() => setIsLoading(false));
  }, [session]);

  if (status === "loading") {
    return <AppLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-ps5-blue" /></div></AppLayout>;
  }

  if (!session) return null;

  const tabs = [
    { id: "history" as Tab, label: "Watch History", icon: History, count: watchHistory.length },
    { id: "liked" as Tab, label: "Liked Videos", icon: Heart, count: likedVideos.length },
    { id: "playlists" as Tab, label: "Playlists", icon: ListVideo, count: 0 },
  ];

  const currentVideos = activeTab === "history" ? watchHistory : activeTab === "liked" ? likedVideos : [];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-6 mb-10 pb-8 border-b border-ps5-border"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-ps5-surface border-2 border-ps5-border">
              {session.user?.image ? (
                <Image src={session.user.image} alt="" width={96} height={96} className="object-cover" />
              ) : (
                <div className="w-full h-full bg-ps5-blue flex items-center justify-center text-white text-3xl font-bold">
                  {session.user?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            {(session.user as any)?.role === "admin" && (
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-ps5-blue rounded-full text-white text-[10px] font-bold">
                ADMIN
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="font-display font-black text-2xl text-white">{session.user?.name}</h1>
            <p className="text-ps5-text-secondary text-sm mt-0.5">{session.user?.email}</p>
            <div className="flex items-center gap-4 mt-3 text-ps5-text-muted text-xs">
              <span>{watchHistory.length} watched</span>
              <span>·</span>
              <span>{likedVideos.length} liked</span>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-ps5-surface border border-ps5-border rounded-xl text-ps5-text-secondary hover:text-white hover:border-ps5-blue/50 transition-all text-sm font-semibold">
            <Edit2 size={14} />
            Edit Profile
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-ps5-surface p-1 rounded-xl border border-ps5-border w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-ps5-blue text-white shadow-ps5-blue-sm"
                  : "text-ps5-text-secondary hover:text-white"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-ps5-muted"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-ps5-blue" />
          </div>
        ) : activeTab === "playlists" ? (
          <div className="text-center py-16">
            <ListVideo size={48} className="text-ps5-text-muted mx-auto mb-4" />
            <p className="text-white font-semibold mb-2">No playlists yet</p>
            <p className="text-ps5-text-secondary text-sm">Create playlists to organize your favorite trailers</p>
          </div>
        ) : (
          <VideoGrid videos={currentVideos} isLoading={isLoading} />
        )}
      </div>
    </AppLayout>
  );
}

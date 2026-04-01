"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye, Heart, Video, Users, TrendingUp, BarChart2,
  Upload, Loader2, ArrowUpRight, Activity,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import Image from "next/image";
import { formatViews, formatDuration, formatRelativeTime } from "@/utils/format";

interface AnalyticsData {
  totalVideos: number;
  totalUsers: number;
  totalComments: number;
  totalViews: number;
  totalLikes: number;
  avgDuration: number;
  topVideos: any[];
  categoryBreakdown: { category: string; count: number; totalViews: number }[];
  recentVideos: any[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = (session?.user as any)?.role === "admin" || (session?.user as any)?.role === "superadmin";

  useEffect(() => {
    if (status === "authenticated" && !isAdmin) router.push("/");
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => setData(d.data))
      .finally(() => setIsLoading(false));
  }, [isAdmin]);

  if (status === "loading" || isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={36} className="animate-spin text-ps5-blue" />
        </div>
      </AppLayout>
    );
  }

  const stats = [
    { label: "Total Views", value: formatViews(data?.totalViews || 0), icon: Eye, color: "text-ps5-blue", bg: "bg-ps5-blue/10 border-ps5-blue/20" },
    { label: "Total Likes", value: formatViews(data?.totalLikes || 0), icon: Heart, color: "text-ps5-danger", bg: "bg-ps5-danger/10 border-ps5-danger/20" },
    { label: "Videos", value: data?.totalVideos || 0, icon: Video, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    { label: "Users", value: formatViews(data?.totalUsers || 0), icon: Users, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
    { label: "Comments", value: formatViews(data?.totalComments || 0), icon: Activity, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
    { label: "Avg Duration", value: formatDuration(data?.avgDuration || 0), icon: BarChart2, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-black text-3xl text-white">Admin Dashboard</h1>
            <p className="text-ps5-text-secondary mt-1">Platform analytics and management</p>
          </div>
          <Link
            href="/admin/upload"
            className="flex items-center gap-2 px-5 py-2.5 bg-ps5-blue hover:bg-ps5-blue-light text-white font-bold rounded-xl transition-all shadow-ps5-blue-sm"
          >
            <Upload size={16} />
            Upload Video
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`p-4 bg-ps5-surface border rounded-xl ${stat.bg}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon size={16} className={stat.color} />
                </div>
              </div>
              <p className={`font-display font-black text-2xl ${stat.color}`}>{stat.value}</p>
              <p className="text-ps5-text-muted text-xs mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Videos */}
          <div className="bg-ps5-surface border border-ps5-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-ps5-blue" /> Top Videos
              </h2>
              <Link href="/admin/videos" className="text-ps5-blue text-sm hover:underline flex items-center gap-1">
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="space-y-3">
              {data?.topVideos.map((v, i) => (
                <div key={v._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-ps5-elevated transition-colors">
                  <span className="text-ps5-text-muted font-mono text-sm w-5 text-center">{i + 1}</span>
                  <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-ps5-elevated flex-shrink-0">
                    {v.thumbnail && <Image src={v.thumbnail} alt="" fill className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/video/${v._id}`} className="text-white text-sm font-semibold line-clamp-1 hover:text-ps5-blue transition-colors">
                      {v.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-ps5-text-muted text-xs">
                      <span className="flex items-center gap-1"><Eye size={10} />{formatViews(v.views)}</span>
                      <span className="flex items-center gap-1"><Heart size={10} />{formatViews(v.likes)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-ps5-surface border border-ps5-border rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2 mb-5">
              <BarChart2 size={18} className="text-ps5-blue" /> Category Breakdown
            </h2>
            <div className="space-y-3">
              {data?.categoryBreakdown.slice(0, 8).map((cat) => {
                const maxViews = Math.max(...(data?.categoryBreakdown.map((c) => c.totalViews) || [1]));
                const pct = maxViews > 0 ? (cat.totalViews / maxViews) * 100 : 0;
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white capitalize font-medium">{cat.category}</span>
                      <div className="flex items-center gap-3 text-ps5-text-muted text-xs">
                        <span>{cat.count} videos</span>
                        <span>{formatViews(cat.totalViews)} views</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-ps5-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="h-full bg-ps5-blue rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Videos */}
        <div className="bg-ps5-surface border border-ps5-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-white">Recent Uploads</h2>
            <Link href="/admin/videos" className="text-ps5-blue text-sm hover:underline flex items-center gap-1">
              Manage all <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ps5-border">
                  {["Video", "Views", "Likes", "Status", "Uploaded"].map((h) => (
                    <th key={h} className="text-left pb-3 text-ps5-text-muted font-semibold text-xs uppercase tracking-wider pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ps5-border">
                {data?.recentVideos.map((v) => (
                  <tr key={v._id} className="hover:bg-ps5-elevated/50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 aspect-video rounded-lg overflow-hidden bg-ps5-elevated flex-shrink-0">
                          {v.thumbnail && <Image src={v.thumbnail} alt="" fill className="object-cover" />}
                        </div>
                        <Link href={`/video/${v._id}`} className="text-white hover:text-ps5-blue transition-colors line-clamp-1 font-medium max-w-[180px]">
                          {v.title}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-ps5-text-secondary">{formatViews(v.views)}</td>
                    <td className="py-3 pr-4 text-ps5-text-secondary">{formatViews(v.likes)}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        v.status === "published" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-ps5-text-muted">{formatRelativeTime(v.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

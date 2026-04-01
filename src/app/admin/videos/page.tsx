"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search, Edit2, Trash2, Eye, Heart, CheckCircle,
  XCircle, Star, Loader2, Filter, Upload, AlertTriangle,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import toast from "react-hot-toast";
import { formatViews, formatRelativeTime, formatDuration } from "@/utils/format";
import { CATEGORIES } from "@/utils/constants";
import { cn } from "@/utils/cn";

interface VideoRow {
  _id: string;
  title: string;
  thumbnail: string;
  gameTitle: string;
  category: string;
  status: "draft" | "published" | "archived";
  views: number;
  likes: number;
  duration: number;
  isFeatured: boolean;
  isTrending: boolean;
  createdAt: string;
}

export default function AdminVideosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const isAdmin =
    (session?.user as any)?.role === "admin" ||
    (session?.user as any)?.role === "superadmin";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && !isAdmin) router.push("/");
  }, [status, isAdmin, router]);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const catParam = categoryFilter !== "all" ? `&category=${categoryFilter}` : "";
      const statusParam = statusFilter !== "all" ? `&status=${statusFilter}` : "";
      const res = await fetch(
        `/api/videos?page=${page}&limit=${limit}${catParam}${statusParam}&adminView=true`
      );
      const data = await res.json();
      setVideos(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch {
      toast.error("Failed to load videos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchVideos();
  }, [isAdmin, page, categoryFilter, statusFilter]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setVideos((prev) => prev.filter((v) => v._id !== id));
      setDeleteId(null);
      toast.success("Video deleted successfully");
    } catch {
      toast.error("Failed to delete video");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setEditingStatus(id);
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      setVideos((prev) =>
        prev.map((v) => (v._id === id ? { ...v, status: newStatus as any } : v))
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setEditingStatus(null);
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !current }),
      });
      setVideos((prev) =>
        prev.map((v) => (v._id === id ? { ...v, isFeatured: !current } : v))
      );
      toast.success(!current ? "Added to featured" : "Removed from featured");
    } catch {
      toast.error("Failed to update");
    }
  };

  const filtered = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.gameTitle.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-black text-3xl text-white">Manage Videos</h1>
            <p className="text-ps5-text-secondary mt-1">{total} total videos</p>
          </div>
          <Link
            href="/admin/upload"
            className="flex items-center gap-2 px-5 py-2.5 bg-ps5-blue hover:bg-ps5-blue-light text-white font-bold rounded-xl transition-all shadow-ps5-blue-sm"
          >
            <Upload size={16} /> Upload New
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 p-4 bg-ps5-surface border border-ps5-border rounded-xl">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ps5-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos..."
              className="input pl-9 py-2 text-sm"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input py-2 text-sm w-auto"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input py-2 text-sm w-auto"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-ps5-surface border border-ps5-border rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={32} className="animate-spin text-ps5-blue" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ps5-text-muted">No videos found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-ps5-border">
                  <tr>
                    {["Video", "Category", "Status", "Views", "Likes", "Duration", "Uploaded", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3.5 text-ps5-text-muted font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ps5-border">
                  {filtered.map((video) => (
                    <motion.tr
                      key={video._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-ps5-elevated/40 transition-colors group"
                    >
                      {/* Video */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-[200px] max-w-[280px]">
                          <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-ps5-elevated flex-shrink-0">
                            {video.thumbnail && (
                              <Image src={video.thumbnail} alt="" fill className="object-cover" />
                            )}
                            {video.isFeatured && (
                              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-ps5-gold/90 rounded-full flex items-center justify-center">
                                <Star size={9} className="text-black" fill="black" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/video/${video._id}`}
                              className="text-white font-semibold line-clamp-2 hover:text-ps5-blue transition-colors text-xs leading-tight"
                            >
                              {video.title}
                            </Link>
                            <p className="text-ps5-text-muted text-[11px] mt-0.5 truncate">
                              {video.gameTitle}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-ps5-elevated border border-ps5-border text-ps5-text-secondary capitalize whitespace-nowrap">
                          {video.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <select
                          value={video.status}
                          onChange={(e) => handleStatusUpdate(video._id, e.target.value)}
                          disabled={editingStatus === video._id}
                          className={cn(
                            "text-xs font-semibold rounded-lg px-2 py-1 border cursor-pointer transition-all bg-transparent",
                            video.status === "published"
                              ? "text-green-400 border-green-500/30 bg-green-500/10"
                              : video.status === "draft"
                              ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                              : "text-ps5-text-muted border-ps5-border bg-ps5-muted"
                          )}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Views */}
                      <td className="px-4 py-3 text-ps5-text-secondary whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Eye size={11} className="text-ps5-blue" />
                          {formatViews(video.views)}
                        </span>
                      </td>

                      {/* Likes */}
                      <td className="px-4 py-3 text-ps5-text-secondary whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Heart size={11} className="text-ps5-danger" />
                          {formatViews(video.likes)}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-3 text-ps5-text-secondary font-mono text-xs whitespace-nowrap">
                        {formatDuration(video.duration)}
                      </td>

                      {/* Uploaded */}
                      <td className="px-4 py-3 text-ps5-text-muted text-xs whitespace-nowrap">
                        {formatRelativeTime(video.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Toggle Featured */}
                          <button
                            onClick={() => handleToggleFeatured(video._id, video.isFeatured)}
                            title={video.isFeatured ? "Remove from featured" : "Add to featured"}
                            className={cn(
                              "p-1.5 rounded-lg transition-all",
                              video.isFeatured
                                ? "text-ps5-gold bg-ps5-gold/10 hover:bg-ps5-gold/20"
                                : "text-ps5-text-muted hover:text-ps5-gold hover:bg-ps5-gold/10"
                            )}
                          >
                            <Star size={14} fill={video.isFeatured ? "currentColor" : "none"} />
                          </button>

                          {/* Edit */}
                          <Link
                            href={`/admin/videos/edit/${video._id}`}
                            className="p-1.5 rounded-lg text-ps5-text-muted hover:text-ps5-blue hover:bg-ps5-blue/10 transition-all"
                          >
                            <Edit2 size={14} />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteId(video._id)}
                            className="p-1.5 rounded-lg text-ps5-text-muted hover:text-ps5-danger hover:bg-ps5-danger/10 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-ps5-surface border border-ps5-border text-ps5-text-secondary hover:text-white hover:border-ps5-blue/50 disabled:opacity-40 transition-all text-sm"
            >
              Previous
            </button>
            <span className="text-ps5-text-muted text-sm px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-ps5-surface border border-ps5-border text-ps5-text-secondary hover:text-white hover:border-ps5-blue/50 disabled:opacity-40 transition-all text-sm"
            >
              Next
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-ps5-elevated border border-ps5-border rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-ps5-danger/10 rounded-full flex items-center justify-center">
                    <AlertTriangle size={24} className="text-ps5-danger" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">Delete Video</h3>
                    <p className="text-ps5-text-secondary text-sm">This action cannot be undone.</p>
                  </div>
                </div>
                <p className="text-ps5-text-secondary text-sm mb-6">
                  Are you sure you want to permanently delete this video and all its data?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(deleteId)}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-ps5-danger hover:bg-red-600 text-white font-bold rounded-xl transition-all"
                  >
                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-2.5 bg-ps5-surface border border-ps5-border text-ps5-text-secondary hover:text-white rounded-xl transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}

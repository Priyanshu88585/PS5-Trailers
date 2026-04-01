"use client";

import { useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Upload, Video, Image as ImageIcon, X, CheckCircle, AlertCircle,
  Loader2, Play, Tag, Info,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import toast from "react-hot-toast";
import { CATEGORIES, TRAILER_TYPES, PLATFORMS, RESOLUTIONS } from "@/utils/constants";
import { cn } from "@/utils/cn";

const uploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000),
  gameTitle: z.string().min(2, "Game title is required").max(200),
  category: z.string().min(1, "Category is required"),
  trailerType: z.string().min(1, "Trailer type is required"),
  developer: z.string().optional(),
  publisher: z.string().optional(),
  resolution: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  isFeatured: z.boolean().default(false),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export default function AdminUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["PS5"]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      status: "draft",
      isFeatured: false,
      resolution: "1080p",
      category: "",
      trailerType: "announcement",
    },
  });

  const isAdmin = (session?.user as any)?.role === "admin" || (session?.user as any)?.role === "superadmin";

  if (status === "loading") {
    return <AppLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-ps5-blue" /></div></AppLayout>;
  }

  if (!isAdmin) {
    return <AppLayout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-ps5-danger font-semibold">Admin access required.</p></div></AppLayout>;
  }

  const handleVideoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      toast.error("Please drop a valid video file");
    }
  }, []);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024 * 1024) { toast.error("File size exceeds 500MB"); return; }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!videoFile) { toast.error("Please select a video file"); return; }
    if (selectedPlatforms.length === 0) { toast.error("Select at least one platform"); return; }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("video", videoFile);
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

    const tags = data.tags?.split(",").map((t) => t.trim()).filter(Boolean) || [];
    formData.append("metadata", JSON.stringify({
      ...data,
      tags,
      platform: selectedPlatforms,
    }));

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + Math.random() * 12, 90));
      }, 500);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      clearInterval(progressInterval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const result = await res.json();
      setUploadProgress(100);
      setUploadDone(true);
      toast.success("Video uploaded successfully!");
      setTimeout(() => router.push(`/video/${result.data._id}`), 2000);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  if (uploadDone) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <CheckCircle size={80} className="text-ps5-success mb-4" />
          </motion.div>
          <h2 className="font-display font-black text-3xl text-white mb-2">Upload Complete!</h2>
          <p className="text-ps5-text-secondary mb-6">Your video has been uploaded successfully.</p>
          <div className="w-64 h-2 bg-ps5-surface rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-full bg-ps5-blue rounded-full"
            />
          </div>
          <p className="text-ps5-text-muted text-sm mt-2">Redirecting to video page...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-black text-3xl text-white">Upload Trailer</h1>
          <p className="text-ps5-text-secondary mt-1">Add a new PS5 game trailer to the platform</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Video Drop Zone */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer",
              dragOver ? "border-ps5-blue bg-ps5-blue/5" : "border-ps5-border hover:border-ps5-blue/50",
              videoFile && "border-ps5-success/50 bg-ps5-success/5"
            )}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleVideoDrop}
            onClick={() => !videoFile && videoInputRef.current?.click()}
          >
            <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />

            {videoFile ? (
              <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-ps5-success/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Video size={24} className="text-ps5-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{videoFile.name}</p>
                  <p className="text-ps5-text-muted text-sm">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setVideoFile(null); setVideoPreview(null); }}
                  className="p-2 hover:bg-ps5-muted rounded-lg text-ps5-text-muted hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-ps5-surface rounded-2xl flex items-center justify-center mb-4 border border-ps5-border">
                  <Upload size={28} className="text-ps5-blue" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-1">Drop your video here</h3>
                <p className="text-ps5-text-secondary text-sm mb-3">or click to browse</p>
                <p className="text-ps5-text-muted text-xs">MP4, MOV, AVI, WebM · Max 500MB · Recommended: 1080p or 4K</p>
              </div>
            )}
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="md:col-span-2">
              <FormField label="Video Title" required error={errors.title?.message}>
                <input {...register("title")} className="input" placeholder="e.g. God of War Ragnarök — Launch Trailer" />
              </FormField>
            </div>

            {/* Game Title */}
            <FormField label="Game Title" required error={errors.gameTitle?.message}>
              <input {...register("gameTitle")} className="input" placeholder="e.g. God of War Ragnarök" />
            </FormField>

            {/* Category */}
            <FormField label="Category" required error={errors.category?.message}>
              <select {...register("category")} className="input">
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </FormField>

            {/* Trailer Type */}
            <FormField label="Trailer Type" required error={errors.trailerType?.message}>
              <select {...register("trailerType")} className="input">
                {TRAILER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </FormField>

            {/* Resolution */}
            <FormField label="Resolution" error={errors.resolution?.message}>
              <select {...register("resolution")} className="input">
                {RESOLUTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>

            {/* Developer */}
            <FormField label="Developer" error={errors.developer?.message}>
              <input {...register("developer")} className="input" placeholder="e.g. Santa Monica Studio" />
            </FormField>

            {/* Publisher */}
            <FormField label="Publisher" error={errors.publisher?.message}>
              <input {...register("publisher")} className="input" placeholder="e.g. Sony Interactive Entertainment" />
            </FormField>

            {/* Description */}
            <div className="md:col-span-2">
              <FormField label="Description" required error={errors.description?.message}>
                <textarea {...register("description")} className="input min-h-[100px] resize-y" placeholder="Describe the game and trailer..." rows={4} />
              </FormField>
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <FormField label="Tags (comma-separated)" error={errors.tags?.message}>
                <div className="relative">
                  <Tag size={16} className="absolute left-3.5 top-3.5 text-ps5-text-muted" />
                  <input {...register("tags")} className="input pl-10" placeholder="action, rpg, exclusive, adventure" />
                </div>
              </FormField>
            </div>

            {/* Platforms */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-ps5-text-secondary mb-2">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-semibold border transition-all",
                      selectedPlatforms.includes(p)
                        ? "bg-ps5-blue border-ps5-blue text-white"
                        : "border-ps5-border text-ps5-text-secondary hover:border-ps5-blue/50"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-ps5-text-secondary mb-2">Custom Thumbnail <span className="text-ps5-text-muted font-normal">(optional, auto-generated if not provided)</span></label>
              <div className="flex gap-4 items-start">
                <button
                  type="button"
                  onClick={() => thumbInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-ps5-surface border border-ps5-border hover:border-ps5-blue/50 rounded-xl text-ps5-text-secondary hover:text-white text-sm font-semibold transition-all"
                >
                  <ImageIcon size={16} /> Choose Image
                </button>
                <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbSelect} />
                {thumbPreview && (
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-ps5-border">
                    <img src={thumbPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setThumbnailFile(null); setThumbPreview(null); }}
                      className="absolute top-1 right-1 p-1 bg-black/70 rounded-full text-white hover:bg-ps5-danger/80"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status & Featured */}
            <FormField label="Publish Status">
              <select {...register("status")} className="input">
                <option value="draft">Draft (not visible to users)</option>
                <option value="published">Published (live)</option>
              </select>
            </FormField>

            <div className="flex items-center gap-3 mt-6">
              <input type="checkbox" id="featured" {...register("isFeatured")} className="w-4 h-4 rounded accent-ps5-blue cursor-pointer" />
              <label htmlFor="featured" className="text-sm font-semibold text-ps5-text-secondary cursor-pointer select-none">
                Feature on homepage
              </label>
            </div>
          </div>

          {/* Upload Progress */}
          <AnimatePresence>
            {uploading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-ps5-surface border border-ps5-border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-semibold">Uploading to Cloudinary...</span>
                  <span className="text-ps5-blue text-sm font-mono">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-2 bg-ps5-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-ps5-blue rounded-full"
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-ps5-text-muted text-xs mt-2">This may take a few minutes for large files. Please keep this tab open.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <motion.button
              type="submit"
              disabled={uploading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 px-8 py-3.5 bg-ps5-blue hover:bg-ps5-blue-light text-white font-bold rounded-xl transition-all shadow-ps5-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <><Loader2 size={18} className="animate-spin" /> Uploading...</>
              ) : (
                <><Upload size={18} /> Upload Trailer</>
              )}
            </motion.button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3.5 bg-ps5-surface border border-ps5-border text-ps5-text-secondary hover:text-white rounded-xl transition-all font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

function FormField({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ps5-text-secondary mb-2">
        {label} {required && <span className="text-ps5-danger">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 mt-1 text-ps5-danger text-xs">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

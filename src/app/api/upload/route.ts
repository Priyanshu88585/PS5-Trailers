import { NextRequest } from "next/server";
import { requireAdmin, successResponse, errorResponse, handleApiError } from "@/lib/apiMiddleware";
import { uploadVideo, uploadImage, generateThumbnail } from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import VideoModel from "@/models/Video";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    await connectDB();
    const formData = await req.formData();

    const videoFile = formData.get("video") as File | null;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const metadata = JSON.parse((formData.get("metadata") as string) || "{}");

    if (!videoFile) return errorResponse("Video file is required", 400);

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024;
    if (videoFile.size > maxSize) {
      return errorResponse("Video file exceeds 500MB limit", 400);
    }

    // Validate file type
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
    if (!allowedTypes.includes(videoFile.type)) {
      return errorResponse("Invalid video format. Allowed: MP4, WebM, MOV, AVI", 400);
    }

    // Convert file to base64 for Cloudinary
    const videoBuffer = await videoFile.arrayBuffer();
    const videoBase64 = `data:${videoFile.type};base64,${Buffer.from(videoBuffer).toString("base64")}`;

    // Upload video to Cloudinary
    const videoResult = await uploadVideo(videoBase64, {
      folder: "ps5-trailers/videos",
    });

    let thumbnailUrl = videoResult.thumbnail_url || "";
    let thumbnailPublicId: string | undefined;

    // Upload custom thumbnail if provided, else auto-generate
    if (thumbnailFile) {
      const thumbBuffer = await thumbnailFile.arrayBuffer();
      const thumbBase64 = `data:${thumbnailFile.type};base64,${Buffer.from(thumbBuffer).toString("base64")}`;
      const thumbResult = await uploadImage(thumbBase64, { folder: "ps5-trailers/thumbnails" });
      thumbnailUrl = thumbResult.secure_url;
      thumbnailPublicId = thumbResult.public_id;
    } else if (videoResult.public_id) {
      thumbnailUrl = await generateThumbnail(videoResult.public_id);
    }

    const video = await VideoModel.create({
      title: metadata.title,
      description: metadata.description,
      gameTitle: metadata.gameTitle,
      category: metadata.category || "other",
      tags: metadata.tags || [],
      trailerType: metadata.trailerType || "announcement",
      platform: metadata.platform || ["PS5"],
      developer: metadata.developer,
      publisher: metadata.publisher,
      resolution: metadata.resolution || "1080p",
      videoUrl: videoResult.secure_url,
      hlsUrl: videoResult.secure_url.replace("/upload/", "/upload/sp_hd/").replace(".mp4", ".m3u8"),
      videoPublicId: videoResult.public_id,
      thumbnail: thumbnailUrl,
      thumbnailPublicId,
      duration: videoResult.duration || 0,
      fileSize: videoResult.bytes,
      status: metadata.status || "draft",
      uploadedBy: (session!.user as any).id,
    });

    return successResponse(video, "Video uploaded successfully", 201);
  } catch (err) {
    return handleApiError(err);
  }
}

// Presigned URL for direct client upload (large files)
export async function GET(req: NextRequest) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const { cloudinary } = await import("@/lib/cloudinary");
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "ps5-trailers/videos";
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder, resource_type: "video" },
      process.env.CLOUDINARY_API_SECRET!
    );

    return successResponse({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

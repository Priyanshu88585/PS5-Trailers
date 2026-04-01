import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  resource_type: string;
  format: string;
  duration?: number;
  width?: number;
  height?: number;
  bytes: number;
  thumbnail_url?: string;
}

export async function uploadVideo(
  file: string,
  options: { folder?: string; public_id?: string } = {}
): Promise<CloudinaryUploadResult> {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "video",
    folder: options.folder || "ps5-trailers/videos",
    public_id: options.public_id,
    eager: [
      { streaming_profile: "hd", format: "m3u8" },
      { width: 1280, height: 720, crop: "scale", format: "mp4" },
    ],
    eager_async: true,
    eager_notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/cloudinary`,
    chunk_size: 6000000, // 6MB chunks
    use_filename: true,
    unique_filename: true,
  });

  return result as CloudinaryUploadResult;
}

export async function uploadImage(
  file: string,
  options: { folder?: string; public_id?: string; transformation?: object[] } = {}
): Promise<CloudinaryUploadResult> {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "image",
    folder: options.folder || "ps5-trailers/thumbnails",
    public_id: options.public_id,
    transformation: options.transformation || [
      { width: 1280, height: 720, crop: "fill", gravity: "auto", quality: "auto:good" },
    ],
    use_filename: true,
    unique_filename: true,
  });

  return result as CloudinaryUploadResult;
}

export async function deleteAsset(
  publicId: string,
  resourceType: "image" | "video" = "image"
): Promise<{ result: string }> {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export async function generateThumbnail(videoPublicId: string): Promise<string> {
  return cloudinary.url(videoPublicId, {
    resource_type: "video",
    transformation: [
      { width: 1280, height: 720, crop: "fill", gravity: "auto" },
      { quality: "auto:good" },
      { format: "jpg" },
      { start_offset: "5" },
    ],
  });
}

export function getVideoStreamUrl(publicId: string, quality: "auto" | "hd" | "sd" = "auto"): string {
  const profile = quality === "hd" ? "hd" : quality === "sd" ? "sd" : "auto";
  return cloudinary.url(publicId, {
    resource_type: "video",
    streaming_profile: profile,
    format: "m3u8",
  });
}

export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  return cloudinary.url(publicId, {
    resource_type: "image",
    transformation: [
      { width, height, crop: "fill", gravity: "auto" },
      { quality: "auto:good" },
      { format: "auto" },
    ],
    secure: true,
  });
}

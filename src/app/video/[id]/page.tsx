import { Suspense } from "react";
import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";
import VideoWatchContent from "@/components/video/VideoWatchContent";
import { VideoPlayerSkeleton } from "@/components/ui/Skeleton";

interface Props { params: { id: string }; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/videos/${params.id}`, { cache: "no-store" });
    if (!res.ok) return { title: "Video Not Found" };
    const { data } = await res.json();
    const video = data?.video;
    if (!video) return { title: "Video Not Found" };
    return {
      title: `${video.title} | PS5 Trailers`,
      description: video.description?.slice(0, 160),
      openGraph: { title: video.title, images: [{ url: video.thumbnail }] },
    };
  } catch { return { title: "PS5 Trailers" }; }
}

export default function VideoPage({ params }: Props) {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-6"><VideoPlayerSkeleton /></div>}>
        <VideoWatchContent id={params.id} />
      </Suspense>
    </AppLayout>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";
import HomeContent from "@/components/home/HomeContent";
import { VideoGridSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "PS5 Trailers — Game Trailer Streaming Platform",
  description: "Watch the latest PS5 game trailers in stunning quality.",
};

export default function HomePage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-6"><VideoGridSkeleton count={12} /></div>}>
        <HomeContent />
      </Suspense>
    </AppLayout>
  );
}

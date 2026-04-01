"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ps5-void flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-ps5-danger/10 border border-ps5-danger/30 rounded-2xl flex items-center justify-center mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="font-display font-bold text-2xl text-white mb-2">Something went wrong</h2>
      <p className="text-ps5-text-secondary text-sm max-w-sm mb-8">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-ps5-blue hover:bg-ps5-blue-light text-white font-bold rounded-xl transition-all"
        >
          <RefreshCw size={16} /> Try Again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-ps5-surface border border-ps5-border text-ps5-text-secondary hover:text-white rounded-xl transition-all font-semibold"
        >
          <Home size={16} /> Home
        </Link>
      </div>
    </div>
  );
}

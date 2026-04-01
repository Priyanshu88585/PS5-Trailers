"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import VideoGrid from "@/components/video/VideoGrid";
import { Video } from "@/types";
import { CATEGORIES, SORT_OPTIONS } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<Video[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  const doSearch = useCallback(async (q: string, cat: string, s: string) => {
    if (!q.trim() || q.length < 2) { setResults([]); setTotal(0); return; }
    setIsLoading(true);
    try {
      const catParam = cat !== "all" ? `&category=${cat}` : "";
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&sort=${s}${catParam}`);
      const data = await res.json();
      setResults(data.data?.results || []);
      setTotal(data.data?.total || 0);
      router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false });
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    doSearch(debouncedQuery, category, sort);
  }, [debouncedQuery, category, sort, doSearch]);

  // Initial search from URL
  useEffect(() => {
    if (initialQ) doSearch(initialQ, "all", "relevance");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ps5-text-muted" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search PS5 game trailers..."
              className="w-full bg-ps5-surface border border-ps5-border focus:border-ps5-blue rounded-2xl pl-12 pr-12 py-4 text-white text-lg placeholder-ps5-text-muted focus:outline-none focus:ring-2 focus:ring-ps5-blue/20 transition-all duration-200"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setResults([]); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ps5-text-muted hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Results count + filters toggle */}
          <div className="flex items-center justify-between mt-4">
            {query && !isLoading && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-ps5-text-secondary text-sm">
                {total > 0 ? (
                  <span>Found <strong className="text-white">{total}</strong> results for "<span className="text-ps5-blue">{debouncedQuery}</span>"</span>
                ) : (
                  <span>No results for "<span className="text-ps5-blue">{debouncedQuery}</span>"</span>
                )}
              </motion.p>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all",
                showFilters ? "border-ps5-blue text-ps5-blue" : "border-ps5-border text-ps5-text-secondary hover:text-white"
              )}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-ps5-surface border border-ps5-border rounded-xl space-y-4"
          >
            <div>
              <p className="text-ps5-text-muted text-xs font-bold uppercase tracking-wider mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                <FilterChip label="All" active={category === "all"} onClick={() => setCategory("all")} />
                {CATEGORIES.map((c) => (
                  <FilterChip key={c.value} label={c.label} active={category === c.value} onClick={() => setCategory(c.value)} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-ps5-text-muted text-xs font-bold uppercase tracking-wider mb-2">Sort By</p>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((s) => (
                  <FilterChip key={s.value} label={s.label} active={sort === s.value} onClick={() => setSort(s.value)} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {!query ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-3xl bg-ps5-surface border border-ps5-border flex items-center justify-center mb-6">
              <Search size={36} className="text-ps5-text-muted" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white mb-2">Search PS5 Trailers</h2>
            <p className="text-ps5-text-secondary text-sm max-w-sm">
              Type a game name, category, or keyword to find trailers
            </p>
          </div>
        ) : (
          <VideoGrid videos={results} isLoading={isLoading} skeletonCount={8} />
        )}
      </div>
    </AppLayout>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
        active ? "bg-ps5-blue border-ps5-blue text-white" : "border-ps5-border text-ps5-text-secondary hover:border-ps5-blue/50 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

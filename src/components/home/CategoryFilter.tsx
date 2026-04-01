"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { CATEGORIES } from "@/utils/constants";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const allCategories = [{ value: "all", label: "All Trailers" }, ...CATEGORIES];

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={() => scroll("left")}
        className="flex-shrink-0 p-1.5 rounded-lg text-ps5-text-muted hover:text-white hover:bg-ps5-muted transition-all hidden sm:flex"
      >
        <ChevronLeft size={16} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
      >
        {allCategories.map((cat) => (
          <motion.button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border",
              activeCategory === cat.value
                ? "bg-ps5-blue text-white border-ps5-blue shadow-ps5-blue-sm"
                : "bg-ps5-surface text-ps5-text-secondary border-ps5-border hover:text-white hover:border-ps5-blue/40"
            )}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="flex-shrink-0 p-1.5 rounded-lg text-ps5-text-muted hover:text-white hover:bg-ps5-muted transition-all hidden sm:flex"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

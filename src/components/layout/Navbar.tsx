"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Menu, X, Bell, Upload, LogOut, User,
  Settings, History, Heart, ListVideo, Shield, ChevronDown,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleSidebar, toggleSearch } from "@/features/ui/uiSlice";
import { cn } from "@/utils/cn";
import { useDebounce } from "@/hooks/useDebounce";

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((s) => s.ui);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setShowSearch(false);
        setSearchQuery("");
      }
    },
    [searchQuery, router]
  );

  const isAdmin = (session?.user as any)?.role === "admin" || (session?.user as any)?.role === "superadmin";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300",
        scrolled
          ? "bg-ps5-void/95 backdrop-blur-xl border-b border-ps5-border shadow-2xl"
          : "bg-gradient-to-b from-ps5-void to-transparent"
      )}
    >
      <div className="flex items-center h-full px-4 gap-4">
        {/* Menu Toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg text-ps5-text-secondary hover:text-white hover:bg-ps5-muted transition-all duration-200 flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0 group"
          onClick={() => setShowUserMenu(false)}
        >
          <div className="relative w-8 h-8">
            <div className="w-8 h-8 bg-ps5-blue rounded-lg flex items-center justify-center shadow-ps5-blue-sm group-hover:shadow-ps5-blue transition-shadow duration-300">
              <span className="text-white font-display font-black text-sm tracking-tighter">P5</span>
            </div>
          </div>
          <span className="font-display font-bold text-lg tracking-tight hidden sm:block">
            <span className="text-white">PS5</span>
            <span className="text-ps5-blue ml-1">Trailers</span>
          </span>
        </Link>

        {/* Desktop Search */}
        <div className="flex-1 max-w-xl mx-auto hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ps5-text-muted group-focus-within:text-ps5-blue transition-colors duration-200"
              />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PS5 game trailers..."
                className="w-full bg-ps5-surface border border-ps5-border rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-ps5-text-muted focus:outline-none focus:border-ps5-blue/60 focus:ring-1 focus:ring-ps5-blue/30 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ps5-text-muted hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-lg text-ps5-text-secondary hover:text-white hover:bg-ps5-muted transition-all md:hidden"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {status === "authenticated" ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin/upload"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 bg-ps5-blue hover:bg-ps5-blue-light text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-ps5-blue-sm"
                >
                  <Upload size={15} />
                  <span>Upload</span>
                </Link>
              )}

              {/* User Menu */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-ps5-muted transition-all duration-200 group"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-ps5-border group-hover:ring-ps5-blue/50 transition-all duration-200">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-ps5-blue flex items-center justify-center text-white text-sm font-bold">
                        {session.user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "text-ps5-text-muted transition-transform duration-200 hidden sm:block",
                      showUserMenu && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-ps5-elevated border border-ps5-border rounded-xl shadow-2xl overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-ps5-border">
                        <p className="text-white font-semibold text-sm truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-ps5-text-muted text-xs truncate mt-0.5">
                          {session.user?.email}
                        </p>
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-ps5-blue/20 border border-ps5-blue/30 rounded-full text-ps5-blue text-[10px] font-semibold">
                            <Shield size={9} />
                            Admin
                          </span>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {[
                          { label: "Profile", icon: User, href: "/profile" },
                          { label: "Watch History", icon: History, href: "/profile/watch-history" },
                          { label: "Liked Videos", icon: Heart, href: "/profile/liked" },
                          { label: "My Playlists", icon: ListVideo, href: "/profile/playlists" },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-ps5-text-secondary hover:text-white hover:bg-ps5-muted transition-all duration-150"
                          >
                            <item.icon size={16} />
                            {item.label}
                          </Link>
                        ))}

                        {isAdmin && (
                          <>
                            <div className="my-1 border-t border-ps5-border" />
                            <Link
                              href="/admin"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-ps5-blue hover:bg-ps5-blue/10 transition-all duration-150"
                            >
                              <Shield size={16} />
                              Admin Panel
                            </Link>
                          </>
                        )}

                        <div className="my-1 border-t border-ps5-border" />
                        <button
                          onClick={() => { setShowUserMenu(false); signOut({ callbackUrl: "/" }); }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-ps5-danger hover:bg-ps5-danger/10 w-full transition-all duration-150"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-semibold text-ps5-text-secondary hover:text-white transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-ps5-blue hover:bg-ps5-blue-light text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-ps5-blue-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-ps5-void/95 backdrop-blur-xl border-b border-ps5-border p-3 md:hidden"
          >
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ps5-text-muted" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search trailers..."
                  className="w-full bg-ps5-surface border border-ps5-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-ps5-text-muted focus:outline-none focus:border-ps5-blue/60"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-ps5-blue hover:bg-ps5-blue-light text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

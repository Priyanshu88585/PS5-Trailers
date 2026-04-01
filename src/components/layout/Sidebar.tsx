"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Flame, Gamepad2, Search, History, Heart, ListVideo,
  Shield, BarChart2, Upload, Video, ChevronRight,
  Sword, Car, Wand2, Ghost, Target, Trophy, Map, Star, Puzzle, Cpu,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/store";
import { setSidebarOpen, toggleSidebarCollapsed } from "@/features/ui/uiSlice";
import { cn } from "@/utils/cn";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Trending", href: "/trending", icon: Flame },
  { label: "Browse", href: "/browse", icon: Gamepad2 },
  { label: "Search", href: "/search", icon: Search },
];

const categories = [
  { label: "Action", href: "/category/action", icon: Sword },
  { label: "Racing", href: "/category/racing", icon: Car },
  { label: "RPG", href: "/category/rpg", icon: Wand2 },
  { label: "Horror", href: "/category/horror", icon: Ghost },
  { label: "Shooter", href: "/category/shooter", icon: Target },
  { label: "Sports", href: "/category/sports", icon: Trophy },
  { label: "Open World", href: "/category/open-world", icon: Map },
  { label: "Exclusive", href: "/category/exclusive", icon: Star },
  { label: "Puzzle", href: "/category/puzzle", icon: Puzzle },
  { label: "Indie", href: "/category/indie", icon: Cpu },
];

const userItems = [
  { label: "Watch History", href: "/profile/watch-history", icon: History },
  { label: "Liked Videos", href: "/profile/liked", icon: Heart },
  { label: "My Playlists", href: "/profile/playlists", icon: ListVideo },
];

const adminItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: BarChart2 },
  { label: "Upload Video", href: "/admin/upload", icon: Upload },
  { label: "Manage Videos", href: "/admin/videos", icon: Video },
  { label: "Admin Panel", href: "/admin", icon: Shield },
];

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
}

function NavLink({ href, icon: Icon, label, collapsed, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
        isActive
          ? "bg-ps5-blue/15 text-ps5-blue border border-ps5-blue/20"
          : "text-ps5-text-secondary hover:text-white hover:bg-ps5-muted"
      )}
      title={collapsed ? label : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 bg-ps5-blue/10 rounded-xl border border-ps5-blue/20"
        />
      )}
      <Icon size={18} className={cn("flex-shrink-0 relative z-10", isActive && "text-ps5-blue")} />
      {!collapsed && (
        <span className="text-sm font-medium truncate relative z-10">{label}</span>
      )}
      {isActive && !collapsed && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-ps5-blue flex-shrink-0 relative z-10" />
      )}
    </Link>
  );
}

function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="h-px bg-ps5-border mx-2 my-2" />;
  return (
    <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-ps5-text-muted mt-2 mb-1">
      {label}
    </p>
  );
}

export default function Sidebar() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { sidebarOpen, sidebarCollapsed } = useAppSelector((s) => s.ui);
  const isAdmin =
    (session?.user as any)?.role === "admin" ||
    (session?.user as any)?.role === "superadmin";

  const close = () => dispatch(setSidebarOpen(false));

  const collapsed = sidebarCollapsed && !sidebarOpen;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 72 : 240,
          x: 0,
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed left-0 top-16 bottom-0 z-40 bg-ps5-void border-r border-ps5-border overflow-hidden",
          "flex flex-col",
          !sidebarOpen && "-translate-x-full md:translate-x-0",
          sidebarOpen && "translate-x-0"
        )}
        style={{ width: collapsed ? 72 : 240 }}
      >

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-2 pb-4 space-y-0.5">
          {/* Main Nav */}
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} collapsed={collapsed} onClick={close} />
          ))}

          {/* Categories */}
          <SectionLabel label="Categories" collapsed={collapsed} />
          {categories.map((item) => (
            <NavLink key={item.href} {...item} collapsed={collapsed} onClick={close} />
          ))}

          {/* User Section */}
          {session && (
            <>
              <SectionLabel label="Library" collapsed={collapsed} />
              {userItems.map((item) => (
                <NavLink key={item.href} {...item} collapsed={collapsed} onClick={close} />
              ))}
            </>
          )}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <SectionLabel label="Admin" collapsed={collapsed} />
              {adminItems.map((item) => (
                <NavLink key={item.href} {...item} collapsed={collapsed} onClick={close} />
              ))}
            </>
          )}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-ps5-border">
            <p className="text-ps5-text-muted text-[10px] text-center">
              © 2024 PS5 Trailers
            </p>
          </div>
        )}
      </motion.aside>
    </>
  );
}

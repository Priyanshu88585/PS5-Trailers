"use client";

import { useAppSelector } from "@/store";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { cn } from "@/utils/cn";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, sidebarOpen } = useAppSelector((s) => s.ui);
  const collapsed = sidebarCollapsed && !sidebarOpen;

  return (
    <div className="min-h-screen bg-ps5-void">
      <Navbar />
      <Sidebar />
      <main
        className={cn(
          "transition-all duration-250 pt-16",
          collapsed ? "md:pl-[72px]" : "md:pl-[240px]"
        )}
      >
        <div className="min-h-[calc(100vh-64px)]">{children}</div>
      </main>
    </div>
  );
}

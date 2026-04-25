"use client";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-sidebar",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

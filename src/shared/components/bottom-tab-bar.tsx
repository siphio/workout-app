"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const tabs = [
  { icon: Home, href: "/" },
  { icon: BarChart3, href: "/progress" },
  { icon: Settings, href: "/settings" },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-8"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)" }}
    >
      <div
        className="flex items-center justify-center gap-1 px-4 h-14 bg-zinc-900/80 border border-zinc-700/50 rounded-full shadow-lg shadow-black/30"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center justify-center w-11 h-11 transition-colors",
                isActive ? "text-emerald-500" : "text-zinc-500"
              )}
            >
              <tab.icon className="w-5 h-5" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

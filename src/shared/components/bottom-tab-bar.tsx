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
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 8px) + 8px)" }}
    >
      <div
        className="flex items-center justify-center gap-2 px-6 h-12 bg-zinc-900/70 border border-zinc-700/50 rounded-full shadow-lg shadow-black/20"
        style={{
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
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

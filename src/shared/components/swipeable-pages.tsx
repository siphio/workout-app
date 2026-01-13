"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";

interface Props {
  children: React.ReactNode[];
  initialPage?: number;
  onPageChange?: (index: number) => void;
  className?: string;
}

export function SwipeablePages({ children, initialPage = 0, onPageChange, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scroll to initial page on mount
    container.scrollTo({
      left: initialPage * container.offsetWidth,
      behavior: "instant",
    });
  }, [initialPage]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const pageWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;
    const newPage = Math.round(scrollLeft / pageWidth);

    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(
        "flex overflow-x-auto snap-x snap-mandatory scrollbar-hide",
        "scroll-smooth overscroll-x-contain",
        className
      )}
      style={{
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {children.map((child, index) => (
        <div
          key={index}
          className="min-w-full w-full h-full flex-shrink-0 snap-start snap-always overflow-y-auto"
        >
          {child}
        </div>
      ))}
    </div>
  );
}

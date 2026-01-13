"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
  title: string;
  backHref?: string;
  rightElement?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, backHref, rightElement, className }: Props) {
  return (
    <header
      className={cn("flex items-center justify-between px-6 pb-6", className)}
      style={{ paddingTop: "calc(env(safe-area-inset-top, 16px) + 16px)" }}
    >
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="w-11 h-11 flex items-center justify-center -ml-3 rounded-full active:bg-zinc-800"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
        )}
        <h1 className="text-2xl font-bold text-white uppercase tracking-wide">{title}</h1>
      </div>
      {rightElement && (
        <div className="flex items-center">
          {rightElement}
        </div>
      )}
    </header>
  );
}

import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
  title: string;
  backHref?: string;
  showSettings?: boolean;
  leftAligned?: boolean;
  className?: string;
}

export function PageHeader({ title, backHref, showSettings, leftAligned, className }: Props) {
  // Left-aligned layout (for pages like Progress)
  if (leftAligned) {
    return (
      <header
        className={cn("flex items-center justify-between px-6 pb-4", className)}
        style={{ paddingTop: "calc(env(safe-area-inset-top, 16px) + 56px)" }}
      >
        <h1 className="text-[32px] font-bold text-white tracking-tight">{title}</h1>
        {showSettings && (
          <Link href="/settings" className="w-11 h-11 flex items-center justify-center -mr-2">
            <Settings className="w-6 h-6 text-zinc-500" />
          </Link>
        )}
      </header>
    );
  }

  // Centered layout (default)
  return (
    <header
      className={cn("flex items-center justify-between px-6 pb-4", className)}
      style={{ paddingTop: "calc(env(safe-area-inset-top, 16px) + 16px)" }}
    >
      {backHref ? (
        <Link href={backHref} className="w-10 h-10 flex items-center justify-center -ml-2">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
      ) : (
        <div className="w-10" />
      )}
      <h1 className="text-lg font-semibold text-white uppercase">{title}</h1>
      {showSettings ? (
        <Link href="/settings" className="w-10 h-10 flex items-center justify-center -mr-2">
          <Settings className="w-6 h-6 text-zinc-400" />
        </Link>
      ) : (
        <div className="w-10" />
      )}
    </header>
  );
}

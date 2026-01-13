import { cn } from "@/shared/lib/utils";

export function VideoPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn("bg-zinc-800 rounded-2xl aspect-video flex items-center justify-center", className)}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-2 border-zinc-600 flex items-center justify-center mb-3 mx-auto">
          <div className="w-0 h-0 border-l-[12px] border-l-zinc-400 border-y-[8px] border-y-transparent ml-1" />
        </div>
        <p className="text-zinc-400 text-sm">Form Guide</p>
      </div>
    </div>
  );
}

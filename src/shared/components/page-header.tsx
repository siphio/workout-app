import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
  title: string;
  backHref?: string;
  showSettings?: boolean;
  className?: string;
}

export function PageHeader({ title, backHref, showSettings, className }: Props) {
  return (
    <header className={cn("flex items-center justify-between px-6 py-4", className)}>
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

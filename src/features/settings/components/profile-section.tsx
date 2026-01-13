import { Camera } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
  name?: string;
  email?: string;
  className?: string;
}

export function ProfileSection({ name = "Marley", email = "marley@email.com", className }: Props) {
  return (
    <div className={cn("", className)}>
      <h2 className="text-label font-medium text-emerald-500 uppercase tracking-wide mb-3">
        PROFILE
      </h2>
      <div className="bg-zinc-900 rounded-2xl p-5">
        <div className="flex justify-end mb-2">
          <button className="text-emerald-500 text-sm">Edit</button>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
            <Camera className="w-8 h-8 text-zinc-500" />
          </div>
          <p className="text-xl font-semibold text-white">{name}</p>
          <p className="text-zinc-400 text-sm">{email}</p>
        </div>
      </div>
    </div>
  );
}

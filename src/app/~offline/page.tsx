"use client";

import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
        <WifiOff className="w-10 h-10 text-zinc-500" />
      </div>

      <h1 className="text-2xl font-bold text-white mb-2">You&apos;re Offline</h1>

      <p className="text-zinc-400 text-center mb-8 max-w-xs">
        Check your connection and try again. Your workout data is saved locally.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="bg-white text-zinc-950 font-semibold py-3 px-8 rounded-xl hover:bg-zinc-100 transition-colors min-h-[44px]"
      >
        Try Again
      </button>
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/shared/lib/pwa/service-worker";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only register in production
    if (process.env.NODE_ENV === "production") {
      registerServiceWorker().then((result) => {
        if (result.success) {
          console.log("Service worker registered successfully");
        }
      });
    }
  }, []);

  return <>{children}</>;
}

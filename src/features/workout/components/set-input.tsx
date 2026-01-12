"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/shared/lib/utils";

interface Props {
  value: number | null;
  onChange: (value: number | null) => void;
  autoFocus?: boolean;
  className?: string;
}

export function SetInput({ value, onChange, autoFocus = false, className }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <input
      ref={ref}
      type="number"
      inputMode="decimal"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
      placeholder="—"
      className={cn(
        "bg-zinc-800 rounded-lg px-3 py-2 text-white text-center w-full",
        "border border-transparent focus:border-emerald-500 focus:outline-none",
        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        className
      )}
    />
  );
}

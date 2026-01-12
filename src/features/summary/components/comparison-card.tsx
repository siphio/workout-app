import Image from "next/image";
import type { WeightComparison } from "@/shared/types";
import { cn } from "@/shared/lib/utils";

interface Props {
  totalVolume: number;
  comparison: WeightComparison | null;
  weightUnit?: string;
  className?: string;
}

export function ComparisonCard({ totalVolume, comparison, weightUnit = "kg", className }: Props) {
  const imageSrc = comparison?.image_filename
    ? `/images/comparisons/${comparison.image_filename}`
    : "/images/comparisons/trex.png";

  return (
    <div className={cn("bg-zinc-900 rounded-2xl p-6", className)}>
      <div className="flex justify-center mb-4">
        <div className="w-48 h-48 relative">
          <Image
            src={imageSrc}
            alt={comparison?.comparison_name ?? "Weight comparison"}
            fill
            className="object-contain"
          />
        </div>
      </div>
      <p className="text-zinc-400 text-center mb-2">You lifted</p>
      <p className="text-stat font-bold text-white text-center mb-2">
        {totalVolume.toLocaleString()} {weightUnit}
      </p>
      {comparison && (
        <p className="text-emerald-500 text-center">
          That&apos;s equivalent to a {comparison.comparison_name}!
        </p>
      )}
    </div>
  );
}

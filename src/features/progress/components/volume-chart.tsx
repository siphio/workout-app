"use client";

import { useRouter } from "next/navigation";
import { Area, AreaChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";
import type { VolumeDataPoint } from "@/shared/types";
import { cn } from "@/shared/lib/utils";

type TimeRange = "1M" | "3M" | "1Y";

interface Props {
  data: VolumeDataPoint[];
  activeRange?: TimeRange;
  className?: string;
}

const chartConfig = {
  volume: {
    label: "Volume",
    color: "#10b981",
  },
} satisfies ChartConfig;

const timeRanges: TimeRange[] = ["1M", "3M", "1Y"];

export function VolumeChart({ data, activeRange = "3M", className }: Props) {
  const router = useRouter();

  const handleRangeChange = (range: TimeRange) => {
    router.push(`/progress?range=${range}`);
  };

  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          TOTAL VOLUME
        </h2>
        <div className="flex gap-1 bg-zinc-800/50 rounded-full p-0.5">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => handleRangeChange(range)}
              className={cn(
                "px-3 py-1 rounded-full text-sm transition-colors",
                activeRange === range
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-400"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-zinc-900 rounded-2xl p-4 pt-5 pb-3">
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-40 w-full">
            <AreaChart data={data} margin={{ top: 20, right: 12, left: 12, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickMargin={10}
                interval="preserveStartEnd"
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(v) => `${Number(v).toLocaleString()} kg`} />}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#volumeGradient)"
                dot={{
                  fill: "#10b981",
                  stroke: "#18181b",
                  strokeWidth: 2,
                  r: 5,
                }}
                activeDot={{
                  fill: "#10b981",
                  stroke: "#18181b",
                  strokeWidth: 2,
                  r: 6,
                }}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="h-40 flex items-center justify-center text-zinc-500">
            No workout data yet
          </div>
        )}
      </div>
    </div>
  );
}

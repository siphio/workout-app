"use client";

import { useState } from "react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";
import type { VolumeDataPoint } from "@/shared/types";
import { cn } from "@/shared/lib/utils";

interface Props {
  data: VolumeDataPoint[];
  className?: string;
}

const chartConfig = {
  volume: {
    label: "Volume",
    color: "#10b981",
  },
} satisfies ChartConfig;

const timeRanges = ["1M", "3M", "1Y"] as const;

export function VolumeChart({ data, className }: Props) {
  const [activeRange, setActiveRange] = useState<(typeof timeRanges)[number]>("3M");

  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide">
          TOTAL VOLUME
        </h2>
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={cn(
                "px-3 py-1 rounded-full text-sm transition-colors",
                activeRange === range
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-zinc-300"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-zinc-900 rounded-2xl p-4">
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                width={40}
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(v) => `${Number(v).toLocaleString()} kg`} />}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#volumeGradient)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="h-48 flex items-center justify-center text-zinc-500">
            No workout data yet
          </div>
        )}
      </div>
    </div>
  );
}

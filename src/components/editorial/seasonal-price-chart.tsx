"use client";

import { useAppPhase } from "@/context/app-phase-context";
import {
  formatSeasonalAxisTick,
  getSeasonalChartData,
  getSeasonalChartYDomain,
} from "@/lib/property-utils";
import { formatCurrency } from "@/lib/utils";
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function SeasonalTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: { season: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  const season = point.payload?.season ?? "";
  const rate = Number(point.value ?? 0);

  return (
    <div className="rounded-lg border border-neutral-100 bg-white px-3 py-2 shadow-lg">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
        {season}
      </p>
      <p className="mt-1 text-sm font-semibold text-neutral-900">
        {formatCurrency(rate)}
        <span className="font-normal text-neutral-400"> / night</span>
      </p>
    </div>
  );
}

export function SeasonalPriceChart() {
  const { selectedProperty } = useAppPhase();
  const data = getSeasonalChartData(selectedProperty);
  const rates = useMemo(() => data.map((point) => point.rate), [data]);
  const yDomain = useMemo(() => getSeasonalChartYDomain(rates), [rates]);
  const chartMax = yDomain[1];

  return (
    <section className="border-b border-neutral-100 py-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
        Seasonal Price Distribution
      </p>
      <p className="mt-2 text-xs text-neutral-500">
        Estimated nightly rates across travel seasons
      </p>

      <div className="mt-6 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="seasonalGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#171717" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#171717" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="transparent" vertical={false} />
            <XAxis
              dataKey="season"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(0,0,0,0.4)", fontSize: 10 }}
              interval={0}
              angle={-12}
              textAnchor="end"
              height={48}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={yDomain}
              tick={{ fill: "rgba(0,0,0,0.35)", fontSize: 10 }}
              tickFormatter={(value) => formatSeasonalAxisTick(Number(value), chartMax)}
              width={chartMax < 200 ? 40 : 44}
            />
            <Tooltip
              cursor={{
                stroke: "#171717",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              content={<SeasonalTooltip />}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#171717"
              strokeWidth={1.5}
              dot={{ r: 3.5, fill: "#171717", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#171717", stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

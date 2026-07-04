import { formatCurrency } from "@/lib/utils";

type GlassTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: { year: string } }>;
  label?: string;
};

export function GlassTooltip({ active, payload }: GlassTooltipProps) {
  if (!active || !payload?.length) return null;

  const point = payload[0];
  const year = point.payload?.year ?? "";
  const value = Number(point.value ?? 0);

  return (
    <div className="rounded-2xl border border-white/50 bg-white/40 px-4 py-3 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.2)] backdrop-blur-md">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/45">
        {year} Valuation
      </p>
      <p className="mt-1 text-lg font-medium text-black">{formatCurrency(value)}</p>
      <p className="mt-0.5 text-[11px] text-black/40">Monthly rent estimate</p>
    </div>
  );
}

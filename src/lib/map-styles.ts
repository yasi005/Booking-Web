import type { AmbientVibe } from "@/types/property";

/** Free MapLibre-compatible vector tile styles — no API token required. */
export const MAP_STYLES: Record<AmbientVibe | "default", string> = {
  default: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  golden: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  misty: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  midnight: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

export function getMapStyle(vibe: AmbientVibe) {
  return MAP_STYLES[vibe] ?? MAP_STYLES.default;
}

export type TourStep = 1 | 2 | 3 | 4;

export type AgentStatus = "idle" | "processing" | "complete";

export type AgentStep = {
  id: string;
  label: string;
  status: AgentStatus;
};

export const TOUR_COPY: Record<
  TourStep,
  { title: string; body: string }
> = {
  1: {
    title: "Context Sandbox",
    body: "Welcome to the Context Sandbox. Drop a raw technical reference link or design specification sheet here silently—no typing or talking required.",
  },
  2: {
    title: "Compute Telemetry",
    body: "Watch the telemetry stream. Clicking generate wakes up three independent background workers: Scraping, Semantic Filtering, and Omni-Channel Synthesis. Each step logs real-time network states.",
  },
  3: {
    title: "Omni-Channel Suite",
    body: "The layout states are bound. The system automatically populates distinct, platform-optimized copywriting drafts into isolated, interactive rich-text editor blocks simultaneously.",
  },
  4: {
    title: "Live Calibration",
    body: "Full user control remains intact. Modify text lines directly to track live safety character counters, or trigger an internal refinement rotation to swap content matrices instantly.",
  },
};

export const DEMO_URL = "engineering.blog/decoupling-latency";

export const MOCK_X_DRAFT =
  "Decoupling latency from throughput isn't a refactor—it's an architecture decision. Here's how we cut p99 by 40% without touching the hot path. 🧵";

export const MOCK_LINKEDIN_DRAFT =
  "Most teams treat latency as a tuning problem. The better frame: latency is a coupling problem. When your read path inherits write-path contention, every optimization is cosmetic.";

export const MOCK_INSTAGRAM_DRAFT =
  "Latency isn't a metric. It's a design constraint. Swipe for the 3-layer decoupling stack we used to drop p99 40% ↓";

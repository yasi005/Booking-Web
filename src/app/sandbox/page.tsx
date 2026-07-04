import { SandboxDashboard } from "@/components/kinetic/sandbox-dashboard";
import Link from "next/link";

export default function SandboxPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="fixed top-4 right-4 z-[60]">
        <Link
          href="/"
          className="rounded-full border border-[#2a2a2a] bg-[#111]/90 px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-neutral-400 uppercase backdrop-blur-md transition hover:border-amber-500/30 hover:text-amber-400"
        >
          ← Estate Hub
        </Link>
      </div>
      <SandboxDashboard />
    </div>
  );
}

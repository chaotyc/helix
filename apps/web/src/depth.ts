import type { Depth } from "@helix/contracts";

// Tailwind classes for each depth, 0 (not yet) to 5 (expert). On the dark background,
// a brighter chip means a deeper hold on the concept. Tailwind only includes classes it
// finds written out in full in the source, so each one is spelled out here.
const DEPTH_CLASSES = [
  "bg-zinc-800 text-zinc-400",
  "bg-sky-950 text-sky-200",
  "bg-sky-900 text-sky-100",
  "bg-sky-700 text-white",
  "bg-sky-500 text-zinc-950",
  "bg-sky-300 text-zinc-950",
];

export function depthClasses(depth: Depth): string {
  return DEPTH_CLASSES[depth] ?? DEPTH_CLASSES[0];
}

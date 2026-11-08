import type { Depth } from "@helix/contracts";
import { depthClasses } from "../depth.ts";

type Props = { conceptName: string; depth: Depth; prompt: string };

export function QuestionCard({ conceptName, depth, prompt }: Props) {
  return (
    <div className="max-w-2xl rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
        <span className="font-medium">Question</span>
        <span>·</span>
        <span>{conceptName}</span>
        <span className={`rounded px-1.5 py-0.5 font-mono ${depthClasses(depth)}`}>
          depth {depth}
        </span>
      </div>
      <div className="text-sm text-zinc-100">{prompt}</div>
    </div>
  );
}

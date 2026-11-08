import type { MapConcept } from "../fixtures.ts";
import { depthClasses } from "../depth.ts";

type Props = { concepts: MapConcept[] };

// Placeholder for the concept map: a plain list, colored by depth. Step 9 draws the real graph.
export function MapPanel({ concepts }: Props) {
  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-1 text-sm font-semibold text-zinc-200">Concept map</div>
      <div className="mb-4 text-xs text-zinc-500">Depth 0 = not yet · 5 = expert</div>

      {concepts.length === 0 && <div className="text-xs text-zinc-600">No concepts yet</div>}

      <ul className="flex flex-col gap-1.5">
        {concepts.map(({ concept, depth }) => (
          <li key={concept.id} className="flex items-center gap-2 text-sm text-zinc-300">
            <span className={`w-6 rounded text-center font-mono text-xs leading-5 ${depthClasses(depth)}`}>
              {depth}
            </span>
            {concept.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}

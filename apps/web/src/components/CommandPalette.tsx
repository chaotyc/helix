import { useState, type KeyboardEvent } from "react";

export type Command = { id: string; label: string; run: () => void };

type Props = { commands: Command[]; onClose: () => void };

// The Cmd+K popup. Type to filter, ↑/↓ to move, Enter to run, Esc to close.
// App only draws this while the palette is open, so its state starts fresh each time.
export function CommandPalette({ commands, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const matches = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  function runCommand(command: Command | undefined): void {
    if (!command) return; // guard: nothing matches the query
    onClose();
    command.run();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Escape") {
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, matches.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      runCommand(matches[activeIndex]);
    }
  }

  return (
    // The dark backdrop. Clicking it (outside the box) closes the palette.
    <div className="fixed inset-0 z-10 flex items-start justify-center bg-black/50 pt-32" onClick={onClose}>
      <div
        className="w-full max-w-md overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()} // clicks inside the box don't reach the backdrop
      >
        <input
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0); // the list changed, so start again from the top
          }}
          onKeyDown={onKeyDown}
          placeholder="Type a command…"
          className="w-full border-b border-zinc-800 bg-transparent px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
        />
        <ul className="max-h-72 overflow-y-auto py-1">
          {matches.map((command, index) => (
            <li key={command.id}>
              <button
                onClick={() => runCommand(command)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-full px-4 py-2 text-left text-sm ${
                  index === activeIndex ? "bg-zinc-800 text-zinc-100" : "text-zinc-400"
                }`}
              >
                {command.label}
              </button>
            </li>
          ))}
          {matches.length === 0 && <li className="px-4 py-2 text-sm text-zinc-500">No matching commands</li>}
        </ul>
      </div>
    </div>
  );
}

import { useAppStore } from "../store.ts";

// Bottom of the sidebar: is the server reachable, and what did the last ping return?
export function ConnectionIndicator() {
  // Each selector picks one piece of the store. This component redraws only when those pieces change.
  const status = useAppStore((state) => state.status);
  const lastPong = useAppStore((state) => state.lastPong);

  const connected = status === "connected";
  const label = { connecting: "Connecting…", connected: "Connected", reconnecting: "Reconnecting…" }[status];

  return (
    <div className="border-t border-zinc-800 px-4 py-3 text-xs">
      <div className="flex items-center gap-2 text-zinc-400">
        <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-400" : "bg-amber-400"}`} />
        {label}
      </div>
      {lastPong && (
        <div className="mt-1 truncate text-zinc-500">
          pong: {lastPong.text} · {new Date(lastPong.receivedAt).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

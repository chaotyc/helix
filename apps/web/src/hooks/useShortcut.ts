import { useEffect } from "react";

// Run `handler` whenever Cmd + `key` is pressed anywhere on the page.
// Example: useShortcut("k", openPalette) runs openPalette on Cmd+K.
export function useShortcut(key: string, handler: () => void): void {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (!event.metaKey) return; // Cmd not held: not our shortcut
      if (event.key.toLowerCase() !== key) return;
      event.preventDefault(); // stop the browser's own Cmd+key action
      handler();
    }

    window.addEventListener("keydown", onKeyDown);
    // React runs this cleanup before re-subscribing or when the component goes away,
    // so we never end up with two listeners for the same shortcut.
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, handler]);
}

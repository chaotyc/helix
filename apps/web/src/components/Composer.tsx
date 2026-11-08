import { useState, type KeyboardEvent } from "react";

type Props = { disabled: boolean; onSend: (text: string) => void };

export function Composer({ disabled, onSend }: Props) {
  // What's typed in the box right now. Lives here, not in App, because nobody else needs it.
  const [text, setText] = useState("");

  function send(): void {
    const trimmed = text.trim();
    if (trimmed === "") return; // guard: don't send an empty answer
    onSend(trimmed);
    setText("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.metaKey && event.key === "Enter") {
      event.preventDefault();
      send();
    }
  }

  return (
    <div className="border-t border-zinc-800 p-4">
      <div className="flex items-end gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-2 focus-within:border-zinc-600">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          rows={3}
          placeholder={disabled ? "Pick a session to start" : "Your answer… (⌘↵ to send)"}
          className="flex-1 resize-none bg-transparent px-2 py-1 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
        />
        <button
          onClick={send}
          disabled={disabled || text.trim() === ""}
          className="rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-900 disabled:opacity-30"
        >
          Send
        </button>
      </div>
    </div>
  );
}

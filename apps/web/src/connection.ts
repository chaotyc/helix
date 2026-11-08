// The UI's one WebSocket to the Helix server: connect, check incoming messages, reconnect.
import { ServerMsg, type ClientMsg } from "@helix/contracts";
import { useAppStore } from "./store.ts";

// Reconnect delays: 0.5s, 1s, 2s, 4s, 8s, then 10s from then on.
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 10_000;

let socket: WebSocket | null = null;
let failedAttempts = 0; // reset to 0 every time a connection succeeds

// The server's address, built from wherever this page was loaded (e.g. localhost:5173).
// During development, Vite's proxy forwards /ws to the server on 127.0.0.1:8765.
function serverUrl(): string {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${location.host}/ws`;
}

// Handle one message from the server. Same guard chain as the server uses, in reverse.
function handleMessage(raw: string): void {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    console.warn("Server sent something that isn't JSON:", raw);
    return;
  }

  const result = ServerMsg.safeParse(data);
  if (!result.success) {
    console.warn("Server sent a message that doesn't match the contract:", result.error.issues);
    return;
  }

  const msg = result.data;
  switch (msg.type) {
    case "pong":
      useAppStore.getState().setLastPong({ text: msg.text, receivedAt: msg.receivedAt });
      return;
    case "error":
      console.warn("Server error:", msg.message);
      return;
  }
}

// Wait a little longer after each failure, then try again.
function scheduleReconnect(): void {
  const delay = Math.min(BASE_DELAY_MS * 2 ** failedAttempts, MAX_DELAY_MS);
  failedAttempts += 1;
  console.info(`Reconnecting in ${delay} ms`);
  setTimeout(connect, delay);
}

// Open the connection and attach the callbacks the browser calls later, when things happen.
export function connect(): void {
  socket = new WebSocket(serverUrl());

  socket.onopen = () => {
    failedAttempts = 0;
    useAppStore.getState().setStatus("connected");
  };

  socket.onmessage = (event) => {
    handleMessage(String(event.data));
  };

  // Fires when the connection drops, and also when an attempt to connect fails.
  socket.onclose = () => {
    useAppStore.getState().setStatus("reconnecting");
    scheduleReconnect();
  };
}

// Send a message to the server. Returns false (and sends nothing) if we're not connected.
export function send(msg: ClientMsg): boolean {
  if (!socket || socket.readyState !== WebSocket.OPEN) return false;
  socket.send(JSON.stringify(msg));
  return true;
}

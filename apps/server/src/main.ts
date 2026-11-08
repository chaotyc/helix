import { WebSocketServer, type WebSocket } from "ws";
import { z } from "zod";
import { ClientMsg, type ServerMsg } from "@helix/contracts";

const HOST = "127.0.0.1"; // localhost only: other machines can't connect
const PORT = 8765;

// The only way the server talks to a client. Because `msg` must be a ServerMsg,
// TypeScript rejects any reply that doesn't match the contract.
function send(socket: WebSocket, msg: ServerMsg): void {
  socket.send(JSON.stringify(msg));
}

// Handle one incoming message. Each guard clause rejects a bad case and returns,
// so only valid data reaches the bottom.
function handleMessage(socket: WebSocket, raw: string): void {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    send(socket, { type: "error", message: "Message is not valid JSON." });
    return;
  }

  const result = ClientMsg.safeParse(data);
  if (!result.success) {
    send(socket, { type: "error", message: z.prettifyError(result.error) });
    return;
  }

  const msg = result.data;
  if (msg.type === "ping") {
    send(socket, { type: "pong", text: msg.text, receivedAt: new Date().toISOString() });
  }
}

const server = new WebSocketServer({ host: HOST, port: PORT });

server.on("listening", () => {
  console.log(`Helix server listening on ws://${HOST}:${PORT}`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Is the server already running in another tab?`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});

server.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("message", (data) => handleMessage(socket, data.toString()));
  socket.on("close", () => console.log("Client disconnected"));
});

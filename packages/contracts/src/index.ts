import { z } from "zod";

// How deep a learner holds a concept: 0 = not at all, 1 = orient ... 5 = expert.
export const Depth = z.number().int().min(0).max(5);

export const Concept = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  kind: z.enum(["concept", "skill", "decision"]),
  sourceRef: z.string().optional(),
});
export type Concept = z.infer<typeof Concept>;

export const Edge = z.object({
  src: z.string(),
  dst: z.string(),
  type: z.enum(["prereq", "part_of"]),
});
export type Edge = z.infer<typeof Edge>;

// Messages over websocket

// Client (UI) to server
export const ClientMsg = z.discriminatedUnion("type", [
  z.object({ type: z.literal("ping"), text: z.string() }),
]);
export type ClientMsg = z.infer<typeof ClientMsg>;

// Server to client (UI)
export const ServerMsg = z.discriminatedUnion("type", [
  z.object({ type: z.literal("pong"), text: z.string(), receivedAt: z.string() }),
  z.object({ type: z.literal("error"), message: z.string() }),
]);
export type ServerMsg = z.infer<typeof ServerMsg>;
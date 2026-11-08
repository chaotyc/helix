import { z } from "zod";

// How deep a learner holds a concept: 0 = not at all, 1 = orient ... 5 = expert.
export const Depth = z.number().int().min(0).max(5);
export type Depth = z.infer<typeof Depth>;

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

// What the learner is working toward. Only courses for now; jobs and projects come later.
export const Goal = z.object({
  id: z.string(),
  title: z.string().min(1),
  kind: z.enum(["course"]),
  capstone: z.string(), // "what would prove you've got it?"
  createdAt: z.string(), // ISO timestamp, e.g. "2026-11-08T21:46:01.065Z"
});
export type Goal = z.infer<typeof Goal>;

// One sitting of study for a goal.
export const Session = z.object({
  id: z.string(),
  goalId: z.string(),
  startedAt: z.string(),
  endedAt: z.string().optional(), // missing while the session is still going
});
export type Session = z.infer<typeof Session>;

// One entry in a session's timeline. The `type` field says which kind it is.
export const TimelineItem = z.discriminatedUnion("type", [
  z.object({ type: z.literal("tutor"), id: z.string(), text: z.string() }),
  z.object({
    type: z.literal("question"),
    id: z.string(),
    conceptId: z.string(),
    depth: Depth,
    prompt: z.string(),
  }),
  z.object({
    type: z.literal("answer"),
    id: z.string(),
    text: z.string(),
    confidence: z.number().int().min(1).max(5).optional(),
  }),
]);
export type TimelineItem = z.infer<typeof TimelineItem>;

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
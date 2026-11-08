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
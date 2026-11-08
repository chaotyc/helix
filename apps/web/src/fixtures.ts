// Fake data for the UI shell (Step 5). Step 7 replaces this with real data from the server.
// Every value is typed with a contract type, so if the contracts change, typecheck flags this file.
import type { Concept, Depth, Goal, Session, TimelineItem } from "@helix/contracts";

// A concept on the map together with how deeply the learner holds it.
export type MapConcept = { concept: Concept; depth: Depth };

export const goals: Goal[] = [
  {
    id: "goal-signals",
    title: "Signals and Systems",
    kind: "course",
    capstone: "Design a filter and predict its output for any input",
    createdAt: "2026-11-01T15:00:00.000Z",
  },
  {
    id: "goal-linalg",
    title: "Linear Algebra",
    kind: "course",
    capstone: "Explain what an eigenvector is and use one to solve a system",
    createdAt: "2026-11-03T18:30:00.000Z",
  },
];

export const sessions: Session[] = [
  {
    id: "session-1",
    goalId: "goal-signals",
    startedAt: "2026-11-05T19:00:00.000Z",
    endedAt: "2026-11-05T19:40:00.000Z",
  },
  { id: "session-2", goalId: "goal-signals", startedAt: "2026-11-07T20:15:00.000Z" },
  {
    id: "session-3",
    goalId: "goal-linalg",
    startedAt: "2026-11-06T17:00:00.000Z",
    endedAt: "2026-11-06T17:30:00.000Z",
  },
];

// Each session's timeline, looked up by session id.
export const timelines: Record<string, TimelineItem[]> = {
  "session-1": [
    {
      type: "tutor",
      id: "t1",
      text: "Today is convolution. Before I explain anything: if you feed a unit impulse into an LTI system, what comes out?",
    },
    { type: "answer", id: "a1", text: "The impulse response, h(t).", confidence: 4 },
    {
      type: "tutor",
      id: "t2",
      text: "Right. Now, every input can be built from shifted, scaled impulses. Try this one.",
    },
    {
      type: "question",
      id: "q1",
      conceptId: "convolution",
      depth: 2,
      prompt: "x(t) = u(t) and h(t) = e^(-t) u(t). Find y(t) = x(t) * h(t).",
    },
    { type: "answer", id: "a2", text: "y(t) = (1 - e^(-t)) u(t)", confidence: 3 },
    {
      type: "tutor",
      id: "t3",
      text: "Correct. Why does y(t) approach 1 as t grows? Explain it in terms of the area under h.",
    },
  ],
  "session-2": [
    {
      type: "tutor",
      id: "t4",
      text: "Quick review first. Then we'll start the Fourier series.",
    },
    {
      type: "question",
      id: "q2",
      conceptId: "lti-systems",
      depth: 3,
      prompt: "Is y(t) = t·x(t) time-invariant? Show why or why not.",
    },
  ],
  "session-3": [
    {
      type: "tutor",
      id: "t5",
      text: "Let's see where you are. Answer what you can, and say so when you're unsure.",
    },
    {
      type: "question",
      id: "q3",
      conceptId: "eigenvectors",
      depth: 1,
      prompt: "In one sentence: what makes a vector an eigenvector of a matrix A?",
    },
  ],
};

// Each goal's concept map (just a list for now), looked up by goal id.
export const conceptMaps: Record<string, MapConcept[]> = {
  "goal-signals": [
    { concept: { id: "complex-exponentials", name: "Complex exponentials", kind: "concept" }, depth: 4 },
    { concept: { id: "lti-systems", name: "LTI systems", kind: "concept" }, depth: 3 },
    { concept: { id: "convolution", name: "Convolution", kind: "skill" }, depth: 2 },
    { concept: { id: "fourier-series", name: "Fourier series", kind: "concept" }, depth: 1 },
    { concept: { id: "fourier-transform", name: "Fourier transform", kind: "concept" }, depth: 0 },
    { concept: { id: "sampling", name: "Sampling theorem", kind: "concept" }, depth: 0 },
    { concept: { id: "laplace-transform", name: "Laplace transform", kind: "skill" }, depth: 0 },
  ],
  "goal-linalg": [
    { concept: { id: "vectors", name: "Vectors and span", kind: "concept" }, depth: 5 },
    { concept: { id: "matrix-multiplication", name: "Matrix multiplication", kind: "skill" }, depth: 4 },
    { concept: { id: "linear-independence", name: "Linear independence", kind: "concept" }, depth: 2 },
    { concept: { id: "determinants", name: "Determinants", kind: "skill" }, depth: 1 },
    { concept: { id: "eigenvectors", name: "Eigenvectors", kind: "concept" }, depth: 0 },
  ],
};

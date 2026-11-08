// App-wide state, shared by components and by code outside React (the connection module).
import { create } from "zustand";
import type { Goal, Session } from "@helix/contracts";
import * as fixtures from "./fixtures.ts";

export type ConnectionStatus = "connecting" | "connected" | "reconnecting";

type Pong = { text: string; receivedAt: string };

type AppState = {
  // ---- Data ----
  status: ConnectionStatus;
  goals: Goal[]; // fake data until Step 7 loads real goals from the server
  sessions: Session[];
  lastPong: Pong | null;

  // ---- Actions: the only ways to change the data above ----
  setStatus: (status: ConnectionStatus) => void;
  addGoal: (goal: Goal) => void;
  addSession: (session: Session) => void;
  setLastPong: (pong: Pong) => void;
};

// `create` builds the store. `set` merges the object you give it into the current state,
// then tells every subscribed component to redraw if the part it reads changed.
export const useAppStore = create<AppState>()((set) => ({
  status: "connecting",
  goals: fixtures.goals,
  sessions: fixtures.sessions,
  lastPong: null,

  setStatus: (status) => set({ status }),
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  addSession: (session) => set((state) => ({ sessions: [...state.sessions, session] })),
  setLastPong: (pong) => set({ lastPong: pong }),
}));

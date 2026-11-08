import { useState } from "react";
import type { Goal, Session, TimelineItem } from "@helix/contracts";
import * as fixtures from "./fixtures.ts";
import { useShortcut } from "./hooks/useShortcut.ts";
import { CommandPalette, type Command } from "./components/CommandPalette.tsx";
import { Composer } from "./components/Composer.tsx";
import { MapPanel } from "./components/MapPanel.tsx";
import { SessionTimeline } from "./components/SessionTimeline.tsx";
import { Sidebar } from "./components/Sidebar.tsx";

export function App() {
  // ---- State: everything the screen depends on. Starts from the fake data. ----
  const [goals, setGoals] = useState<Goal[]>(fixtures.goals);
  const [sessions, setSessions] = useState<Session[]>(fixtures.sessions);
  const [timelines, setTimelines] = useState<Record<string, TimelineItem[]>>(fixtures.timelines);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>("goal-signals");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>("session-1");
  const [mapOpen, setMapOpen] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // ---- Values worked out from state (not stored separately, so they can't go stale). ----
  const selectedGoal = goals.find((g) => g.id === selectedGoalId);
  const timeline = selectedSessionId ? (timelines[selectedSessionId] ?? []) : [];
  const concepts = selectedGoalId ? (fixtures.conceptMaps[selectedGoalId] ?? []) : [];

  // ---- Actions: the only places state changes. ----
  function selectGoal(goalId: string): void {
    setSelectedGoalId(goalId);
    // Open the goal's most recent session, or none if it has no sessions yet.
    const latest = sessions.findLast((s) => s.goalId === goalId);
    setSelectedSessionId(latest?.id ?? null);
  }

  function selectSession(session: Session): void {
    setSelectedGoalId(session.goalId);
    setSelectedSessionId(session.id);
  }

  function newGoal(): void {
    const goal: Goal = {
      id: crypto.randomUUID(),
      title: `New goal ${goals.length + 1}`,
      kind: "course",
      capstone: "",
      createdAt: new Date().toISOString(),
    };
    setGoals([...goals, goal]);
    setSelectedGoalId(goal.id);
    setSelectedSessionId(null);
  }

  function newSession(): void {
    if (!selectedGoalId) return; // guard: a session needs a goal to belong to
    const session: Session = {
      id: crypto.randomUUID(),
      goalId: selectedGoalId,
      startedAt: new Date().toISOString(),
    };
    setSessions([...sessions, session]);
    setSelectedSessionId(session.id);
  }

  function sendAnswer(text: string): void {
    if (!selectedSessionId) return; // guard: nowhere to put the answer
    const item: TimelineItem = { type: "answer", id: crypto.randomUUID(), text };
    setTimelines({
      ...timelines,
      [selectedSessionId]: [...(timelines[selectedSessionId] ?? []), item],
    });
  }

  // ---- Keyboard shortcuts, active anywhere on the page. ----
  useShortcut("k", () => setPaletteOpen((open) => !open));
  useShortcut("\\", () => setMapOpen((open) => !open)); // "\\" is how you write one backslash

  const commands: Command[] = [
    { id: "new-goal", label: "New goal", run: newGoal },
    { id: "new-session", label: "New session", run: newSession },
    { id: "toggle-map", label: "Toggle map", run: () => setMapOpen((open) => !open) },
    ...goals.map((goal) => ({
      id: `jump-${goal.id}`,
      label: `Jump to goal: ${goal.title}`,
      run: () => selectGoal(goal.id),
    })),
  ];

  // ---- Layout: sidebar | main column (header, timeline, composer) | map panel ----
  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        goals={goals}
        sessions={sessions}
        selectedGoalId={selectedGoalId}
        selectedSessionId={selectedSessionId}
        onSelectGoal={selectGoal}
        onSelectSession={selectSession}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-3">
          <div className="text-sm font-medium">{selectedGoal?.title ?? "No goal selected"}</div>
          <div className="text-xs text-zinc-500">⌘K commands · ⌘\ map</div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {selectedSessionId ? (
            <SessionTimeline items={timeline} concepts={concepts} />
          ) : (
            <div className="p-8 text-sm text-zinc-500">No session selected. Press ⌘K → New session.</div>
          )}
        </div>

        <Composer disabled={!selectedSessionId} onSend={sendAnswer} />
      </main>

      {mapOpen && <MapPanel concepts={concepts} />}
      {paletteOpen && <CommandPalette commands={commands} onClose={() => setPaletteOpen(false)} />}
    </div>
  );
}

import type { Goal, Session } from "@helix/contracts";

type Props = {
  goals: Goal[];
  sessions: Session[];
  selectedGoalId: string | null;
  selectedSessionId: string | null;
  onSelectGoal: (goalId: string) => void;
  onSelectSession: (session: Session) => void;
};

// "Nov 5, 1:00 PM" from an ISO timestamp, in the learner's own time zone.
function formatStart(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function Sidebar(props: Props) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="px-4 py-3 text-sm font-semibold tracking-wide text-zinc-200">Helix</div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {props.goals.map((goal) => {
          const goalSessions = props.sessions.filter((s) => s.goalId === goal.id);
          const goalSelected = goal.id === props.selectedGoalId;

          return (
            <div key={goal.id} className="mb-3">
              <button
                onClick={() => props.onSelectGoal(goal.id)}
                className={`w-full rounded-md px-2 py-1.5 text-left text-sm font-medium ${
                  goalSelected ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {goal.title}
              </button>

              {goalSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => props.onSelectSession(session)}
                  className={`ml-2 block w-[calc(100%-0.5rem)] rounded-md px-2 py-1 text-left text-xs ${
                    session.id === props.selectedSessionId
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                  }`}
                >
                  {formatStart(session.startedAt)}
                  {session.endedAt ? "" : " · in progress"}
                </button>
              ))}

              {goalSessions.length === 0 && (
                <div className="ml-4 py-1 text-xs text-zinc-600">No sessions yet</div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

import type { TimelineItem } from "@helix/contracts";
import type { MapConcept } from "../fixtures.ts";
import { LearnerAnswer } from "./LearnerAnswer.tsx";
import { QuestionCard } from "./QuestionCard.tsx";
import { TutorMessage } from "./TutorMessage.tsx";

type Props = { items: TimelineItem[]; concepts: MapConcept[] };

export function SessionTimeline({ items, concepts }: Props) {
  // Look up a concept's display name from its id; fall back to the id itself.
  function conceptName(conceptId: string): string {
    return concepts.find((c) => c.concept.id === conceptId)?.concept.name ?? conceptId;
  }

  // Pick the right component for each kind of timeline item.
  function renderItem(item: TimelineItem) {
    switch (item.type) {
      case "tutor":
        return <TutorMessage text={item.text} />;
      case "question":
        return (
          <QuestionCard conceptName={conceptName(item.conceptId)} depth={item.depth} prompt={item.prompt} />
        );
      case "answer":
        return <LearnerAnswer text={item.text} confidence={item.confidence} />;
    }
  }

  if (items.length === 0) {
    return <div className="p-8 text-sm text-zinc-500">Nothing here yet. Write something below.</div>;
  }

  return (
    <div className="flex flex-col gap-5 p-8">
      {items.map((item) => (
        <div key={item.id} className="flex">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

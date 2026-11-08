type Props = { text: string };

export function TutorMessage({ text }: Props) {
  return (
    <div className="max-w-2xl text-sm leading-relaxed text-zinc-200">
      <div className="mb-1 text-xs font-medium text-zinc-500">Tutor</div>
      {text}
    </div>
  );
}

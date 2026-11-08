type Props = { text: string; confidence?: number };

export function LearnerAnswer({ text, confidence }: Props) {
  return (
    <div className="ml-auto max-w-xl rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-100">
      <div className="whitespace-pre-wrap">{text}</div>
      {confidence !== undefined && (
        <div className="mt-1 text-xs text-zinc-400">Confidence {confidence}/5</div>
      )}
    </div>
  );
}

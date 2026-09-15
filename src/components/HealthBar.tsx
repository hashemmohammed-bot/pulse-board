/** Account health as a filled bar plus the raw score, coloured by band. */
export function HealthBar({ score, width = "w-16" }: { score: number; width?: string }) {
  const tone = score >= 70 ? "bg-good" : score >= 40 ? "bg-warn" : "bg-bad";
  return (
    <span className="inline-flex items-center gap-2 align-middle">
      <span className={`h-1.5 ${width} overflow-hidden rounded-full bg-canvas`} aria-hidden="true">
        <span className={`block h-full rounded-full ${tone}`} style={{ width: `${score}%` }} />
      </span>
      <span className="w-7 text-right tabular-nums">{score}</span>
    </span>
  );
}

type Tone = "good" | "bad" | "warn" | "brand" | "neutral";

const TONES: Record<Tone, string> = {
  good: "bg-good-soft text-good",
  bad: "bg-bad-soft text-bad",
  warn: "bg-warn-soft text-warn",
  brand: "bg-brand-50 text-brand-600",
  neutral: "bg-canvas text-muted",
};

/** Status pill. Tone is derived from the label so callers stay dumb. */
export function Badge({ label }: { label: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold whitespace-nowrap ${TONES[toneFor(label)]}`}
    >
      {label}
    </span>
  );
}

function toneFor(label: string): Tone {
  switch (label) {
    case "Active":
      return "good";
    case "Trial":
    case "Invited":
      return "brand";
    case "At risk":
      return "warn";
    case "Churned":
    case "Suspended":
      return "bad";
    default:
      return "neutral";
  }
}

import { Badge } from "@/components/ui/badge";

type Tone = "success" | "warning" | "danger" | "info" | "secondary";

/**
 * Maps an account or user status onto a badge tone. The label itself is never
 * translated: it comes from the dataset and the acceptance test matches on it.
 */
function toneFor(label: string): Tone {
  switch (label) {
    case "Active":
      return "success";
    case "Trial":
    case "Invited":
      return "info";
    case "At risk":
      return "warning";
    case "Churned":
    case "Suspended":
      return "danger";
    default:
      return "secondary";
  }
}

export function StatusBadge({ label }: { label: string }) {
  return (
    <Badge variant={toneFor(label)} className="px-3 py-1 text-sm font-semibold">
      {label}
    </Badge>
  );
}

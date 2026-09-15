import { Badge, type BadgeTone } from "@/components/ui/badge";

/**
 * Maps an account or user status onto a badge tone. The label itself is never
 * translated: it comes from the dataset and the acceptance test matches on it.
 */
function toneFor(label: string): BadgeTone {
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
      return "neutral";
  }
}

export function StatusBadge({ label }: { label: string }) {
  return <Badge tone={toneFor(label)}>{label}</Badge>;
}

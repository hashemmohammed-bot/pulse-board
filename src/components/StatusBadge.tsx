import { Badge, type BadgeTone } from "@/components/ui/badge";
import { useDataLabel } from "@/i18n/labels";

/** Tone is chosen from the raw dataset value; only the display text is translated. */
function toneFor(status: string): BadgeTone {
  switch (status) {
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

export function StatusBadge({ status }: { status: string }) {
  const label = useDataLabel();
  return <Badge tone={toneFor(status)}>{label("status", status)}</Badge>;
}

import { useTranslation } from "react-i18next";

/** Dataset fields that carry a closed set of values and so can be translated. */
export type DataGroup = "kpi" | "status" | "plan" | "role";

/**
 * Translates a value that came from the dataset, falling back to the value
 * itself. The fallback matters: teams are free text a user can type, and any
 * value not listed in `data` must survive untouched rather than render as a
 * missing-key string.
 */
export function useDataLabel() {
  const { t } = useTranslation();
  return (group: DataGroup, value: string) =>
    t(`data.${group}.${value}`, { defaultValue: value });
}

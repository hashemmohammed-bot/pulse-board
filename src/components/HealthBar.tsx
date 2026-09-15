import * as stylex from "@stylexjs/stylex";
import { colors, radius } from "@/styles/tokens.stylex";

const styles = stylex.create({
  wrap: { display: "inline-flex", alignItems: "center", gap: "8px", verticalAlign: "middle" },
  track: {
    height: "6px",
    overflow: "hidden",
    borderRadius: radius.full,
    backgroundColor: colors.canvas,
  },
  fill: { display: "block", height: "100%", borderRadius: radius.full },
  good: { backgroundColor: colors.good },
  warn: { backgroundColor: colors.warn },
  bad: { backgroundColor: colors.bad },
  score: { width: "28px", textAlign: "right", fontVariantNumeric: "tabular-nums" },
});

/** Account health as a filled bar plus the raw score, coloured by band. */
export function HealthBar({ score, width = 64 }: { score: number; width?: number }) {
  const tone = score >= 70 ? styles.good : score >= 40 ? styles.warn : styles.bad;
  return (
    <span {...stylex.props(styles.wrap)}>
      <span aria-hidden="true" {...stylex.props(styles.track)} style={{ width }}>
        <span {...stylex.props(styles.fill, tone)} style={{ width: `${score}%` }} />
      </span>
      <span {...stylex.props(styles.score)}>{score}</span>
    </span>
  );
}

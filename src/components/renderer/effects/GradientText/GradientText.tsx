import styles from "@/components/renderer/effects/GradientText/GradientText.module.css";
import type { EffectComponentProps } from "@/types";

type GradientTextProps = EffectComponentProps;

export default function GradientText({
  attrs,
  children,
}: GradientTextProps): JSX.Element {
  const gradientColors = Array.isArray(attrs.colors)
    ? attrs.colors.join(", ")
    : attrs.colors
      ? String(attrs.colors)
      : "#000";

  return (
    <span
      className={styles.gradientText}
      style={{
        ["--gradient-colors" as string]: gradientColors,
        ["--gradient-direction" as string]: String(attrs.direction ?? "90deg"),
      }}
    >
      {children}
    </span>
  );
}

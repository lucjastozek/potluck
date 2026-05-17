import styles from "@/components/renderer/effects/GlitchText/GlitchText.module.css";
import type { EffectComponentProps } from "@/types";

type GlitchTextProps = EffectComponentProps;

export default function GlitchText({
  attrs,
  children,
}: GlitchTextProps): JSX.Element {
  return (
    <span
      className={styles.glitchText}
      style={{ ["--glitch-color" as string]: String(attrs.color ?? "pink") }}
    >
      {children}
    </span>
  );
}

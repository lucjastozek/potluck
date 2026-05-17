import styles from "@/components/renderer/effects/NeonText/NeonText.module.css";
import type { EffectComponentProps } from "@/types";

type NeonTextProps = EffectComponentProps;

export default function NeonText({
  attrs,
  children,
}: NeonTextProps): JSX.Element {
  return (
    <span
      className={styles.neonText}
      style={{ ["--neon-color" as string]: String(attrs.color ?? "#ff00ff") }}
    >
      {children}
    </span>
  );
}

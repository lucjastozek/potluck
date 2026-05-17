import styles from "@/components/renderer/effects/SizedText/SizedText.module.css";
import type { EffectComponentProps } from "@/types";

type SizedTextProps = EffectComponentProps;

export default function SizedText({
  attrs,
  children,
}: SizedTextProps): JSX.Element {
  return (
    <span
      className={styles.sizedText}
      style={{ ["--text-size" as string]: String(attrs.size ?? "1.5em") }}
    >
      {children}
    </span>
  );
}

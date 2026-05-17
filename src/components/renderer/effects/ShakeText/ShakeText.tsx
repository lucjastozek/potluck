import styles from "@/components/renderer/effects/ShakeText/ShakeText.module.css";
import type { EffectComponentProps } from "@/types";

type ShakeTextProps = EffectComponentProps;

export default function ShakeText({
  attrs,
  children,
}: ShakeTextProps): JSX.Element {
  const duration = attrs.intensity === "high" ? "0.3s" : "0.5s";

  return (
    <span
      className={styles.shakeText}
      style={{ ["--shake-duration" as string]: duration }}
    >
      {children}
    </span>
  );
}

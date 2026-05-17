import styles from "@/components/renderer/effects/StrikeText/StrikeText.module.css";
import type { EffectComponentProps } from "@/types";

type StrikeTextProps = EffectComponentProps;

export default function StrikeText({
  attrs,
  children,
}: StrikeTextProps): JSX.Element {
  return (
    <span
      className={styles.strikeText}
      style={{
        ["--strike-color" as string]: String(attrs.color ?? "currentColor"),
        ["--strike-width" as string]: String(attrs.width ?? "2px"),
      }}
    >
      {children}
    </span>
  );
}

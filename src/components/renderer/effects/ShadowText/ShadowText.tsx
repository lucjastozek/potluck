import styles from "@/components/renderer/effects/ShadowText/ShadowText.module.css";
import type { EffectComponentProps } from "@/types";

type ShadowTextProps = EffectComponentProps;

export default function ShadowText({
  attrs,
  children,
}: ShadowTextProps): JSX.Element {
  return (
    <span
      className={styles.shadowText}
      style={{
        ["--shadow-color" as string]: String(attrs.color ?? "#000000"),
        ["--shadow-x" as string]: String(attrs.x ?? "4px"),
        ["--shadow-y" as string]: String(attrs.y ?? "4px"),
        ["--shadow-blur" as string]: String(attrs.blur ?? "0"),
      }}
    >
      {children}
    </span>
  );
}

import styles from "@/components/renderer/effects/OutlineText/OutlineText.module.css";
import type { EffectComponentProps } from "@/types";

type OutlineTextProps = EffectComponentProps;

export default function OutlineText({
  attrs,
  children,
}: OutlineTextProps): JSX.Element {
  return (
    <span
      className={styles.outlineText}
      style={{
        ["--outline-width" as string]: `${String(attrs.width ?? "2")}px`,
        ["--outline-color" as string]: String(attrs.color ?? "#ff0000"),
      }}
    >
      {children}
    </span>
  );
}

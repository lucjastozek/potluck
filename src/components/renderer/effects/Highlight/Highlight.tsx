import styles from "@/components/renderer/effects/Highlight/Highlight.module.css";
import type { EffectComponentProps } from "@/types";

type HighlightProps = EffectComponentProps;

export default function Highlight({
  attrs,
  children,
}: HighlightProps): JSX.Element {
  return (
    <mark
      className={styles.highlight}
      style={{
        ["--highlight-color" as string]: String(attrs.color ?? "#ffff00"),
        ["--highlight-text-color" as string]: String(
          attrs.textColor ?? "inherit",
        ),
      }}
    >
      {children}
    </mark>
  );
}

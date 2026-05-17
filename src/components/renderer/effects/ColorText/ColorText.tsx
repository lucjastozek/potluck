import styles from "@/components/renderer/effects/ColorText/ColorText.module.css";
import type { EffectComponentProps } from "@/types";

type ColorTextProps = EffectComponentProps;

export default function ColorText({
  attrs,
  children,
}: ColorTextProps): JSX.Element {
  return (
    <span
      className={styles.colorText}
      style={{
        ["--text-color" as string]: String(
          attrs.value ?? attrs.color ?? "inherit",
        ),
      }}
    >
      {children}
    </span>
  );
}

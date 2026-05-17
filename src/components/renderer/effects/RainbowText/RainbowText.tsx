import styles from "@/components/renderer/effects/RainbowText/RainbowText.module.css";
import type { EffectComponentProps } from "@/types";

type RainbowTextProps = EffectComponentProps;

export default function RainbowText({
  children,
}: RainbowTextProps): JSX.Element {
  const text = typeof children === "string" ? children : "";
  const step = 360 / (text.length || 1);

  if (!text) {
    return <span className={styles.rainbowText}>{children}</span>;
  }

  return (
    <span className={styles.rainbowText} aria-label={text}>
      {text.split("").map((character, index) => (
        <span
          key={`${character}-${index}`}
          className={styles.rainbowLetter}
          style={{ ["--rainbow-hue" as string]: `${index * step}` }}
          aria-hidden="true"
        >
          {character === " " ? "\u00A0" : character}
        </span>
      ))}
    </span>
  );
}

import styles from "@/components/renderer/effects/WavyText/WavyText.module.css";
import type { EffectComponentProps } from "@/types";

type WavyTextProps = EffectComponentProps;

export default function WavyText({ children }: WavyTextProps): JSX.Element {
  const text = typeof children === "string" ? children : "";

  if (!text) {
    return <span className={styles.wavyText}>{children}</span>;
  }

  return (
    <span className={styles.wavyText} aria-label={text}>
      {text.split("").map((character, index) => (
        <span
          key={`${character}-${index}`}
          className={styles.wavyLetter}
          style={{ ["--wavy-delay" as string]: `${index * 0.05}s` }}
          aria-hidden="true"
        >
          {character === " " ? "\u00A0" : character}
        </span>
      ))}
    </span>
  );
}

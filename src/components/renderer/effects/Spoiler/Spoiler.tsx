import { useState } from "react";
import styles from "@/components/renderer/effects/Spoiler/Spoiler.module.css";
import type { EffectComponentProps } from "@/types";

type SpoilerProps = EffectComponentProps;

export default function Spoiler({ children }: SpoilerProps): JSX.Element {
  const [revealed, setRevealed] = useState(false);

  return (
    <button
      type="button"
      className={`${styles.spoilerButton} ${
        revealed ? styles.spoilerRevealed : styles.spoilerHidden
      }`}
      aria-pressed={revealed}
      title={revealed ? "Click to hide" : "Click to reveal"}
      onClick={() => setRevealed((value) => !value)}
    >
      {children}
    </button>
  );
}

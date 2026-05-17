import { useEffect, useState } from "react";
import styles from "@/components/renderer/effects/Typewriter/Typewriter.module.css";
import type { EffectComponentProps } from "@/types";

type TypewriterProps = EffectComponentProps;

export default function Typewriter({
  attrs,
  children,
}: TypewriterProps): JSX.Element {
  const isPlainText = typeof children === "string";
  const text = isPlainText ? children : "";
  const speed = Number.parseInt(String(attrs.speed ?? "50"), 10);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!isPlainText) {
      return;
    }

    let index = 0;
    setDisplayed("");

    const timer = window.setInterval(
      () => {
        index += 1;
        setDisplayed(text.slice(0, index));

        if (index >= text.length) {
          window.clearInterval(timer);
        }
      },
      Number.isNaN(speed) ? 50 : speed,
    );

    return () => window.clearInterval(timer);
  }, [isPlainText, text, speed]);

  if (!isPlainText) {
    return <span className={styles.typewriterText}>{children}</span>;
  }

  return (
    <span
      className={styles.typewriterText}
      aria-live="polite"
      aria-label={text}
    >
      {displayed}
      <span className={styles.typewriterCursor} aria-hidden="true">
        |
      </span>
    </span>
  );
}

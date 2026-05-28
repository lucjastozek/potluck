import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import styles from "@/components/editor/Toolbar.module.css";
import { useViewportPopoverPosition } from "@/hooks/useViewportPopoverPosition";

const speedToMs = (speed: number) => Math.round(220 - speed * 20);

export default function TypewriterPopover({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}): JSX.Element {
  const { ref, style } = useViewportPopoverPosition<HTMLDivElement>();
  const [speed, setSpeed] = useState(5);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, ref]);

  const apply = (e: React.MouseEvent) => {
    e.preventDefault();
    editor
      .chain()
      .focus()
      .setTypewriter({ speed: speedToMs(speed) })
      .run();
    onClose();
  };

  const adjust = (delta: number, e: React.MouseEvent) => {
    e.preventDefault();
    setSpeed((current) => Math.min(10, Math.max(1, current + delta)));
  };

  return (
    <div
      ref={ref}
      className={styles.popover}
      style={style}
      role="dialog"
      aria-label="Typewriter speed"
    >
      <p className={styles.popoverLabel}>Speed</p>
      <div className={styles.widthPicker}>
        <button className={styles.widthBtn} onMouseDown={(e) => adjust(-1, e)}>
          −
        </button>
        <span className={styles.widthValue}>{speed} / 10</span>
        <button className={styles.widthBtn} onMouseDown={(e) => adjust(1, e)}>
          +
        </button>
      </div>
      <button className={styles.applyBtn} onMouseDown={apply}>
        Apply
      </button>
    </div>
  );
}

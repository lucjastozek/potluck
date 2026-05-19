import type { Editor } from "@tiptap/react";
import { useRef, useEffect } from "react";
import styles from "@/components/editor/Toolbar.module.css";

export default function ShakePopover({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const apply = (intensity: "low" | "high", e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().setShake({ intensity }).run();
    onClose();
  };

  return (
    <div
      ref={ref}
      className={styles.popover}
      role="dialog"
      aria-label="Shake intensity"
    >
      <p className={styles.popoverLabel}>Intensity</p>
      <div className={styles.widthPicker}>
        <button
          className={styles.widthBtn}
          style={{ width: "auto", padding: "0 0.5rem" }}
          onMouseDown={(e) => apply("low", e)}
        >
          Low
        </button>
        <button
          className={styles.widthBtn}
          style={{ width: "auto", padding: "0 0.5rem" }}
          onMouseDown={(e) => apply("high", e)}
        >
          High
        </button>
      </div>
    </div>
  );
}

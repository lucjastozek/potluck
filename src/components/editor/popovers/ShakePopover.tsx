import type { Editor } from "@tiptap/react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "@/components/editor/Toolbar.module.css";
import { useViewportPopoverPosition } from "@/hooks/useViewportPopoverPosition";

export default function ShakePopover({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}): JSX.Element {
  const { ref, style } = useViewportPopoverPosition<HTMLDivElement>();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, ref]);

  const apply = (intensity: "low" | "high", e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().setShake({ intensity }).run();
    onClose();
  };

  const content = (
    <div
      ref={ref}
      className={styles.popover}
      style={style}
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

  return typeof document === "undefined"
    ? content
    : createPortal(content, document.body);
}

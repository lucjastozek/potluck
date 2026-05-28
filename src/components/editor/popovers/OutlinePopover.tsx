import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "@/components/editor/Toolbar.module.css";
import { useViewportPopoverPosition } from "@/hooks/useViewportPopoverPosition";

const PRESETS = [
  { label: "Default", value: "var(--fg)" },
  { label: "Red", value: "var(--red)" },
  { label: "Orange", value: "var(--orange)" },
  { label: "Yellow", value: "var(--yellow)" },
  { label: "Green", value: "var(--green)" },
  { label: "Dark Green", value: "var(--darkGreen)" },
  { label: "Blue", value: "var(--blue)" },
  { label: "Dark Blue", value: "var(--darkBlue)" },
  { label: "Purple", value: "var(--purple)" },
  { label: "Dark Purple", value: "var(--darkPurple)" },
  { label: "Pink", value: "var(--pink)" },
  { label: "Peach", value: "var(--peach)" },
];

export default function OutlinePopover({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}): JSX.Element {
  const { ref, style } = useViewportPopoverPosition<HTMLDivElement>();
  const [width, setWidth] = useState(2);
  const [color, setColor] = useState("var(--fg)");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        editor.chain().focus().setOutline({ color, width }).run();
        onClose();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, color, width, editor, ref]);

  const selectColor = (value: string, e: React.MouseEvent) => {
    e.preventDefault();
    setColor(value);
  };

  const adjust = (delta: number, e: React.MouseEvent) => {
    e.preventDefault();
    setWidth((current) => Math.min(5, Math.max(1, current + delta)));
  };

  const applyAndClose = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().setOutline({ color, width }).run();
    onClose();
  };

  const content = (
    <div
      ref={ref}
      className={styles.popover}
      style={style}
      role="dialog"
      aria-label="Text outline"
    >
      <p className={styles.popoverLabel}>Outline colour</p>
      <div className={styles.colorGrid}>
        {PRESETS.map(({ label, value }) => (
          <button
            key={value}
            className={`${styles.colorSwatch} ${color === value ? styles.colorSwatchActive : ""}`}
            style={{ background: value }}
            title={label}
            aria-label={label}
            onMouseDown={(e) => selectColor(value, e)}
          />
        ))}
      </div>
      <p className={styles.popoverLabel} style={{ marginTop: "0.5rem" }}>
        Width
      </p>
      <div className={styles.widthPicker}>
        <button className={styles.widthBtn} onMouseDown={(e) => adjust(-1, e)}>
          −
        </button>
        <span className={styles.widthValue}>{width}</span>
        <button className={styles.widthBtn} onMouseDown={(e) => adjust(1, e)}>
          +
        </button>
      </div>
      <button className={styles.applyBtn} onMouseDown={applyAndClose}>
        Apply
      </button>
    </div>
  );

  return typeof document === "undefined"
    ? content
    : createPortal(content, document.body);
}

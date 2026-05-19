import type { Editor } from "@tiptap/react";
import { useRef, useEffect, useState } from "react";
import styles from "@/components/editor/Toolbar.module.css";

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
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(5);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const apply = (color: string, e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().setOutline({ color, width }).run();
    onClose();
  };

  const adjust = (delta: number, e: React.MouseEvent) => {
    e.preventDefault();
    setWidth((w) => Math.max(1, w + delta));
  };

  return (
    <div
      ref={ref}
      className={styles.popover}
      role="dialog"
      aria-label="Text outline"
    >
      <p className={styles.popoverLabel}>Outline colour</p>
      <div className={styles.colorGrid}>
        {PRESETS.map(({ label, value }) => (
          <button
            key={value}
            className={styles.colorSwatch}
            style={{ background: value }}
            title={label}
            aria-label={label}
            onMouseDown={(e) => apply(value, e)}
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
    </div>
  );
}

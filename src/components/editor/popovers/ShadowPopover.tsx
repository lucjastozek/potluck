// ShadowPopover.tsx
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

export default function ShadowPopover({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(4);
  const [y, setY] = useState(4);
  const [blur, setBlur] = useState(0);
  const [color, setColor] = useState("var(--blue)");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        editor.chain().focus().setShadow({ color, x, y, blur }).run();
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, color, x, y, blur, editor]);

  const apply = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().setShadow({ color, x, y, blur }).run();
    onClose();
  };

  const selectColor = (value: string, e: React.MouseEvent) => {
    e.preventDefault();
    setColor(value);
  };

  const adjuster = (
    label: string,
    value: number,
    set: (v: number) => void,
    min?: number,
  ) => (
    <div className={styles.adjusterRow}>
      <span className={styles.adjusterLabel}>{label}</span>
      <div className={styles.widthPicker}>
        <button
          className={styles.widthBtn}
          onMouseDown={(e) => {
            e.preventDefault();
            set(Math.max(min ?? -99, value - 1));
          }}
        >
          −
        </button>
        <span className={styles.widthValue}>{value}px</span>
        <button
          className={styles.widthBtn}
          onMouseDown={(e) => {
            e.preventDefault();
            set(value + 1);
          }}
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      className={styles.popover}
      role="dialog"
      aria-label="Text shadow"
    >
      <p className={styles.popoverLabel}>Shadow colour</p>
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
      <div className={styles.adjusterGroup}>
        {adjuster("X", x, setX)}
        {adjuster("Y", y, setY)}
        {adjuster("Blur", blur, setBlur, 0)}
      </div>
      <button className={styles.applyBtn} onMouseDown={apply}>
        Apply
      </button>
    </div>
  );
}

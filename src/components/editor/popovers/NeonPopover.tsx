import type { Editor } from "@tiptap/react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "@/components/editor/Toolbar.module.css";
import { useViewportPopoverPosition } from "@/hooks/useViewportPopoverPosition";

const PRESETS = [
  { label: "Default", value: "var(--white)" },
  { label: "Red", value: "var(--absred)" },
  { label: "Orange", value: "var(--absorange)" },
  { label: "Yellow", value: "var(--absyellow)" },
  { label: "Green", value: "var(--absgreen)" },
  { label: "Dark Green", value: "var(--absdarkGreen)" },
  { label: "Blue", value: "var(--absblue)" },
  { label: "Dark Blue", value: "var(--absdarkBlue)" },
  { label: "Purple", value: "var(--abspurple)" },
  { label: "Dark Purple", value: "var(--absdarkPurple)" },
  { label: "Pink", value: "var(--abspink)" },
  { label: "Peach", value: "var(--abspeach)" },
];

export default function NeonPopover({
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

  const apply = (color: string, e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().setNeon({ color }).run();
    onClose();
  };

  const content = (
    <div
      ref={ref}
      className={styles.popover}
      style={style}
      role="dialog"
      aria-label="Neon colour"
    >
      <p className={styles.popoverLabel}>Neon colour</p>
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
    </div>
  );

  return typeof document === "undefined"
    ? content
    : createPortal(content, document.body);
}

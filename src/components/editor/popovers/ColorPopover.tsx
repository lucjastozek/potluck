import type { Editor } from "@tiptap/react";
import { useEffect } from "react";
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

export default function ColorPopover({
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
    editor.chain().focus().setColor({ color }).run();
    onClose();
  };

  const content = (
    <div
      ref={ref}
      className={styles.popover}
      style={style}
      role="dialog"
      aria-label="Text colour"
    >
      <p className={styles.popoverLabel}>Text colour</p>
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

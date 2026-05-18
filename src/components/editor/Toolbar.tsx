import type { Editor } from "@tiptap/react";
import { useState } from "react";
import styles from "@/components/editor/Toolbar.module.css";
import ColorPopover from "@/components/editor/popovers/ColorPopover";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";

export default function Toolbar({
  editor,
}: {
  editor: Editor | null;
}): JSX.Element | null {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  if (!editor) return null;

  const toggle = (name: string) =>
    setOpenPopover((prev) => (prev === name ? null : name));

  const btn = (name: string, attrs?: Record<string, unknown>) =>
    editor.isActive(name, attrs)
      ? `${styles.toolbarButton} ${styles.toolbarButtonActive}`
      : styles.toolbarButton;

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Text formatting">
      <button
        className={btn("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <b>B</b>
      </button>
      <button
        className={btn("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <i>I</i>
      </button>
      <button
        className={btn("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Code"
      >
        {"</>"}
      </button>
      <button
        className={btn("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <s>S</s>
      </button>

      <span className={styles.divider} aria-hidden="true" />

      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <button
          key={level}
          className={btn("heading", { level })}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          title={`Heading ${level}`}
        >
          H{level}
        </button>
      ))}

      <span className={styles.divider} aria-hidden="true" />

      <div className={styles.popoverAnchor}>
        <button
          className={btn("color")}
          onClick={() => toggle("color")}
          aria-expanded={openPopover === "color"}
          title="Color"
        >
          <FormatColorTextIcon fontSize="inherit" />
        </button>
        {openPopover === "color" && (
          <ColorPopover editor={editor} onClose={() => setOpenPopover(null)} />
        )}
      </div>
    </div>
  );
}

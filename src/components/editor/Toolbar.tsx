import { useEditorState, type Editor } from "@tiptap/react";
import { useState } from "react";
import styles from "@/components/editor/Toolbar.module.css";
import ColorPopover from "@/components/editor/popovers/ColorPopover";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import GlitterIcon from "@mui/icons-material/AutoAwesome";
import GlitterPopover from "@/components/editor/popovers/GlitterPopover";

export default function Toolbar({
  editor,
}: {
  editor: Editor | null;
}): JSX.Element | null {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  useEditorState({
    editor,
    selector: (ctx) => {
      if (ctx.editor) {
        return ctx.editor.state;
      }
    },
  });

  if (!editor) return null;

  const toggle = (name: string) =>
    setOpenPopover((prev) => (prev === name ? null : name));

  const btn = (name: string, attrs?: Record<string, unknown>) =>
    editor.isActive(name, attrs)
      ? `${styles.toolbarButton} ${styles.toolbarButtonActive}`
      : styles.toolbarButton;

  const applyRainbow = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().setRainbow().run();
  };

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
          onClick={() => {
            if (editor.isActive("color")) {
              editor.chain().focus().unsetColor().run();
            } else {
              toggle("color");
            }
          }}
          aria-expanded={openPopover === "color"}
          title="Color"
        >
          <FormatColorTextIcon fontSize="inherit" />
        </button>
        {openPopover === "color" && (
          <ColorPopover editor={editor} onClose={() => setOpenPopover(null)} />
        )}
      </div>

      <button
        className={btn("rainbow")}
        onClick={(e) => {
          applyRainbow(e);
        }}
        title="Rainbow"
      >
        🌈
      </button>

      <div className={styles.popoverAnchor}>
        <button
          className={btn("glitter")}
          onClick={() => {
            if (editor.isActive("glitter")) {
              editor.chain().focus().unsetGlitter().run();
            } else {
              toggle("glitter");
            }
          }}
          aria-expanded={openPopover === "glitter"}
          title="Glitter"
        >
          <GlitterIcon fontSize="inherit" />
        </button>
        {openPopover === "glitter" && (
          <GlitterPopover
            editor={editor}
            onClose={() => setOpenPopover(null)}
          />
        )}
      </div>
    </div>
  );
}

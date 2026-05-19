import { useEditorState, type Editor } from "@tiptap/react";
import { useState } from "react";
import styles from "@/components/editor/Toolbar.module.css";
import ColorPopover from "@/components/editor/popovers/ColorPopover";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import GlitterIcon from "@mui/icons-material/AutoAwesome";
import GlitterPopover from "@/components/editor/popovers/GlitterPopover";
import HighlightIcon from "@mui/icons-material/DriveFileRenameOutline";
import HighlightPopover from "@/components/editor/popovers/HighlightPopover";
import OutlineIcon from "@mui/icons-material/Vignette";
import OutlinePopover from "@/components/editor/popovers/OutlinePopover";
import NeonPopover from "@/components/editor/popovers/NeonPopover";
import NeonIcon from "@mui/icons-material/Flare";
import ShadowPopover from "@/components/editor/popovers/ShadowPopover";
import ShadowIcon from "@mui/icons-material/Tonality";
import ShakePopover from "@/components/editor/popovers/ShakePopover";
import ShakeIcon from "@mui/icons-material/Animation";
import SpoilerIcon from "@mui/icons-material/VisibilityOff";
import WaveIcon from "@mui/icons-material/Water";

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

  const applySpoiler = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().setSpoiler().run();
  };

  const applyWave = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().setWavy().run();
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

      <div className={styles.popoverAnchor}>
        <button
          className={btn("highlight")}
          onClick={() => {
            if (editor.isActive("highlight")) {
              editor.chain().focus().unsetHighlight().run();
            } else {
              toggle("highlight");
            }
          }}
          aria-expanded={openPopover === "highlight"}
          title="Highlight"
        >
          <HighlightIcon fontSize="inherit" />
        </button>
        {openPopover === "highlight" && (
          <HighlightPopover
            editor={editor}
            onClose={() => setOpenPopover(null)}
          />
        )}
      </div>

      <div className={styles.popoverAnchor}>
        <button
          className={btn("outline")}
          onClick={() => {
            if (editor.isActive("outline")) {
              editor.chain().focus().unsetOutline().run();
            } else {
              toggle("outline");
            }
          }}
          aria-expanded={openPopover === "outline"}
          title="Outline"
        >
          <OutlineIcon fontSize="inherit" />
        </button>
        {openPopover === "outline" && (
          <OutlinePopover
            editor={editor}
            onClose={() => setOpenPopover(null)}
          />
        )}
      </div>

      <div className={styles.popoverAnchor}>
        <button
          className={btn("neon")}
          onClick={() => {
            if (editor.isActive("neon")) {
              editor.chain().focus().unsetNeon().run();
            } else {
              toggle("neon");
            }
          }}
          aria-expanded={openPopover === "neon"}
          title="Neon"
        >
          <NeonIcon fontSize="inherit" />
        </button>
        {openPopover === "neon" && (
          <NeonPopover editor={editor} onClose={() => setOpenPopover(null)} />
        )}
      </div>

      <div className={styles.popoverAnchor}>
        <button
          className={btn("shadow")}
          onClick={() => {
            if (editor.isActive("shadow")) {
              editor.chain().focus().unsetShadow().run();
            } else {
              toggle("shadow");
            }
          }}
          aria-expanded={openPopover === "shadow"}
          title="Shadow"
        >
          <ShadowIcon fontSize="inherit" />
        </button>
        {openPopover === "shadow" && (
          <ShadowPopover editor={editor} onClose={() => setOpenPopover(null)} />
        )}
      </div>

      <div className={styles.popoverAnchor}>
        <button
          className={btn("shake")}
          onClick={() => {
            if (editor.isActive("shake")) {
              editor.chain().focus().unsetShake().run();
            } else {
              toggle("shake");
            }
          }}
          aria-expanded={openPopover === "shake"}
          title="Shake"
        >
          <ShakeIcon fontSize="inherit" />
        </button>
        {openPopover === "shake" && (
          <ShakePopover editor={editor} onClose={() => setOpenPopover(null)} />
        )}
      </div>

      <button
        className={btn("spoiler")}
        onClick={(e) => {
          applySpoiler(e);
        }}
        title="Spoiler"
      >
        <SpoilerIcon fontSize="inherit" />
      </button>

      <button
        className={btn("wave")}
        onClick={(e) => {
          applyWave(e);
        }}
        title="wave"
      >
        <WaveIcon fontSize="inherit" />
      </button>
    </div>
  );
}

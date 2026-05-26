import { useEditorState, type Editor } from "@tiptap/react";
import { useState } from "react";
import styles from "@/components/editor/Toolbar.module.css";
import ColorPopover from "@/components/editor/popovers/ColorPopover";
import StrikeColorPopover from "@/components/editor/popovers/StrikeColorPopover";
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
import TypewriterPopover from "@/components/editor/popovers/TypewriterPopover";
import TypewriterIcon from "@mui/icons-material/Keyboard";
import ImageIcon from "@mui/icons-material/Image";
import ImagePopover from "@/components/editor/popovers/ImagePopover";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import ItalicIcon from "@mui/icons-material/FormatItalic";
import BoldIcon from "@mui/icons-material/FormatBold";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

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

  const activeEffects = {
    color: editor.isActive("color"),
    rainbow: editor.isActive("rainbow"),
    glitter: editor.isActive("glitter"),
    highlight: editor.isActive("highlight"),
    code: editor.isActive("code"),
    spoiler: editor.isActive("spoiler"),
    outline: editor.isActive("outline"),
    neon: editor.isActive("neon"),
    shadow: editor.isActive("shadow"),
    shake: editor.isActive("shake"),
    wavy: editor.isActive("wavy"),
    typewriter: editor.isActive("typewriter"),
  };

  const isEffectDisabled = (
    effect: keyof typeof activeEffects,
    conflicts: Array<keyof typeof activeEffects>,
  ) => !activeEffects[effect] && conflicts.some((name) => activeEffects[name]);

  const currentHeadingLevel =
    HEADING_LEVELS.find((level) => editor.isActive("heading", { level })) ?? 0;
  let previousHeadingLevel = 0;
  const selectionFrom = editor.state.selection.from;
  editor.state.doc.descendants((node, pos) => {
    const nodeEnd = pos + node.nodeSize;
    const selectionInsideNode = pos <= selectionFrom && selectionFrom < nodeEnd;

    if (
      node.type.name === "heading" &&
      pos < selectionFrom &&
      !selectionInsideNode
    ) {
      previousHeadingLevel = Number(node.attrs.level) || 0;
    }
  });
  const maxHeadingLevel =
    previousHeadingLevel === 0 ? 1 : Math.min(previousHeadingLevel + 1, 6);
  const headingOptions = HEADING_LEVELS.filter(
    (level) => level <= maxHeadingLevel,
  );
  const headingValue = currentHeadingLevel
    ? String(currentHeadingLevel)
    : "paragraph";

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Text formatting">
      <select
        className={styles.headingSelect}
        aria-label="Heading level"
        title="Heading level"
        value={headingValue}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "paragraph") {
            editor.chain().focus().setParagraph().run();
            return;
          }

          const level = Number(value) as 1 | 2 | 3 | 4 | 5 | 6;
          editor.chain().focus().toggleHeading({ level }).run();
        }}
      >
        <option value="paragraph">Paragraph</option>
        {currentHeadingLevel &&
          !headingOptions.includes(currentHeadingLevel) && (
            <option value={String(currentHeadingLevel)} disabled>
              Heading {currentHeadingLevel}
            </option>
          )}
        {headingOptions.map((level) => (
          <option key={level} value={level}>
            Heading {level}
          </option>
        ))}
      </select>
      <span className={styles.divider} aria-hidden="true" />
      <button
        className={btn("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <BoldIcon fontSize="inherit" />
      </button>
      <button
        className={btn("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <ItalicIcon fontSize="inherit" />
      </button>
      <div className={styles.popoverAnchor}>
        <button
          className={btn("strike")}
          onClick={(e) => {
            e.preventDefault();
            if (editor.isActive("strike")) {
              editor.chain().focus().unsetMark("strike").run();
              setOpenPopover(null);
            } else {
              toggle("strikeColor");
            }
          }}
          aria-expanded={openPopover === "strikeColor"}
          title="Strikethrough color"
        >
          <StrikethroughSIcon fontSize="inherit" />
        </button>

        {openPopover === "strikeColor" && (
          <StrikeColorPopover
            editor={editor}
            onClose={() => setOpenPopover(null)}
          />
        )}
      </div>
      <span className={styles.divider} aria-hidden="true" />
      <div className={styles.popoverAnchor}>
        <button
          className={btn("color")}
          disabled={isEffectDisabled("color", ["rainbow", "glitter"])}
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
        disabled={isEffectDisabled("rainbow", ["color", "glitter"])}
        onClick={(e) => {
          e.preventDefault();
          if (editor.isActive("rainbow")) {
            editor.chain().focus().unsetRainbow().run();
          } else {
            editor.chain().focus().setRainbow().run();
          }
        }}
        title="Rainbow"
      >
        🌈
      </button>
      <div className={styles.popoverAnchor}>
        <button
          className={btn("glitter")}
          disabled={isEffectDisabled("glitter", ["color", "rainbow"])}
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
      <span className={styles.divider} aria-hidden="true" />
      <div className={styles.popoverAnchor}>
        <button
          className={btn("highlight")}
          disabled={isEffectDisabled("highlight", ["code", "spoiler"])}
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
      <button
        className={btn("code")}
        disabled={isEffectDisabled("code", ["highlight", "spoiler"])}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Code"
      >
        <CodeIcon fontSize="inherit" />
      </button>
      <button
        className={btn("spoiler")}
        disabled={isEffectDisabled("spoiler", ["highlight", "code"])}
        onClick={(e) => {
          e.preventDefault();
          if (editor.isActive("spoiler")) {
            editor.chain().focus().unsetSpoiler().run();
          } else {
            editor.chain().focus().setSpoiler().run();
          }
        }}
        title="Spoiler"
      >
        <SpoilerIcon fontSize="inherit" />
      </button>
      <span className={styles.divider} aria-hidden="true" />
      <div className={styles.popoverAnchor}>
        <button
          className={btn("outline")}
          disabled={isEffectDisabled("outline", ["neon"])}
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
          disabled={isEffectDisabled("neon", ["outline", "shadow"])}
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
          disabled={isEffectDisabled("shadow", ["neon"])}
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
      <span className={styles.divider} aria-hidden="true" />
      <div className={styles.popoverAnchor}>
        <button
          className={btn("shake")}
          disabled={isEffectDisabled("shake", ["wavy", "typewriter"])}
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
        className={btn("wavy")}
        disabled={isEffectDisabled("wavy", ["shake", "typewriter"])}
        onClick={(e) => {
          e.preventDefault();
          if (editor.isActive("wavy")) {
            editor.chain().focus().unsetWavy().run();
          } else {
            editor.chain().focus().setWavy().run();
          }
        }}
        title="Wave"
      >
        <WaveIcon fontSize="inherit" />
      </button>
      <div className={styles.popoverAnchor}>
        <button
          className={btn("typewriter")}
          disabled={isEffectDisabled("typewriter", ["shake", "wavy"])}
          onClick={() => {
            if (editor.isActive("typewriter")) {
              editor.chain().focus().unsetTypewriter().run();
            } else {
              toggle("typewriter");
            }
          }}
          aria-expanded={openPopover === "typewriter"}
          title="Typewriter"
        >
          <TypewriterIcon fontSize="inherit" />
        </button>
        {openPopover === "typewriter" && (
          <TypewriterPopover
            editor={editor}
            onClose={() => setOpenPopover(null)}
          />
        )}
      </div>
      <span className={styles.divider} aria-hidden="true" />
      <div className={styles.popoverAnchor}>
        <button
          className={btn("image")}
          onClick={() => toggle("image")}
          aria-expanded={openPopover === "image"}
          title="Add Image"
        >
          <ImageIcon fontSize="inherit" />
        </button>
        {openPopover === "image" && (
          <ImagePopover editor={editor} onClose={() => setOpenPopover(null)} />
        )}
      </div>
    </div>
  );
}

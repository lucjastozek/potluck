import { useEditorState, type Editor } from "@tiptap/react";
import { useState } from "react";
import styles from "@/components/editor/Toolbar.module.css";
import { useViewportDimensions } from "@/hooks/useViewportDimensions";
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
import ImageUpload from "@/components/upload/ImageUpload";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import ItalicIcon from "@mui/icons-material/FormatItalic";
import BoldIcon from "@mui/icons-material/FormatBold";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

export default function Toolbar({
  editor,
  compact = false,
  onPinChange,
}: {
  editor: Editor | null;
  compact?: boolean;
  onPinChange?: (pinned: boolean) => void;
}): JSX.Element | null {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const { width } = useViewportDimensions();
  useEditorState({
    editor,
    selector: (ctx) => {
      if (ctx.editor) {
        return ctx.editor.state;
      }
    },
  });

  if (!editor) return null;

  const isMobile = width <= 720;
  const useMobileRail = isMobile;

  const handlePin = () => {
    const next = !pinned;
    setPinned(next);
    onPinChange?.(next);
  };

  const toggle = (name: string) =>
    setOpenPopover((prev) => (prev === name ? null : name));

  const closePopover = () => setOpenPopover(null);

  const btn = (name: string, attrs?: Record<string, unknown>) =>
    editor.isActive(name, attrs)
      ? `${styles.toolbarButton} ${styles.toolbarButtonActive}`
      : styles.toolbarButton;

  const isAnyEffectActive = (effects: string[]) =>
    effects.some((effect) => editor.isActive(effect));

  const isEffectDisabled = (effect: string, conflicts: string[]) =>
    !editor.isActive(effect) && isAnyEffectActive(conflicts);

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

  const railDivider = (
    <span className={styles.toolbarRailDivider} aria-hidden="true" />
  );

  if (useMobileRail) {
    return (
      <div
        className={`${styles.toolbar} ${styles.toolbarMobileShell} ${compact ? styles.toolbarMobileShellCompact : ""}`}
        role="toolbar"
        aria-label="Text formatting"
      >
        <div className={styles.toolbarRail}>
          <button
            className={`${styles.toolbarButton} ${pinned ? styles.toolbarPinButtonActive : ""} ${styles.toolbarPinButton}`}
            onClick={handlePin}
            title={pinned ? "Unpin toolbar" : "Pin toolbar open"}
            aria-label={pinned ? "Unpin toolbar" : "Pin toolbar open"}
            aria-pressed={pinned}
          >
            {pinned ? (
              <PushPinIcon fontSize="inherit" />
            ) : (
              <PushPinOutlinedIcon fontSize="inherit" />
            )}
          </button>
          <button
            className={btn("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
            aria-label="Bold"
          >
            <BoldIcon fontSize="inherit" />
          </button>
          <button
            className={btn("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
            aria-label="Italic"
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
                  closePopover();
                } else {
                  toggle("strikeColor");
                }
              }}
              aria-expanded={openPopover === "strikeColor"}
              title="Strikethrough color"
              aria-label="Strikethrough color"
            >
              <StrikethroughSIcon fontSize="inherit" />
            </button>

            {openPopover === "strikeColor" && (
              <StrikeColorPopover editor={editor} onClose={closePopover} />
            )}
          </div>

          {railDivider}

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
              aria-label="Color"
            >
              <FormatColorTextIcon fontSize="inherit" />
            </button>
            {openPopover === "color" && (
              <ColorPopover editor={editor} onClose={closePopover} />
            )}
          </div>

          <button
            className={btn("rainbow")}
            disabled={isEffectDisabled("rainbow", [
              "color",
              "glitter",
              "shake",
              "typewriter",
              "wave",
            ])}
            onClick={(e) => {
              e.preventDefault();
              if (editor.isActive("rainbow")) {
                editor.chain().focus().unsetRainbow().run();
              } else {
                editor.chain().focus().setRainbow().run();
              }
            }}
            title="Rainbow"
            aria-label="Rainbow"
          >
            🌈
          </button>

          <div className={styles.popoverAnchor}>
            <button
              className={btn("glitter")}
              disabled={isEffectDisabled("glitter", [
                "color",
                "rainbow",
                "shake",
                "typewriter",
                "wave",
              ])}
              onClick={() => {
                if (editor.isActive("glitter")) {
                  editor.chain().focus().unsetGlitter().run();
                  closePopover();
                } else {
                  toggle("glitter");
                }
              }}
              aria-expanded={openPopover === "glitter"}
              title="Glitter"
              aria-label="Glitter"
            >
              <GlitterIcon fontSize="inherit" />
            </button>
            {openPopover === "glitter" && (
              <GlitterPopover editor={editor} onClose={closePopover} />
            )}
          </div>

          {railDivider}

          <div className={styles.popoverAnchor}>
            <button
              className={btn("highlight")}
              disabled={isEffectDisabled("highlight", ["rainbow", "glitter"])}
              onClick={() => {
                if (editor.isActive("highlight")) {
                  editor.chain().focus().unsetHighlight().run();
                } else {
                  toggle("highlight");
                }
              }}
              aria-expanded={openPopover === "highlight"}
              title="Highlight"
              aria-label="Highlight"
            >
              <HighlightIcon fontSize="inherit" />
            </button>
            {openPopover === "highlight" && (
              <HighlightPopover editor={editor} onClose={closePopover} />
            )}
          </div>

          <button
            className={btn("code")}
            disabled={isEffectDisabled("code", ["rainbow", "glitter"])}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Code"
            aria-label="Code"
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
            aria-label="Spoiler"
          >
            <SpoilerIcon fontSize="inherit" />
          </button>

          {railDivider}

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
              aria-label="Outline"
            >
              <OutlineIcon fontSize="inherit" />
            </button>
            {openPopover === "outline" && (
              <OutlinePopover editor={editor} onClose={closePopover} />
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
              aria-label="Neon"
            >
              <NeonIcon fontSize="inherit" />
            </button>
            {openPopover === "neon" && (
              <NeonPopover editor={editor} onClose={closePopover} />
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
              aria-label="Shadow"
            >
              <ShadowIcon fontSize="inherit" />
            </button>
            {openPopover === "shadow" && (
              <ShadowPopover editor={editor} onClose={closePopover} />
            )}
          </div>

          {railDivider}

          <div className={styles.popoverAnchor}>
            <button
              className={btn("shake")}
              disabled={isEffectDisabled("shake", [
                "wavy",
                "typewriter",
                "rainbow",
                "glitter",
              ])}
              onClick={() => {
                if (editor.isActive("shake")) {
                  editor.chain().focus().unsetShake().run();
                } else {
                  toggle("shake");
                }
              }}
              aria-expanded={openPopover === "shake"}
              title="Shake"
              aria-label="Shake"
            >
              <ShakeIcon fontSize="inherit" />
            </button>
            {openPopover === "shake" && (
              <ShakePopover editor={editor} onClose={closePopover} />
            )}
          </div>

          <button
            className={btn("wavy")}
            disabled={isEffectDisabled("wavy", [
              "shake",
              "typewriter",
              "rainbow",
              "glitter",
            ])}
            onClick={(e) => {
              e.preventDefault();
              if (editor.isActive("wavy")) {
                editor.chain().focus().unsetWavy().run();
              } else {
                editor.chain().focus().setWavy().run();
              }
            }}
            title="Wave"
            aria-label="Wave"
          >
            <WaveIcon fontSize="inherit" />
          </button>

          <div className={styles.popoverAnchor}>
            <button
              className={btn("typewriter")}
              disabled={isEffectDisabled("typewriter", [
                "shake",
                "wavy",
                "rainbow",
                "glitter",
              ])}
              onClick={() => {
                if (editor.isActive("typewriter")) {
                  editor.chain().focus().unsetTypewriter().run();
                } else {
                  toggle("typewriter");
                }
              }}
              aria-expanded={openPopover === "typewriter"}
              title="Typewriter"
              aria-label="Typewriter"
            >
              <TypewriterIcon fontSize="inherit" />
            </button>
            {openPopover === "typewriter" && (
              <TypewriterPopover editor={editor} onClose={closePopover} />
            )}
          </div>

          {railDivider}

          <ImageUpload
            onUploaded={(url) => {
              editor
                .chain()
                .focus()
                .insertImage({
                  src: url,
                  alt: "",
                  widthPercent: 50,
                  wrap: "none",
                })
                .run();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.toolbar} ${compact ? styles.toolbarCompact : ""}`}
      role="toolbar"
      aria-label="Text formatting"
    >
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
        disabled={isEffectDisabled("rainbow", [
          "color",
          "glitter",
          "shake",
          "typewriter",
          "wave",
        ])}
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
          disabled={isEffectDisabled("glitter", [
            "color",
            "rainbow",
            "shake",
            "typewriter",
            "wave",
          ])}
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
          disabled={isEffectDisabled("highlight", ["rainbow", "glitter"])}
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
        disabled={isEffectDisabled("code", ["rainbow", "glitter"])}
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
          disabled={isEffectDisabled("shake", [
            "wavy",
            "typewriter",
            "rainbow",
            "glitter",
          ])}
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
        disabled={isEffectDisabled("wavy", [
          "shake",
          "typewriter",
          "rainbow",
          "glitter",
        ])}
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
          disabled={isEffectDisabled("typewriter", [
            "shake",
            "wavy",
            "rainbow",
            "glitter",
          ])}
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
      <ImageUpload
        onUploaded={(url) => {
          editor
            .chain()
            .focus()
            .insertImage({
              src: url,
              alt: "",
              widthPercent: 50,
              wrap: "none",
            })
            .run();
        }}
      />
    </div>
  );
}

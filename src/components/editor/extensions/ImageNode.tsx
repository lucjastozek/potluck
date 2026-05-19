import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import { useRef, useEffect } from "react";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import SquareIcon from "@mui/icons-material/Square";
import styles from "@/components/editor/extensions/ImageNode.module.css";
import {
  FramedImage,
  type FramePreset,
  type FrameShape,
  type PresetDef,
} from "@/components/renderer/effects/WrappedImage/FramedImage";
import { FRAME_PRESETS } from "@/components/renderer/effects/WrappedImage/framePresets";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      insertImage: (attrs: {
        src: string;
        alt?: string;
        widthPercent?: number;
        wrap?: "left" | "right" | "none";
      }) => ReturnType;
    };
  }
}

const FRAME_SHAPES: { label: string; value: FrameShape; icon: string }[] = [
  { label: "Rectangle", value: "rectangle", icon: "▭" },
  { label: "Circle", value: "circle", icon: "◯" },
  { label: "Star", value: "star", icon: "✦" },
  { label: "Blob", value: "blob", icon: "⬡" },
];

function ImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const {
    src,
    alt,
    widthPercent,
    wrap = "none",
    framePreset = null,
    frameShape = "rectangle",
  } = node.attrs;

  const figureRef = useRef<HTMLDivElement>(null);
  const isFloat = wrap === "left" || wrap === "right";

  const handleFigureClick = (e: React.MouseEvent<HTMLElement>) => {
    // Allow deselecting by clicking on the figure background (outside the image and controls)
    if (selected && e.currentTarget === e.target) {
      // Click is on the figure itself, not a child element - deselect
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Click elsewhere in the editor to deselect
        const editor = figureRef.current?.closest(
          ".ProseMirror",
        ) as HTMLElement;
        if (editor) {
          editor.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  const handleResizeStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selected) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidth = widthPercent || 50;
    const editorEl = figureRef.current?.closest(".ProseMirror") as HTMLElement;
    const editorWidth = editorEl?.clientWidth || 600;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const deltaPercent = (delta / editorWidth) * 100;
      const newPercent = Math.max(10, Math.min(100, startWidth + deltaPercent));
      updateAttributes({ widthPercent: Math.round(newPercent) });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const figureStyle: React.CSSProperties = {
    float: isFloat ? wrap : undefined,
    width: `${widthPercent || 50}%`,
    margin: isFloat
      ? wrap === "left"
        ? "0.5rem 1rem 0.5rem 0"
        : "0.5rem 0 0.5rem 1rem"
      : "0.5rem auto",
    display: isFloat ? undefined : "block",
    position: "relative",
  };

  return (
    <NodeViewWrapper
      ref={figureRef}
      as="figure"
      style={figureStyle}
      className={`${styles.figure} ${selected ? styles.selected : ""}`}
      contentEditable={false}
      onClick={handleFigureClick}
    >
      <div
        className={styles.imageWrapper}
        style={framePreset ? { overflow: "visible" } : undefined}
      >
        {framePreset ? (
          <FramedImage
            src={src}
            alt={alt}
            framePreset={framePreset as FramePreset}
            frameShape={frameShape as FrameShape}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            crossOrigin="anonymous"
            className={styles.image}
          />
        )}
      </div>

      {selected && (
        <>
          <button
            className={styles.resizeHandle}
            onMouseDown={handleResizeStart}
            title="Drag to resize"
            type="button"
          />
          <div className={styles.controls}>
            {/* Float controls */}
            <div className={styles.controlGroup}>
              <button
                className={`${styles.controlBtn} ${wrap === "left" ? styles.controlBtnActive : ""}`}
                onClick={() => updateAttributes({ wrap: "left" })}
                type="button"
                title="Float left"
              >
                <WestIcon fontSize="small" />
              </button>
              <button
                className={`${styles.controlBtn} ${wrap === "none" ? styles.controlBtnActive : ""}`}
                onClick={() => updateAttributes({ wrap: "none" })}
                type="button"
                title="Block"
              >
                <SquareIcon fontSize="small" />
              </button>
              <button
                className={`${styles.controlBtn} ${wrap === "right" ? styles.controlBtnActive : ""}`}
                onClick={() => updateAttributes({ wrap: "right" })}
                type="button"
                title="Float right"
              >
                <EastIcon fontSize="small" />
              </button>
            </div>

            <div className={styles.divider} />

            {/* Frame preset buttons */}
            <div
              className={styles.controlGroup}
              style={{ flexWrap: "wrap", gap: "0.3rem" }}
            >
              {(
                Object.entries(FRAME_PRESETS) as [FramePreset, PresetDef][]
              ).map(([key, { label }]) => (
                <button
                  key={key}
                  className={`${styles.controlBtn} ${framePreset === key ? styles.controlBtnActive : ""}`}
                  onClick={() => updateAttributes({ framePreset: key })}
                  title={label}
                  type="button"
                  style={{
                    fontSize: "0.55rem",
                    padding: "0.1rem 0.3rem",
                    aspectRatio: "unset",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </button>
              ))}
              {framePreset && (
                <button
                  className={styles.controlBtn}
                  onClick={() => updateAttributes({ framePreset: null })}
                  title="Remove frame"
                  type="button"
                  style={{
                    fontSize: "0.55rem",
                    padding: "0.1rem 0.3rem",
                    aspectRatio: "unset",
                    marginLeft: "0.3rem",
                    color: "var(--red)",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Shape controls — only when a frame is active */}
            {framePreset && (
              <div className={styles.controlGroup}>
                {FRAME_SHAPES.map(({ label, value, icon }) => (
                  <button
                    key={value}
                    className={`${styles.controlBtn} ${frameShape === value ? styles.controlBtnActive : ""}`}
                    onClick={() => updateAttributes({ frameShape: value })}
                    title={label}
                    type="button"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </NodeViewWrapper>
  );
}

export const ImageNode = Node.create({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      widthPercent: { default: 50 },
      wrap: { default: "none" },
      framePreset: { default: null },
      frameShape: { default: "rectangle" },
    };
  },

  parseHTML() {
    return [{ tag: "figure[data-image]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes(HTMLAttributes, { "data-image": "" }),
      ["img", { src: HTMLAttributes.src, alt: HTMLAttributes.alt }],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },

  addCommands() {
    return {
      insertImage:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: "image", attrs }),
    };
  },
});

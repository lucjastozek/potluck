import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import { useRef } from "react";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import SquareIcon from "@mui/icons-material/Square";
import styles from "@/components/editor/extensions/ImageNode.module.css";

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

function ImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const { src, alt, widthPercent, wrap = "none" } = node.attrs;
  const figureRef = useRef<HTMLDivElement>(null);
  const isFloat = wrap === "left" || wrap === "right";

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

  const handleButtonClick = (w: "left" | "right" | "none") => {
    updateAttributes({ wrap: w });
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
    >
      <div className={styles.imageWrapper}>
        <img
          src={src}
          alt={alt}
          crossOrigin="anonymous"
          className={styles.image}
        />
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
            <div className={styles.controlGroup}>
              <button
                className={`${styles.controlBtn} ${wrap === "left" ? styles.controlBtnActive : ""}`}
                onClick={() => handleButtonClick("left")}
                type="button"
                title="Float left"
              >
                <WestIcon fontSize="small" />
              </button>
              <button
                className={`${styles.controlBtn} ${wrap === "none" ? styles.controlBtnActive : ""}`}
                onClick={() => handleButtonClick("none")}
                type="button"
                title="Block"
              >
                <SquareIcon fontSize="small" />
              </button>
              <button
                className={`${styles.controlBtn} ${wrap === "right" ? styles.controlBtnActive : ""}`}
                onClick={() => handleButtonClick("right")}
                type="button"
                title="Float right"
              >
                <EastIcon fontSize="small" />
              </button>
            </div>
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

import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import { useState } from "react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    spoiler: {
      setSpoiler: () => ReturnType;
      unsetSpoiler: () => ReturnType;
    };
  }
}

function SpoilerView({ node }: NodeViewProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <NodeViewWrapper as="span" contentEditable={false}>
      <button
        type="button"
        className={`spoilerButton ${revealed ? "spoilerRevealed" : "spoilerHidden"}`}
        aria-pressed={revealed}
        title={revealed ? "Click to hide" : "Click to reveal"}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setRevealed((v) => !v)}
      >
        {node.attrs.text}
      </button>
    </NodeViewWrapper>
  );
}

export const SpoilerNode = Node.create({
  name: "spoiler",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      text: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "span.spoiler" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { class: "spoiler" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SpoilerView);
  },

  addCommands() {
    return {
      setSpoiler:
        () =>
        ({ editor, commands }) => {
          const { from, to } = editor.state.selection;
          const text = editor.state.doc.textBetween(from, to);
          if (!text) return false;
          return commands.insertContentAt(
            { from, to },
            { type: "spoiler", attrs: { text } },
          );
        },
      unsetSpoiler:
        () =>
        ({ editor, commands }) => {
          const { from } = editor.state.selection;
          const node = editor.state.doc.nodeAt(from);
          if (node?.type.name !== "spoiler") return false;
          return commands.insertContentAt(
            { from, to: from + node.nodeSize },
            node.attrs.text,
          );
        },
    };
  },
});

import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    rainbow: {
      setRainbow: () => ReturnType;
      unsetRainbow: () => ReturnType;
    };
  }
}

function RainbowView({ node }: NodeViewProps) {
  return (
    <NodeViewWrapper as="span" className="rainbow" contentEditable={false}>
      {node.attrs.text}
    </NodeViewWrapper>
  );
}

export const RainbowNode = Node.create({
  name: "rainbow",
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
    return [{ tag: "span.rainbow" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { class: "rainbow" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(RainbowView);
  },

  addCommands() {
    return {
      setRainbow:
        () =>
        ({ editor, commands }) => {
          const { from, to } = editor.state.selection;
          const text = editor.state.doc.textBetween(from, to);
          if (!text) return false;
          return commands.insertContentAt(
            { from, to },
            { type: "rainbow", attrs: { text } },
          );
        },
      unsetRainbow:
        () =>
        ({ editor, commands }) => {
          const { from } = editor.state.selection;
          const node = editor.state.doc.nodeAt(from);
          if (node?.type.name !== "rainbow") return false;
          return commands.insertContentAt(
            { from, to: from + node.nodeSize },
            node.attrs.text,
          );
        },
    };
  },
});

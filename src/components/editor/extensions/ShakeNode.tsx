import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    shake: {
      setShake: (attrs?: { intensity?: "low" | "high" }) => ReturnType;
      unsetShake: () => ReturnType;
    };
  }
}

function ShakeView({ node }: NodeViewProps) {
  const duration = node.attrs.intensity === "high" ? "0.3s" : "0.5s";
  return (
    <NodeViewWrapper
      as="span"
      className="shakeText"
      contentEditable={false}
      style={{ "--shake-duration": duration } as React.CSSProperties}
    >
      {node.attrs.text}
    </NodeViewWrapper>
  );
}

export const ShakeNode = Node.create({
  name: "shake",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      text: { default: "" },
      intensity: { default: "low" },
    };
  },

  parseHTML() {
    return [{ tag: "span.shakeText" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { class: "shakeText" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ShakeView);
  },

  addCommands() {
    return {
      setShake:
        (attrs = {}) =>
        ({ editor, commands }) => {
          const { from, to } = editor.state.selection;
          const text = editor.state.doc.textBetween(from, to);
          if (!text) return false;
          return commands.insertContentAt(
            { from, to },
            {
              type: "shake",
              attrs: { text, intensity: attrs.intensity ?? "low" },
            },
          );
        },
      unsetShake:
        () =>
        ({ editor, commands }) => {
          const { from } = editor.state.selection;
          const node = editor.state.doc.nodeAt(from);
          if (node?.type.name !== "shake") return false;
          return commands.insertContentAt(
            { from, to: from + node.nodeSize },
            node.attrs.text,
          );
        },
    };
  },
});

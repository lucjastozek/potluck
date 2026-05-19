import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    glitter: {
      setGlitter: (attrs?: { hue?: string; color?: string }) => ReturnType;
      unsetGlitter: () => ReturnType;
    };
  }
}

function GlitterView({ node }: NodeViewProps) {
  return (
    <NodeViewWrapper
      as="span"
      className="glitter"
      contentEditable={false}
      style={{ "--glitter-hue": node.attrs.hue } as React.CSSProperties}
    >
      {node.attrs.text}
    </NodeViewWrapper>
  );
}

export const GlitterNode = Node.create({
  name: "glitter",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      text: { default: "" },
      hue: { default: "0deg" },
      color: { default: "var(--fg)" },
    };
  },

  parseHTML() {
    return [{ tag: "span.glitter" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { class: "glitter" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(GlitterView);
  },

  addCommands() {
    return {
      setGlitter:
        (attrs: { hue?: string; color?: string } = {}) =>
        ({ editor, commands }) => {
          const { from, to } = editor.state.selection;
          const text = editor.state.doc.textBetween(from, to);
          if (!text) return false;
          return commands.insertContentAt(
            { from, to },
            {
              type: "glitter",
              attrs: {
                text,
                hue: attrs.hue ?? "0deg",
                color: attrs.color ?? "var(--fg)",
              },
            },
          );
        },
      unsetGlitter:
        () =>
        ({ editor, commands }) => {
          const { from } = editor.state.selection;
          const node = editor.state.doc.nodeAt(from);
          if (node?.type.name !== "glitter") return false;
          return commands.insertContentAt(
            { from, to: from + node.nodeSize },
            node.attrs.text,
          );
        },
    };
  },
});

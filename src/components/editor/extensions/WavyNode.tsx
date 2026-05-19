import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    wavy: {
      setWavy: () => ReturnType;
      unsetWavy: () => ReturnType;
    };
  }
}

function WavyView({ node }: NodeViewProps) {
  const text = node.attrs.text as string;

  return (
    <NodeViewWrapper as="span" contentEditable={false}>
      <span className="wavyText" aria-label={text}>
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="wavyLetter"
            style={{ "--wavy-delay": `${i * 0.05}s` } as React.CSSProperties}
            aria-hidden="true"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </NodeViewWrapper>
  );
}

export const WavyNode = Node.create({
  name: "wavy",
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
    return [{ tag: "span.wavyText" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { class: "wavyText" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(WavyView);
  },

  addCommands() {
    return {
      setWavy:
        () =>
        ({ editor, commands }) => {
          const { from, to } = editor.state.selection;
          const text = editor.state.doc.textBetween(from, to);
          if (!text) return false;
          return commands.insertContentAt(
            { from, to },
            { type: "wavy", attrs: { text } },
          );
        },
      unsetWavy:
        () =>
        ({ editor, commands }) => {
          const { from } = editor.state.selection;
          const node = editor.state.doc.nodeAt(from);
          if (node?.type.name !== "wavy") return false;
          return commands.insertContentAt(
            { from, to: from + node.nodeSize },
            node.attrs.text,
          );
        },
    };
  },
});

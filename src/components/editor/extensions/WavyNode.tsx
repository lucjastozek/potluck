import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
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

function getNodeRange(editor: NodeViewProps["editor"], typeName: string) {
  const { $from } = editor.state.selection;

  for (let depth = $from.depth; depth >= 0; depth--) {
    if ($from.node(depth).type.name === typeName) {
      return {
        from: $from.before(depth),
        to: $from.after(depth),
        text: $from.node(depth).textContent,
      };
    }
  }

  return null;
}

function WavyView({ node }: NodeViewProps) {
  const text = node.textContent;

  return (
    <NodeViewWrapper as="div" className="wavyNode">
      <NodeViewContent className="wavyContent" />
      <span className="wavyText" aria-hidden="true">
        {text.split("").map((char, index) => (
          <span
            key={`${char}-${index}`}
            className="wavyLetter"
            style={{ ["--wavy-delay" as string]: `${index * 0.05}s` }}
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
  selectable: true,

  content: "text*",

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
            { type: "wavy", content: [{ type: "text", text }] },
          );
        },
      unsetWavy:
        () =>
        ({ editor, commands }) => {
          const range = getNodeRange(editor, "wavy");
          if (!range) return false;
          return commands.insertContentAt(
            { from: range.from, to: range.to },
            range.text,
          );
        },
    };
  },
});

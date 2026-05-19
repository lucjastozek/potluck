import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import { useEffect, useState } from "react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    typewriter: {
      setTypewriter: (attrs?: { speed?: number }) => ReturnType;
      unsetTypewriter: () => ReturnType;
    };
  }
}

function TypewriterView({ node }: NodeViewProps) {
  const text = node.attrs.text as string;
  const speed = Number(node.attrs.speed ?? 50);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayed("");
    const timer = window.setInterval(
      () => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) window.clearInterval(timer);
      },
      Number.isNaN(speed) ? 50 : speed,
    );
    return () => window.clearInterval(timer);
  }, [text, speed]);

  return (
    <NodeViewWrapper as="span" contentEditable={false}>
      <span className="typewriterText" aria-live="polite" aria-label={text}>
        {displayed}
        <span className="typewriterCursor" aria-hidden="true">
          |
        </span>
      </span>
    </NodeViewWrapper>
  );
}

export const TypewriterNode = Node.create({
  name: "typewriter",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      text: { default: "" },
      speed: { default: 50 },
    };
  },

  parseHTML() {
    return [{ tag: "span.typewriterText" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { class: "typewriterText" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TypewriterView);
  },

  addCommands() {
    return {
      setTypewriter:
        (attrs = {}) =>
        ({ editor, commands }) => {
          const { from, to } = editor.state.selection;
          const text = editor.state.doc.textBetween(from, to);
          if (!text) return false;
          return commands.insertContentAt(
            { from, to },
            { type: "typewriter", attrs: { text, speed: attrs.speed ?? 50 } },
          );
        },
      unsetTypewriter:
        () =>
        ({ editor, commands }) => {
          const { from } = editor.state.selection;
          const node = editor.state.doc.nodeAt(from);
          if (node?.type.name !== "typewriter") return false;
          return commands.insertContentAt(
            { from, to: from + node.nodeSize },
            node.attrs.text,
          );
        },
    };
  },
});

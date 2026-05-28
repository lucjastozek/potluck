import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
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

function TypewriterView({ node }: NodeViewProps) {
  const text = node.textContent;
  const speed = Number(node.attrs.speed ?? 50);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayed("");
    const timer = window.setInterval(
      () => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          window.clearInterval(timer);
        }
      },
      Number.isNaN(speed) ? 50 : speed,
    );
    return () => window.clearInterval(timer);
  }, [text, speed]);

  return (
    <NodeViewWrapper as="span" className="typewriterNode">
      <NodeViewContent
        as={"span" as unknown as "div"}
        className="typewriterContent"
      />
      <span className="typewriterText" aria-hidden="true">
        {displayed}
        <span className="typewriterCursor">|</span>
      </span>
    </NodeViewWrapper>
  );
}

export const TypewriterNode = Node.create({
  name: "typewriter",

  group: "inline",
  inline: true,
  selectable: true,

  content: "text*",

  addAttributes() {
    return {
      speed: { default: 50 },
    };
  },

  parseHTML() {
    return [{ tag: "span.typewriterText" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "typewriterText",
      }),
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
            {
              type: "typewriter",
              attrs: { speed: attrs.speed ?? 50 },
              content: [{ type: "text", text }],
            },
          );
        },
      unsetTypewriter:
        () =>
        ({ editor, commands }) => {
          const range = getNodeRange(editor, "typewriter");
          if (!range) return false;
          return commands.insertContentAt(
            { from: range.from, to: range.to },
            range.text,
          );
        },
    };
  },
});

import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    highlight: {
      setHighlight: (attrs: { color: string }) => ReturnType;
      unsetHighlight: () => ReturnType;
    };
  }
}

export const HighlightMark = Mark.create({
  name: "highlight",

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-highlight-color"),
        renderHTML: (attrs) => {
          const color = attrs.color ?? "var(--yellow)";
          return {
            "data-highlight-color": color,
            style: `background-color: ${color};padding: 0 0.1875rem;border-radius: 0.125rem;`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "mark[data-highlight-color]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["mark", mergeAttributes(HTMLAttributes, { class: "highlight" }), 0];
  },

  addCommands() {
    return {
      setHighlight:
        (attrs) =>
        ({ commands }) =>
          commands.setMark(this.name, attrs),
      unsetHighlight:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

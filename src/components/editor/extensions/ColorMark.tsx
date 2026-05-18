import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    color: {
      setColor: (attrs: { color: string }) => ReturnType;
      unsetColor: () => ReturnType;
    };
  }
}

export const ColorMark = Mark.create({
  name: "color",

  addAttributes() {
    return {
      color: {
        default: "var(--fg)",
        parseHTML: (el) => el.getAttribute("data-text-color"),
        renderHTML: (attrs) => {
          const color = attrs.color ?? "gold";
          return {
            "data-text-color": color,
            style: `color: ${color};`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-text-color]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { class: "text-color" }),
      0,
    ];
  },

  addCommands() {
    return {
      setColor:
        (attrs) =>
        ({ commands }) =>
          commands.setMark(this.name, attrs),
      unsetColor:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

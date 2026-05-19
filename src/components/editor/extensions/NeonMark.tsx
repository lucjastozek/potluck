import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    neon: {
      setNeon: (attrs: { color: string }) => ReturnType;
      unsetNeon: () => ReturnType;
    };
  }
}

export const NeonMark = Mark.create({
  name: "neon",
  group: "textOutline",
  excludes: "outline",

  addAttributes() {
    return {
      color: {
        default: "var(--abspink)",
        parseHTML: (el) => el.getAttribute("data-neon-color"),
        renderHTML: (attrs) => ({
          "data-neon-color": attrs.color,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-neon-color]" }];
  },

  renderHTML({ mark, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "neonText",
        style: `--neon-color: ${mark.attrs.color ?? "var(--abspink)"};`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setNeon:
        (attrs) =>
        ({ commands }) =>
          commands.setMark(this.name, attrs),
      unsetNeon:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

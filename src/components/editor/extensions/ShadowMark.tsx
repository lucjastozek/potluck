import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    shadow: {
      setShadow: (attrs: {
        x: number;
        y: number;
        blur: number;
        color: string;
      }) => ReturnType;
      unsetShadow: () => ReturnType;
    };
  }
}

export const ShadowMark = Mark.create({
  name: "shadow",

  addAttributes() {
    return {
      color: {
        default: "var(--blue)",
        parseHTML: (el) => el.getAttribute("data-shadow-color"),
        renderHTML: (attrs) => ({ "data-shadow-color": attrs.color }),
      },
      x: {
        default: 4,
        parseHTML: (el) => el.getAttribute("data-shadow-x"),
        renderHTML: (attrs) => ({ "data-shadow-x": attrs.x }),
      },
      y: {
        default: 4,
        parseHTML: (el) => el.getAttribute("data-shadow-y"),
        renderHTML: (attrs) => ({ "data-shadow-y": attrs.y }),
      },
      blur: {
        default: 0,
        parseHTML: (el) => el.getAttribute("data-shadow-blur"),
        renderHTML: (attrs) => ({ "data-shadow-blur": attrs.blur }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-shadow]" }];
  },

  renderHTML({ mark, HTMLAttributes }) {
    const { color, x, y, blur } = mark.attrs;
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "shadow",
        style: `text-shadow: ${x ?? 4}px ${y ?? 4}px ${blur ?? 0}px ${color ?? "var(--blue)"};`,
      }),
      0,
    ];
  },
  addCommands() {
    return {
      setShadow:
        (attrs) =>
        ({ commands }) =>
          commands.setMark(this.name, attrs),
      unsetShadow:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

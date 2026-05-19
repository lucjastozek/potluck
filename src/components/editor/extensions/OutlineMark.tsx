import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    outline: {
      setOutline: (attrs: { color: string; width: number }) => ReturnType;
      unsetOutline: () => ReturnType;
    };
  }
}

export const OutlineMark = Mark.create({
  name: "outline",

  addAttributes() {
    return {
      color: {
        default: "var(--fg)",
        parseHTML: (el) => el.getAttribute("data-outline-color"),
        renderHTML: (attrs) => ({ "data-outline-color": attrs.color }),
      },
      width: {
        default: 1,
        parseHTML: (el) => el.getAttribute("data-outline-width"),
        renderHTML: (attrs) => ({ "data-outline-width": attrs.width }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-outline]" }];
  },

  renderHTML({ mark, HTMLAttributes }) {
    const color = mark.attrs.color ?? "var(--fg)";
    const width = mark.attrs.width ?? 1;
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "outline",
        style: `-webkit-text-stroke: 0.0${width}em ${color};`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setOutline:
        (attrs) =>
        ({ commands }) =>
          commands.setMark(this.name, attrs),
      unsetOutline:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

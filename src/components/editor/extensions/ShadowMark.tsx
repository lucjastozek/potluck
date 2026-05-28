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
        default: 1,
        parseHTML: (el) => el.getAttribute("data-shadow-x"),
        renderHTML: (attrs) => ({ "data-shadow-x": attrs.x }),
      },
      y: {
        default: 1,
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
    const parsedX = Number(x);
    const parsedY = Number(y);
    const parsedBlur = Number(blur);
    const shadowX = Number.isFinite(parsedX) ? parsedX : 1;
    const shadowY = Number.isFinite(parsedY) ? parsedY : 1;
    const shadowBlur = Number.isFinite(parsedBlur) ? parsedBlur : 0;
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "shadow",
        style: `text-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px ${color ?? "var(--blue)"};`,
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

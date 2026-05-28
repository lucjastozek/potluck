import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    glitter: {
      setGlitter: (attrs?: { hue?: string; color?: string }) => ReturnType;
      unsetGlitter: () => ReturnType;
    };
  }
}

export const GlitterNode = Mark.create({
  name: "glitter",

  addAttributes() {
    return {
      hue: { default: "0deg" },
      color: { default: "var(--fg)" },
    };
  },

  parseHTML() {
    return [{ tag: "span.glitter" }];
  },

  renderHTML({ HTMLAttributes }) {
    const hue = String(HTMLAttributes.hue ?? "0deg");
    const color = String(HTMLAttributes.color ?? "var(--fg)");
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "glitter",
        style: `--glitter-hue: ${hue}; --glitter-color: ${color};`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setGlitter:
        (attrs: { hue?: string; color?: string } = {}) =>
        ({ commands }) =>
          commands.setMark(this.name, {
            hue: attrs.hue ?? "0deg",
            color: attrs.color ?? "var(--fg)",
          }),
      unsetGlitter:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

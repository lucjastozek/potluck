import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    typewriter: {
      setTypewriter: (attrs?: { speed?: number }) => ReturnType;
      unsetTypewriter: () => ReturnType;
    };
  }
}

export const TypewriterNode = Mark.create({
  name: "typewriter",

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

  addCommands() {
    return {
      setTypewriter:
        (attrs = {}) =>
        ({ commands }) =>
          commands.setMark(this.name, { speed: attrs.speed ?? 50 }),
      unsetTypewriter:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

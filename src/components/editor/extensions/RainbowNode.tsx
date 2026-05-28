import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    rainbow: {
      setRainbow: () => ReturnType;
      unsetRainbow: () => ReturnType;
    };
  }
}

export const RainbowNode = Mark.create({
  name: "rainbow",

  parseHTML() {
    return [{ tag: "span.rainbow" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { class: "rainbow" }), 0];
  },

  addCommands() {
    return {
      setRainbow:
        () =>
        ({ commands }) =>
          commands.setMark(this.name),
      unsetRainbow:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

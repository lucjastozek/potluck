import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    wavy: {
      setWavy: () => ReturnType;
      unsetWavy: () => ReturnType;
    };
  }
}

export const WavyNode = Mark.create({
  name: "wavy",

  parseHTML() {
    return [{ tag: "span.wavyText" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { class: "wavyText" }), 0];
  },

  addCommands() {
    return {
      setWavy:
        () =>
        ({ commands }) =>
          commands.setMark(this.name),
      unsetWavy:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

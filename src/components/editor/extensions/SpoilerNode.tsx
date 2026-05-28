import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    spoiler: {
      setSpoiler: () => ReturnType;
      unsetSpoiler: () => ReturnType;
    };
  }
}

export const SpoilerNode = Mark.create({
  name: "spoiler",

  parseHTML() {
    return [{ tag: "span.spoilerButton" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "spoilerButton spoilerHidden",
        onclick: "this.classList.toggle('spoilerHidden')",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setSpoiler:
        () =>
        ({ commands }) =>
          commands.setMark(this.name),
      unsetSpoiler:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

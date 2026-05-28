import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    code: {
      setCode: () => ReturnType;
      unsetCode: () => ReturnType;
      toggleCode: () => ReturnType;
    };
  }
}

export const CodeMark = Mark.create({
  name: "code",

  parseHTML() {
    return [{ tag: "code" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["code", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setCode:
        () =>
        ({ commands }) =>
          commands.setMark(this.name),
      unsetCode:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
      toggleCode:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
    };
  },
});

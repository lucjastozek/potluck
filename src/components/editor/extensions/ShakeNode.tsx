import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    shake: {
      setShake: (attrs?: { intensity?: "low" | "high" }) => ReturnType;
      unsetShake: () => ReturnType;
    };
  }
}

export const ShakeNode = Mark.create({
  name: "shake",

  addAttributes() {
    return {
      intensity: { default: "low" },
    };
  },

  parseHTML() {
    return [{ tag: "span.shakeText" }];
  },

  renderHTML({ HTMLAttributes }) {
    const intensity = String(HTMLAttributes.intensity ?? "low");
    const duration = intensity === "high" ? "0.3s" : "0.5s";
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "shakeText",
        style: `--shake-duration: ${duration};`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setShake:
        (attrs = {}) =>
        ({ commands }) =>
          commands.setMark(this.name, {
            intensity: attrs.intensity ?? "low",
          }),
      unsetShake:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

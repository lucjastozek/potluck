import { Mark, mergeAttributes } from "@tiptap/core";

export const StrikeMark = Mark.create({
  name: "strike",

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-strike-color"),
        renderHTML: (attrs) => {
          const color = attrs.color ?? "currentColor";
          return {
            "data-strike-color": color,
            style: `text-decoration-line: line-through;text-decoration-color: ${color};`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      { tag: "s" },
      { tag: "del" },
      { tag: "strike" },
      { tag: "span[data-strike-color]" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["s", mergeAttributes(HTMLAttributes, { class: "strike" }), 0];
  },
});

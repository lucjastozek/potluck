import type { JSONContent } from "@tiptap/core";

export function serializeToMarkup(doc: JSONContent): string {
  return serializeNode(doc).trim();
}

function serializeNode(node: JSONContent): string {
  switch (node.type) {
    case "doc":
      return (node.content ?? []).map(serializeNode).join("\n");

    case "paragraph":
      return (node.content ?? []).map(serializeNode).join("");

    case "hardBreak":
      return "\n";

    case "heading": {
      const level = node.attrs?.level ?? 1;
      const inner = (node.content ?? []).map(serializeNode).join("");
      return `[h${level}]${inner}[/h${level}]`;
    }

    case "image": {
      const {
        src,
        alt = "",
        wrap = "break",
        shape = "none",
        width = "300px",
      } = node.attrs ?? {};
      return `![${src}]{wrap=${wrap},shape=${shape},width=${width},alt=${alt}}`;
    }

    case "rainbow":
      return `[rainbow]${node.attrs?.text ?? ""}[/rainbow]`;

    case "glitter":
      return `[glitter color=${node.attrs?.color ?? "var(--fg)"}]${node.attrs?.text ?? ""}[/glitter]`;

    case "text":
      return applyMarks(node.marks ?? [], node.text ?? "");

    default:
      return (node.content ?? []).map(serializeNode).join("");
  }
}

function applyMarks(
  marks: NonNullable<JSONContent["marks"]>,
  text: string,
): string {
  return [...marks]
    .reverse()
    .reduce((inner, mark) => wrapMark(mark, inner), text);
}

function wrapMark(
  mark: { type: string; attrs?: Record<string, unknown> },
  inner: string,
): string {
  const a = mark.attrs ?? {};
  switch (mark.type) {
    case "bold":
      return `[bold]${inner}[/bold]`;
    case "italic":
      return `[italic]${inner}[/italic]`;
    case "code":
      return `[code]${inner}[/code]`;
    case "strike":
      return `[strike]${inner}[/strike]`;
    case "gradient":
      return `[gradient colors=${Array.isArray(a.colors) ? a.colors.join(",") : (a.colors ?? "red,blue")} direction=${a.direction ?? "90deg"}]${inner}[/gradient]`;
    case "neon":
      return `[neon color=${a.color ?? "#ff00ff"}]${inner}[/neon]`;
    case "shadow":
      return `[shadow color=${a.color ?? "#000"} x=${a.x ?? "4px"} y=${a.y ?? "4px"} blur=${a.blur ?? "0"}]${inner}[/shadow]`;
    case "outline":
      return `[outline color=${a.color ?? "red"} width=${a.width ?? "2"}]${inner}[/outline]`;
    case "wavy":
      return `[wavy]${inner}[/wavy]`;
    case "shake":
      return `[shake]${inner}[/shake]`;
    case "highlight":
      return `[highlight color=${a.color ?? "yellow"}]${inner}[/highlight]`;
    case "sizedText":
      return `[size size=${a.size ?? "1.5em"}]${inner}[/size]`;
    case "color":
      return `[color value=${a.color ?? "inherit"}]${inner}[/color]`;
    case "spoiler":
      return `[spoiler]${inner}[/spoiler]`;
    case "typewriter":
      return `[typewriter speed=${a.speed ?? "50"}]${inner}[/typewriter]`;
    default:
      return inner;
  }
}

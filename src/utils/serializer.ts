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
        wrap = "none",
        widthPercent = 50,
        framePreset = "",
        frameShape = "rectangle",
      } = node.attrs ?? {};
      const framePart = framePreset
        ? `,framePreset=${framePreset},frameShape=${frameShape}`
        : "";
      return `![${src}]{wrap=${wrap},widthPercent=${widthPercent},alt=${alt}${framePart}}`;
    }

    case "rainbow":
      return `[rainbow]${node.attrs?.text ?? ""}[/rainbow]`;

    case "glitter":
      return `[glitter color=${node.attrs?.color ?? "var(--fg)"}]${node.attrs?.text ?? ""}[/glitter]`;

    case "shake":
      return `[shake intensity=${node.attrs?.intensity ?? "low"}]${node.attrs?.text ?? ""}[/shake]`;

    case "spoiler":
      return `[spoiler]${node.attrs?.text ?? ""}[/spoiler]`;

    case "wavy":
      return `[wavy]${node.attrs?.text ?? ""}[/wavy]`;

    case "typewriter":
      return `[typewriter speed=${node.attrs?.speed ?? 50}]${node.attrs?.text ?? ""}[/typewriter]`;

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
      return a.color && a.color !== "currentColor"
        ? `[strike color=${a.color}]${inner}[/strike]`
        : `[strike]${inner}[/strike]`;
    case "gradient":
      return `[gradient colors=${Array.isArray(a.colors) ? a.colors.join(",") : (a.colors ?? "red,blue")} direction=${a.direction ?? "90deg"}]${inner}[/gradient]`;
    case "neon":
      return `[neon color=${a.color ?? "var(--abspink)"}]${inner}[/neon]`;
    case "shadow":
      return `[shadow color=${a.color ?? "#000"} x=${a.x ?? "4px"} y=${a.y ?? "4px"} blur=${a.blur ?? "0"}]${inner}[/shadow]`;
    case "outline":
      return `[outline color=${a.color ?? "red"} width=${a.width ?? "2"}]${inner}[/outline]`;
    case "wavy":
      return `[wavy]${inner}[/wavy]`;
    case "highlight":
      return `[highlight color=${a.color ?? "var(--yellow)"}]${inner}[/highlight]`;
    case "sizedText":
      return `[size size=${a.size ?? "1.5em"}]${inner}[/size]`;
    case "color":
      return `[color value=${a.color ?? "inherit"}]${inner}[/color]`;
    case "shake":
      return a.intensity && a.intensity !== "low"
        ? `[shake intensity=${a.intensity}]${inner}[/shake]`
        : `[shake]${inner}[/shake]`;
    case "spoiler":
      return `[spoiler]${inner}[/spoiler]`;
    case "typewriter":
      return `[typewriter speed=${a.speed ?? "50"}]${inner}[/typewriter]`;
    default:
      return inner;
  }
}

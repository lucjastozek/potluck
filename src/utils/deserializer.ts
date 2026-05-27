import type { JSONContent } from "@tiptap/core";
import { tokenize } from "@/utils/renderer";
import type { Token } from "@/types";
import { cssVarToHue } from "@/utils/colorToHue";

export function deserializeFromMarkup(markup: string): JSONContent {
  if (!markup.trim()) {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }

  const sanitized = markup.replace(/\[\/?gradient[^\]]*\]/g, "");

  const tokens = tokenize(sanitized);
  const [nodes] = buildNodes(tokens, 0, null);

  const content = groupIntoParagraphs(nodes);

  return {
    type: "doc",
    content: content.length ? content : [{ type: "paragraph" }],
  };
}

type TiptapNode = JSONContent;

function buildNodes(
  tokens: Token[],
  start: number,
  stopAt: string | null,
  activeMarks: JSONContent["marks"] = [],
): [TiptapNode[], number] {
  const nodes: TiptapNode[] = [];
  let i = start;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.type === "tag" && token.closing) {
      if (stopAt && token.name === stopAt) {
        return [nodes, i + 1];
      }
      i++;
      continue;
    }

    if (token.type === "tag" && !token.closing && !token.selfClosing) {
      const { name, attrs } = token;

      if (isHeading(name)) {
        const level = parseInt(name.replace("h", ""), 10);
        const [children, next] = buildNodes(tokens, i + 1, name, activeMarks);
        nodes.push({
          type: "heading",
          attrs: { level },
          content: inlineNodesToContent(children),
        });
        i = next;
        continue;
      }

      if (name === "rainbow") {
        const [children, next] = buildNodes(tokens, i + 1, name, activeMarks);
        const text = children
          .filter((n) => n.type === "text")
          .map((n) => n.text ?? "")
          .join("");
        nodes.push({
          type: "rainbow",
          attrs: { text },
          ...(activeMarks.length ? { marks: [...activeMarks] } : {}),
        });
        i = next;
        continue;
      }

      if (name === "glitter") {
        const [children, next] = buildNodes(tokens, i + 1, name, activeMarks);
        const text = children
          .filter((n) => n.type === "text")
          .map((n) => n.text ?? "")
          .join("");
        const color = (attrs as Record<string, string>).color ?? "var(--fg)";
        const hue = cssVarToHue(color);
        nodes.push({
          type: "glitter",
          attrs: { text, color, hue },
          ...(activeMarks.length ? { marks: [...activeMarks] } : {}),
        });
        i = next;
        continue;
      }

      if (name === "spoiler") {
        const [children, next] = buildNodes(tokens, i + 1, name, activeMarks);
        const text = children
          .filter((n) => n.type === "text")
          .map((n) => n.text ?? "")
          .join("");
        nodes.push({
          type: "spoiler",
          attrs: { text },
          ...(activeMarks.length ? { marks: [...activeMarks] } : {}),
        });
        i = next;
        continue;
      }

      if (name === "wavy") {
        const [children, next] = buildNodes(tokens, i + 1, name, activeMarks);
        const text = children
          .filter((n) => n.type === "text")
          .map((n) => n.text ?? "")
          .join("");
        nodes.push({
          type: "wavy",
          attrs: { text },
          ...(activeMarks.length ? { marks: [...activeMarks] } : {}),
        });
        i = next;
        continue;
      }

      if (name === "typewriter") {
        const [children, next] = buildNodes(tokens, i + 1, name, activeMarks);
        const text = children
          .filter((n) => n.type === "text")
          .map((n) => n.text ?? "")
          .join("");
        const speed = Number((attrs as Record<string, string>).speed ?? 50);
        nodes.push({
          type: "typewriter",
          attrs: { text, speed },
          ...(activeMarks.length ? { marks: [...activeMarks] } : {}),
        });
        i = next;
        continue;
      }

      const mark = tagToMark(name, attrs as Record<string, unknown>);
      if (mark) {
        const [children, next] = buildNodes(tokens, i + 1, name, [
          ...activeMarks,
          mark,
        ]);
        nodes.push(...children);
        i = next;
        continue;
      }

      i++;
      continue;
    }

    if (token.type === "image") {
      const attrs = token.attrs as Record<string, string>;
      const widthPercent = Number(attrs.widthPercent ?? attrs.width ?? 50);
      nodes.push({
        type: "image",
        attrs: {
          src: token.url,
          alt: attrs.alt ?? "",
          wrap: attrs.wrap ?? "none",
          widthPercent: Number.isFinite(widthPercent) ? widthPercent : 50,
          framePreset: attrs.framePreset ?? null,
          frameShape: attrs.frameShape ?? "rectangle",
        },
      });
      i++;
      continue;
    }

    if (token.type === "text") {
      const lines = token.text.split("\n");
      lines.forEach((line, idx) => {
        if (line) {
          nodes.push(textNode(line, activeMarks));
        }
        if (idx < lines.length - 1) {
          nodes.push({ type: "hardBreak" });
        }
      });
      i++;
      continue;
    }

    i++;
  }

  return [nodes, i];
}

function textNode(text: string, marks: JSONContent["marks"]): TiptapNode {
  return {
    type: "text",
    text,
    ...(marks && marks.length > 0 ? { marks } : {}),
  };
}

function isHeading(name: string): boolean {
  return /^h[1-6]$/.test(name);
}

function tagToMark(
  name: string,
  attrs: Record<string, unknown>,
): NonNullable<JSONContent["marks"]>[number] | null {
  switch (name) {
    case "bold":
      return { type: "bold" };
    case "italic":
      return { type: "italic" };
    case "code":
      return { type: "code" };
    case "strike":
      return {
        type: "strike",
        attrs: { color: attrs.color ?? null },
      };
    case "shake":
      return {
        type: "shake",
        attrs: { intensity: attrs.intensity ?? "low" },
      };
    case "spoiler":
      return { type: "spoiler" };
    case "typewriter":
      return {
        type: "typewriter",
        attrs: { speed: attrs.speed ?? 50 },
      };

    case "gradient":
      return {
        type: "gradient",
        attrs: {
          colors: Array.isArray(attrs.colors)
            ? attrs.colors
            : [attrs.colors ?? "red", "blue"],
          direction: attrs.direction ?? "90deg",
        },
      };

    case "neon":
      return {
        type: "neon",
        attrs: { color: attrs.color ?? "var(--abspink)" },
      };

    case "shadow":
      return {
        type: "shadow",
        attrs: {
          color: attrs.color ?? "#000",
          x: attrs.x ?? "4px",
          y: attrs.y ?? "4px",
          blur: attrs.blur ?? "0",
        },
      };

    case "outline":
      return {
        type: "outline",
        attrs: { color: attrs.color ?? "red", width: attrs.width ?? "2" },
      };

    case "highlight":
      return {
        type: "highlight",
        attrs: { color: attrs.color ?? "var(--yellow)" },
      };

    case "size":
      return { type: "sizedText", attrs: { size: attrs.size ?? "1.5em" } };

    case "color":
      return {
        type: "color",
        attrs: { color: attrs.color ?? attrs.value ?? "inherit" },
      };

    default:
      return null;
  }
}

function groupIntoParagraphs(nodes: TiptapNode[]): TiptapNode[] {
  const result: TiptapNode[] = [];
  let inlineBuffer: TiptapNode[] = [];

  const flushBuffer = () => {
    if (inlineBuffer.length) {
      result.push({ type: "paragraph", content: inlineBuffer });
      inlineBuffer = [];
    }
  };

  for (const node of nodes) {
    if (node.type === "heading" || node.type === "image") {
      flushBuffer();
      result.push(node);
    } else if (node.type === "hardBreak") {
      flushBuffer();
    } else {
      inlineBuffer.push(node);
    }
  }

  flushBuffer();
  return result;
}

function inlineNodesToContent(nodes: TiptapNode[]): TiptapNode[] {
  return nodes.filter(
    (n) =>
      n.type === "text" ||
      n.type === "hardBreak" ||
      n.type === "rainbow" ||
      n.type === "glitter" ||
      n.type === "shake" ||
      n.type === "spoiler" ||
      n.type === "wavy" ||
      n.type === "typewriter",
  );
}

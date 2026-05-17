import type {
  EffectComponent,
  ImageComponent,
  RenderResult,
  TagAttrs,
  Token,
} from "@/types";

export function parseAttrs(attrStr = ""): TagAttrs {
  const attrs: TagAttrs = {};
  const re = /([\w-]+)=([^\s\]]+)/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(attrStr)) !== null) {
    const key = match[1];
    const value = match[2];
    attrs[key] = value.includes(",") ? value.split(",") : value;
  }

  return attrs;
}

export function parseImageAttrs(attrStr = ""): Record<string, string> {
  const attrs: Record<string, string> = {};
  const parts = attrStr.split(/,(?=[\w-]+=)/);

  for (const part of parts) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    attrs[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  }

  return attrs;
}

const TAG_RE = /\[(\/?[\w-]+)([^\]]*?)(\/?)\]/g;
const IMAGE_RE = /!\[([^\]]+)]\{([^}]*)}/g;
function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  return "";
}
export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const matches: Array<{
    index: number;
    end: number;
    type: "tag" | "image";
    closing?: boolean;
    selfClosing?: boolean;
    name?: string;
    attrs?: TagAttrs | Record<string, string>;
    url?: string;
  }> = [];
  let match: RegExpExecArray | null;

  TAG_RE.lastIndex = 0;
  IMAGE_RE.lastIndex = 0;

  while ((match = TAG_RE.exec(input)) !== null) {
    matches.push({
      index: match.index,
      end: match.index + match[0].length,
      type: "tag",
      closing: match[1].startsWith("/"),
      selfClosing: match[3] === "/",
      name: match[1].replace(/^\//, ""),
      attrs: parseAttrs(match[2]),
    });
  }

  TAG_RE.lastIndex = 0;

  while ((match = IMAGE_RE.exec(input)) !== null) {
    matches.push({
      index: match.index,
      end: match.index + match[0].length,
      type: "image",
      url: match[1],
      attrs: parseImageAttrs(match[2]),
    });
  }

  matches.sort((left, right) => left.index - right.index);

  let position = 0;
  for (const entry of matches) {
    if (entry.index < position) continue;

    if (entry.index > position) {
      tokens.push({ type: "text", text: input.slice(position, entry.index) });
    }

    if (entry.type === "tag") {
      tokens.push({
        type: "tag",
        name: entry.name!,
        attrs: entry.attrs as TagAttrs,
        closing: entry.closing!,
        selfClosing: entry.selfClosing!,
      });
    } else {
      tokens.push({
        type: "image",
        url: entry.url!,
        attrs: entry.attrs as Record<string, string>,
      });
    }

    position = entry.end;
  }

  if (position < input.length) {
    tokens.push({ type: "text", text: input.slice(position) });
  }

  return tokens;
}

function renderText(text: string, keyPrefix: string): React.ReactNode[] {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    const isLastLine = lineIndex === lines.length - 1;

    result.push(line);

    if (!isLastLine) {
      result.push(<br key={`${keyPrefix}-br-${lineIndex}`} />);
    }
  });

  return result;
}

function renderTokens(
  tokens: Token[],
  registry: Record<string, EffectComponent>,
  textOnlyTags: ReadonlySet<string>,
  imageComponent: ImageComponent | null,
  startIndex = 0,
  stopAt: string | null = null,
): RenderResult {
  const elements: React.ReactNode[] = [];
  let index = startIndex;

  while (index < tokens.length) {
    const token = tokens[index];
    const key = `n-${index}`;

    if (token.type === "tag" && token.closing) {
      if (stopAt && token.name === stopAt) {
        return [elements, index + 1];
      }

      index += 1;
      continue;
    }

    if (token.type === "tag" && token.selfClosing) {
      const Component = registry[token.name];
      if (Component) {
        elements.push(<Component key={key} attrs={token.attrs} />);
      }

      index += 1;
      continue;
    }

    if (token.type === "tag" && !token.closing) {
      const Component = registry[token.name];
      if (Component) {
        const [childElements, nextIndex] = renderTokens(
          tokens,
          registry,
          textOnlyTags,
          imageComponent,
          index + 1,
          token.name,
        );
        const children = textOnlyTags.has(token.name)
          ? extractText(childElements)
          : childElements;

        elements.push(
          <Component key={key} attrs={token.attrs}>
            {children}
          </Component>,
        );
        index = nextIndex;
      } else {
        elements.push(`[${token.name}]`);
        index += 1;
      }

      continue;
    }

    if (token.type === "image") {
      if (imageComponent) {
        const ImageComponent = imageComponent;
        elements.push(
          <ImageComponent key={key} url={token.url} attrs={token.attrs} />,
        );
      }

      index += 1;
      continue;
    }

    if (token.type === "text") {
      elements.push(...renderText(token.text, key));
      index += 1;
      continue;
    }

    index += 1;
  }

  return [elements, index];
}

export function renderMarkup(
  markup: string,
  registry: Record<string, EffectComponent>,
  textOnlyTags: ReadonlySet<string> = new Set(),
  imageComponent: ImageComponent | null = null,
): React.ReactNode[] {
  if (!markup.trim()) {
    return [];
  }

  const tokens = tokenize(markup);
  const [elements] = renderTokens(
    tokens,
    registry,
    textOnlyTags,
    imageComponent,
  );
  return elements;
}

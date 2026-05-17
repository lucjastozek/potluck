export interface TagToken {
  type: "tag";
  name: string;
  attrs: Record<string, string | string[]>;
  closing: boolean;
  selfClosing: boolean;
}

export interface ImageToken {
  type: "image";
  url: string;
  attrs: Record<string, string>;
}

export interface TextToken {
  type: "text";
  text: string;
}

export type Token = TagToken | ImageToken | TextToken;

export type RenderResult = [React.ReactNode[], number];

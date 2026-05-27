import StarterKit from "@tiptap/starter-kit";
import { ColorMark } from "@/components/editor/extensions/ColorMark";
import { StrikeMark } from "@/components/editor/extensions/StrikeMark";
import { RainbowNode } from "@/components/editor/extensions/RainbowNode";
import { GlitterNode } from "@/components/editor/extensions/GlitterNode";
import { HighlightMark } from "@/components/editor/extensions/HighlightMark";
import { OutlineMark } from "@/components/editor/extensions/OutlineMark";
import { NeonMark } from "@/components/editor/extensions/NeonMark";
import { ShadowMark } from "@/components/editor/extensions/ShadowMark";
import { ShakeNode } from "@/components/editor/extensions/ShakeNode";
import { SpoilerNode } from "@/components/editor/extensions/SpoilerNode";
import { WavyNode } from "@/components/editor/extensions/WavyNode";
import { TypewriterNode } from "@/components/editor/extensions/TypewriterNode";
import { ImageNode } from "@/components/editor/extensions/ImageNode";

export const EDITOR_EXTENSIONS = [
  StarterKit.configure({ strike: false }),
  ColorMark,
  StrikeMark,
  RainbowNode,
  GlitterNode,
  HighlightMark,
  OutlineMark,
  NeonMark,
  ShadowMark,
  ShakeNode,
  SpoilerNode,
  WavyNode,
  TypewriterNode,
  ImageNode,
];

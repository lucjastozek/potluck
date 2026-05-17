import type { EffectRegistry } from "@/types";
import GradientText from "@/components/renderer/effects/GradientText/GradientText";
import GlitterText from "@/components/renderer/effects/GlitterText/GlitterText";
import NeonText from "@/components/renderer/effects/NeonText/NeonText";
import ShadowText from "@/components/renderer/effects/ShadowText/ShadowText";
import OutlineText from "@/components/renderer/effects/OutlineText/OutlineText";
import WavyText from "@/components/renderer/effects/WavyText/WavyText";
import RainbowText from "@/components/renderer/effects/RainbowText/RainbowText";
import ShakeText from "@/components/renderer/effects/ShakeText/ShakeText";
import StrikeText from "@/components/renderer/effects/StrikeText/StrikeText";
import Highlight from "@/components/renderer/effects/Highlight/Highlight";
import SizedText from "@/components/renderer/effects/SizedText/SizedText";
import ColorText from "@/components/renderer/effects/ColorText/ColorText";
import Spoiler from "@/components/renderer/effects/Spoiler/Spoiler";
import Typewriter from "@/components/renderer/effects/Typewriter/Typewriter";
import GlitchText from "@/components/renderer/effects/GlitchText/GlitchText";
import Bold from "@/components/renderer/effects/Bold/Bold";
import Italic from "@/components/renderer/effects/Italic/Italic";
import Code from "@/components/renderer/effects/Code/Code";
import H1 from "@/components/renderer/effects/H1/H1";
import H2 from "@/components/renderer/effects/H2/H2";
import H3 from "@/components/renderer/effects/H3/H3";
import H4 from "@/components/renderer/effects/H4/H4";
import H5 from "@/components/renderer/effects/H5/H5";
import H6 from "@/components/renderer/effects/H6/H6";

export const EFFECT_REGISTRY: EffectRegistry = {
  gradient: GradientText,
  glitter: GlitterText,
  neon: NeonText,
  shadow: ShadowText,
  outline: OutlineText,
  wavy: WavyText,
  rainbow: RainbowText,
  shake: ShakeText,
  strike: StrikeText,
  highlight: Highlight,
  size: SizedText,
  color: ColorText,
  spoiler: Spoiler,
  typewriter: Typewriter,
  glitch: GlitchText,
  bold: Bold,
  italic: Italic,
  code: Code,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
};

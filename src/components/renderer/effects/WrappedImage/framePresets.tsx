import type {
  FramePreset,
  PresetDef,
} from "@/components/renderer/effects/WrappedImage/FramedImage";
import { checkersPreset } from "@/components/renderer/effects/WrappedImage/checkersPreset";
import { dotsPreset } from "@/components/renderer/effects/WrappedImage/dotsPreset";
import { rainbowPreset } from "@/components/renderer/effects/WrappedImage/rainbowPreset";
import { squigglesPreset } from "@/components/renderer/effects/WrappedImage/squigglesPreset";
import { starsPreset } from "@/components/renderer/effects/WrappedImage/starsPreset";
import { stripesPreset } from "@/components/renderer/effects/WrappedImage/stripesPreset";
import { zigzagPreset } from "@/components/renderer/effects/WrappedImage/zigzagPreset";

export const FRAME_PRESETS: Record<FramePreset, PresetDef> = {
  rainbow: rainbowPreset,
  zigzag: zigzagPreset,
  dots: dotsPreset,
  stripes: stripesPreset,
  squiggles: squigglesPreset,
  stars: starsPreset,
  checkers: checkersPreset,
};

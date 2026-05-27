import TextureIcon from "@mui/icons-material/Texture";
import styles from "@/components/renderer/effects/WrappedImage/framePresets.module.css";
import type { PresetDef } from "@/components/renderer/effects/WrappedImage/FramedImage";
import { FrameCanvas } from "@/components/renderer/effects/WrappedImage/framePresetsHelpers.tsx";

export const stripesPreset: PresetDef = {
  label: "Stripes",
  icon: TextureIcon,
  Frame: ({ shape }) => (
    <FrameCanvas
      shape={shape}
      wobbleScale={7}
      shellClassName={styles.stripesShell}
    />
  ),
};

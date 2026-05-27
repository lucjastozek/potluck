import LooksIcon from "@mui/icons-material/Looks";
import styles from "@/components/renderer/effects/WrappedImage/framePresets.module.css";
import type { PresetDef } from "@/components/renderer/effects/WrappedImage/FramedImage";
import { FrameCanvas } from "@/components/renderer/effects/WrappedImage/framePresetsHelpers.tsx";

export const rainbowPreset: PresetDef = {
  label: "Rainbow",
  icon: LooksIcon,
  Frame: ({ shape }) => (
    <FrameCanvas
      shape={shape}
      wobbleScale={8}
      shellClassName={styles.rainbowShell}
    >
      <div className={styles.rainbowOverlay} />
    </FrameCanvas>
  ),
};

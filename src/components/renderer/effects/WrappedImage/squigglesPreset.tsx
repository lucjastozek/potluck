import WavesOutlinedIcon from "@mui/icons-material/WavesOutlined";
import styles from "@/components/renderer/effects/WrappedImage/framePresets.module.css";
import type { PresetDef } from "@/components/renderer/effects/WrappedImage/FramedImage";
import { PatternFrame } from "@/components/renderer/effects/WrappedImage/framePresetsHelpers.tsx";

export const squigglesPreset: PresetDef = {
  label: "Squiggles",
  icon: WavesOutlinedIcon,
  Frame: ({ uid, shape }) => (
    <PatternFrame
      shape={shape}
      wobbleScale={10}
      shellClassName={styles.squigglesShell}
      viewBox="0 0 100 50"
      patternId={`squiggles-${uid}`}
      patternWidth="20"
      patternHeight="50"
    >
      <path
        d="M0,8 Q5,3 10,8 Q15,13 20,8"
        fill="none"
        className={styles.squigglesCherry}
      />
      <path
        d="M0,18 Q5,13 10,18 Q15,23 20,18"
        fill="none"
        className={styles.squigglesOrange}
      />
      <path
        d="M0,28 Q5,23 10,28 Q15,33 20,28"
        fill="none"
        className={styles.squigglesGreen}
      />
      <path
        d="M0,38 Q5,33 10,38 Q15,43 20,38"
        fill="none"
        className={styles.squigglesBlue}
      />
      <path
        d="M0,48 Q5,43 10,48 Q15,53 20,48"
        fill="none"
        className={styles.squigglesPurple}
      />
    </PatternFrame>
  ),
};

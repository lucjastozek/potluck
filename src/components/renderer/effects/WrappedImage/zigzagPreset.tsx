import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import styles from "@/components/renderer/effects/WrappedImage/framePresets.module.css";
import type { PresetDef } from "@/components/renderer/effects/WrappedImage/FramedImage";
import { PatternFrame } from "@/components/renderer/effects/WrappedImage/framePresetsHelpers.tsx";

export const zigzagPreset: PresetDef = {
  label: "Zigzag",
  icon: BoltOutlinedIcon,
  Frame: ({ uid, shape }) => (
    <PatternFrame
      shape={shape}
      wobbleScale={6}
      shellClassName={styles.zigzagShell}
      viewBox="0 0 100 50"
      patternId={`zigzag-${uid}`}
      patternWidth="20"
      patternHeight="50"
    >
      <polyline
        points="0,8 5,0 10,8 15,0 20,8"
        fill="none"
        className={styles.zigzagCherry}
      />
      <polyline
        points="0,18 5,10 10,18 15,10 20,18"
        fill="none"
        className={styles.zigzagOrange}
      />
      <polyline
        points="0,28 5,20 10,28 15,20 20,28"
        fill="none"
        className={styles.zigzagYellow}
      />
      <polyline
        points="0,38 5,30 10,38 15,30 20,38"
        fill="none"
        className={styles.zigzagBlue}
      />
      <polyline
        points="0,48 5,40 10,48 15,40 20,48"
        fill="none"
        className={styles.zigzagPurple}
      />
    </PatternFrame>
  ),
};

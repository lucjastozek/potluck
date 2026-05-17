import styles from "@/components/renderer/effects/GlitterText/GlitterText.module.css";
import type { EffectComponentProps } from "@/types";
import { cloneElement, isValidElement, useEffect, useState } from "react";

type GlitterTextProps = EffectComponentProps;

function colorToHSL(color: string): {
  hue: number;
  saturation: number;
  lightness: number;
} {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

  const r_ = r / 255;
  const g_ = g / 255;
  const b_ = b / 255;

  const max = Math.max(r_, g_, b_);
  const min = Math.min(r_, g_, b_);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r_:
        h = ((g_ - b_) / d + (g_ < b_ ? 6 : 0)) / 6;
        break;
      case g_:
        h = ((b_ - r_) / d + 2) / 6;
        break;
      case b_:
        h = ((r_ - g_) / d + 4) / 6;
        break;
    }
  }

  return {
    hue: Math.round(h * 360),
    saturation: s,
    lightness: l,
  };
}

export default function GlitterText({
  attrs,
  children,
}: GlitterTextProps): JSX.Element {
  const [colorValues, setColorValues] = useState({
    hue: 45,
    saturation: 1,
    lightness: 0.5,
  });

  useEffect(() => {
    const colorString = String(attrs.color ?? "gold");
    try {
      const hsl = colorToHSL(colorString);
      setColorValues(hsl);
    } catch {
      setColorValues({ hue: 45, saturation: 1, lightness: 0.5 });
    }
  }, [attrs.color]);

  const glitterStyle = {
    ["--glitter-hue" as string]: `${colorValues.hue}deg`,
    ["--glitter-saturation" as string]: String(colorValues.saturation),
    ["--glitter-brightness" as string]: String(colorValues.lightness * 2),
  };

  if (isValidElement(children)) {
    return cloneElement(children, {
      className: [children.props.className, styles.glitterText]
        .filter(Boolean)
        .join(" "),
      style: {
        ...children.props.style,
        ...glitterStyle,
      },
    });
  }

  return (
    <span
      className={styles.glitterText}
      style={{
        ...glitterStyle,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

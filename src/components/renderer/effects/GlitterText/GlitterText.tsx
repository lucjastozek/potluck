import styles from "@/components/renderer/effects/GlitterText/GlitterText.module.css";
import { colorToHSL } from "@/components/renderer/effects/GlitterText/util";
import type { EffectComponentProps } from "@/types";
import { cloneElement, isValidElement, useEffect, useState } from "react";

type GlitterTextProps = EffectComponentProps;

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

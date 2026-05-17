import styles from "@/components/renderer/effects/WrappedImage/WrappedImage.module.css";
import type { ImageComponentProps } from "@/types";

type WrappedImageProps = ImageComponentProps;

export default function WrappedImage({
  url,
  attrs,
}: WrappedImageProps): JSX.Element {
  const wrap = attrs.wrap ?? "break";
  const shape = attrs.shape ?? "none";
  const width = attrs.width ?? "300px";
  const alt = attrs.alt ?? "";
  const isFloat = wrap === "left" || wrap === "right";
  const shapeOutside =
    isFloat && shape !== "none"
      ? shape === "auto"
        ? `url(${url})`
        : shape === "circle"
          ? "circle()"
          : shape
      : undefined;

  if (!isFloat) {
    return (
      <figure
        className={`${styles.imageFigure} ${wrap === "center" ? styles.imageCentered : styles.imageBreak}`}
      >
        <img
          src={url}
          alt={alt}
          className={styles.imageWrap}
          style={{ ["--image-width" as string]: width }}
        />
      </figure>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={`${styles.imageWrap} ${wrap === "left" ? styles.imageFloatLeft : styles.imageFloatRight} ${shape !== "none" && shape !== "circle" ? styles.imageAuto : ""} ${shape === "circle" ? styles.imageCircle : ""}`}
      style={
        {
          ["--image-width" as string]: width,
          ["--image-shape-outside" as string]: shapeOutside ?? "none",
          shapeOutside,
        } as React.CSSProperties
      }
    />
  );
}

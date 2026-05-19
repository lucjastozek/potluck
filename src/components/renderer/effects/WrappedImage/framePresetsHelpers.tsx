import type { FrameShape } from "./FramedImage";

export function WobbleFilter({
  uid,
  scale = 7,
}: {
  uid: string;
  scale?: number;
}) {
  return (
    <filter id={`wobble-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.045"
        numOctaves="4"
        seed="7"
        result="noise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale={scale}
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  );
}

export function FrameShell({
  uid,
  shape,
  style,
  children,
}: {
  uid: string;
  shape: FrameShape;
  style: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const shapeStyle: Record<FrameShape, React.CSSProperties> = {
    rectangle: { borderRadius: "6px" },
    circle: { borderRadius: "50%" },
    star: {
      clipPath:
        "polygon(50% 2%, 61.3% 37%, 98% 37%, 68.5% 59%, 79.9% 94%, 50% 72%, 20.1% 94%, 31.5% 59%, 2% 37%, 38.7% 37%)",
    },
    blob: { borderRadius: "42% 58% 55% 45% / 48% 42% 58% 52%" },
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: "-12px",
        filter: `url(#wobble-${uid})`,
        zIndex: 0,
        ...shapeStyle[shape],
        ...style,
      }}
    >
      {children}
    </div>
  );
}

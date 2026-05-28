import { useEffect, useState } from "react";

export interface ViewportDimensions {
  width: number;
  height: number;
  visualHeight: number;
  keyboardOpen: boolean;
}

function readViewportDimensions(): ViewportDimensions {
  if (typeof window === "undefined") {
    return {
      width: 0,
      height: 0,
      visualHeight: 0,
      keyboardOpen: false,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const visualHeight = window.visualViewport?.height ?? height;

  return {
    width,
    height,
    visualHeight,
    keyboardOpen: width <= 720 && visualHeight < height - 90,
  };
}

export function useViewportDimensions(): ViewportDimensions {
  const [viewport, setViewport] = useState(readViewportDimensions);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateViewport = () => {
      setViewport(readViewportDimensions());
    };

    updateViewport();

    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
    };
  }, []);

  return viewport;
}

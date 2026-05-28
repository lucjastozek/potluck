let lockCount = 0;
let originalBodyStyles: {
  overflow: string;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  overscrollBehavior: string;
} | null = null;

let originalHtmlStyles: {
  overflow: string;
  overscrollBehavior: string;
} | null = null;

let lockedScrollX = 0;
let lockedScrollY = 0;

export function lockBodyScroll(): void {
  if (typeof document === "undefined") return;
  if (lockCount === 0) {
    const { body, documentElement } = document;

    originalBodyStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overscrollBehavior: body.style.overscrollBehavior,
    };

    originalHtmlStyles = {
      overflow: documentElement.style.overflow,
      overscrollBehavior: documentElement.style.overscrollBehavior,
    };

    lockedScrollX = window.scrollX;
    lockedScrollY = window.scrollY;

    documentElement.style.overflow = "hidden";
    documentElement.style.overscrollBehavior = "none";

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${lockedScrollY}px`;
    body.style.left = `-${lockedScrollX}px`;
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overscrollBehavior = "none";
  }
  lockCount += 1;
}

export function unlockBodyScroll(): void {
  if (typeof document === "undefined") return;
  if (lockCount <= 0) return;
  lockCount -= 1;
  if (lockCount === 0) {
    const { body, documentElement } = document;

    if (originalHtmlStyles) {
      documentElement.style.overflow = originalHtmlStyles.overflow;
      documentElement.style.overscrollBehavior =
        originalHtmlStyles.overscrollBehavior;
    }

    if (originalBodyStyles) {
      body.style.overflow = originalBodyStyles.overflow;
      body.style.position = originalBodyStyles.position;
      body.style.top = originalBodyStyles.top;
      body.style.left = originalBodyStyles.left;
      body.style.right = originalBodyStyles.right;
      body.style.width = originalBodyStyles.width;
      body.style.overscrollBehavior = originalBodyStyles.overscrollBehavior;
    }

    window.scrollTo(lockedScrollX, lockedScrollY);

    originalBodyStyles = null;
    originalHtmlStyles = null;
  }
}

export function getBodyScrollLockCount(): number {
  return lockCount;
}

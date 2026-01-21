// Created by Hafiz Abdullah for iOS Scroll Chaining | Enhancement of Ticket #45132
import { useEffect, RefObject } from "react";

/**
 * Enables scroll chaining on iOS Safari:
 * when inner scroll reaches end, outer scroll continues.
 */
export default function useScrollChain(
  innerRef: RefObject<HTMLElement>,
  outerRef: RefObject<HTMLElement>
): void {
  useEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;

    if (!inner || !outer) return;

    // ✅ Apply necessary inline styles for Safari scroll behavior
    Object.assign(inner.style, {
      WebkitOverflowScrolling: "touch",
      overscrollBehavior: "contain",
      overflowY: "auto",
      scrollBehavior: "smooth",
    });

    Object.assign(outer.style, {
      WebkitOverflowScrolling: "touch",
      overscrollBehavior: "auto",
      overflowY: "auto",
    });

    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const diff = startY - currentY;

      const atTop = inner.scrollTop === 0;
      const atBottom =
        inner.scrollTop + inner.offsetHeight >= inner.scrollHeight;

      if ((atTop && diff < 0) || (atBottom && diff > 0)) {
        e.preventDefault(); // stop Safari rubber-banding
        outer.scrollTop += diff; // transfer scroll to parent
      }
    };

    inner.addEventListener("touchstart", onTouchStart, { passive: false });
    inner.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      inner.removeEventListener("touchstart", onTouchStart);
      inner.removeEventListener("touchmove", onTouchMove);
    };
  }, [innerRef, outerRef]);
}

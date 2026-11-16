import { useEffect } from "react";

export function useMobileViewport() {
  useEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;
    let baseline = window.innerHeight;
    let width = window.innerWidth;
    let frame = 0;
    const measure = () => {
      if (Math.abs(window.innerWidth - width) > 80) {
        baseline = window.innerHeight;
        width = window.innerWidth;
      }
      const height = viewport?.height ?? window.innerHeight;
      const top = viewport?.offsetTop ?? 0;
      const editable = document.activeElement?.matches(
        "input:not([type=checkbox]):not([type=radio]),textarea,[contenteditable=true]",
      );
      root.dataset.mobileKeyboard = String(
        Boolean(editable && baseline - height > 120),
      );
      root.style.setProperty("--mobile-visible-height", `${height}px`);
      root.style.setProperty(
        "--mobile-keyboard-inset",
        `${Math.max(0, window.innerHeight - height - top)}px`,
      );
    };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
      delete root.dataset.mobileKeyboard;
      root.style.removeProperty("--mobile-visible-height");
      root.style.removeProperty("--mobile-keyboard-inset");
    };
  }, []);
}

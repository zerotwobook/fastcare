import { useEffect } from "react";

export function useConversationLayout(kind: "chat" | "call") {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("conversation-active", `${kind}-active`);
    window.scrollTo(0, 0);
    let baselineHeight = window.innerHeight;
    let lastWidth = window.innerWidth;
    let frame = 0;
    const viewport = window.visualViewport;
    const measure = () => {
      if (Math.abs(window.innerWidth - lastWidth) > 80) {
        baselineHeight = window.innerHeight;
        lastWidth = window.innerWidth;
      }
      const height = viewport?.height ?? window.innerHeight;
      root.style.setProperty("--chat-viewport-height", `${height}px`);
      root.style.setProperty(
        "--chat-viewport-top",
        `${viewport?.offsetTop ?? 0}px`,
      );
      root.dataset.chatKeyboard = String(baselineHeight - height > 120);
    };
    const resize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    viewport?.addEventListener("resize", resize);
    viewport?.addEventListener("scroll", resize);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", resize);
      viewport?.removeEventListener("scroll", resize);
      window.removeEventListener("resize", resize);
      root.classList.remove("conversation-active", `${kind}-active`);
      root.style.removeProperty("--chat-viewport-height");
      root.style.removeProperty("--chat-viewport-top");
      delete root.dataset.chatKeyboard;
    };
  }, [kind]);
}

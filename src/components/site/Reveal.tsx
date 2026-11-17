"use client";

import { useEffect } from "react";

/** Faz os elementos com a classe "revelar" aparecerem suavemente ao rolar a página. */
export function RevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".revelar:not(.visivel)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visivel"));
      return;
    }
    const obs = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visivel");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}

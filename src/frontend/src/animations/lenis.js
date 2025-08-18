import Lenis from 'lenis';

let lenis;

export function initLenis() {
  if (typeof window === 'undefined') return;
  if (lenis) return lenis;
  lenis = new Lenis({
    duration: 1.2,
    smooth: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothTouch: false,
    touchMultiplier: 2,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  return lenis;
} 
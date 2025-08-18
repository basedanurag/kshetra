import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function animateOnScroll(selector, animation, options = {}) {
  gsap.fromTo(
    selector,
    animation.from,
    {
      ...animation.to,
      scrollTrigger: {
        trigger: selector,
        start: options.start || 'top 80%',
        end: options.end || 'bottom 20%',
        toggleActions: options.toggleActions || 'play none none reverse',
        ...options.scrollTrigger,
      },
    }
  );
} 
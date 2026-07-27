import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

/* Register GSAP plugins exactly once, module-scoped. */
let registered = false;
if (!registered) {
  gsap.registerPlugin(ScrollTrigger, Draggable);
  registered = true;
}

export { gsap, ScrollTrigger, Draggable };

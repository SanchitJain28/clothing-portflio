document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".social-container");
  if (!container) return;

  // Check if content is wider than screen
  const isOverflowing = container.scrollWidth > window.innerWidth;

  if (isOverflowing) {
    // 1. Duplicate content for seamless loop
    container.innerHTML += container.innerHTML;

    // 2. GSAP Animation
    if (typeof gsap !== "undefined") {
      const moveDistance = container.scrollWidth / 2;
      const speed = 60; // Slightly slower for big icons
      const duration = moveDistance / speed;

      const tl = gsap.to(container, {
        x: -moveDistance,
        duration: duration,
        ease: "none",
        repeat: -1,
      });

      // Pause on hover
      container.addEventListener("mouseenter", () => tl.pause());
      container.addEventListener("mouseleave", () => tl.play());
    } else {
      console.warn("GSAP not found. Please ensure GSAP is loaded.");
    }
  } else {
    // Center if they fit on screen
    container.style.width = "100%";
    container.style.justifyContent = "center";
  }
});

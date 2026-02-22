document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".trust-bar-container");
  if (!container) return;

  // Check if content overflows the viewport
  const isOverflowing = container.scrollWidth > window.innerWidth;

  if (isOverflowing) {
    // 1. Duplicate content to create a seamless loop
    container.innerHTML += container.innerHTML;

    // 2. Ensure GSAP is loaded before animating
    if (typeof gsap !== "undefined") {
      // Calculate duration based on width to maintain consistent speed
      // Adjust the '50' divider to make it faster (lower) or slower (higher)
      const moveDistance = container.scrollWidth / 2;
      const speed = 50;
      const duration = moveDistance / speed;

      // 3. Create infinite linear animation
      const tl = gsap.to(container, {
        x: -moveDistance, // Move exactly half the total width (the original set)
        duration: duration,
        ease: "none",
        repeat: -1, // Infinite loop
      });

      // Optional: Pause on hover for better UX
      container.addEventListener("mouseenter", () => tl.pause());
      container.addEventListener("mouseleave", () => tl.play());
    } else {
      console.warn(
        "GSAP is not loaded. Please ensure GSAP is included in your theme.",
      );
    }
  } else {
    // If it fits on screen, center it nicely like a static section
    container.style.width = "100%";
    container.style.justifyContent = "space-evenly";
  }
});

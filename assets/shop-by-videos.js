// shop-by-videos.js
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".shop-by-videos__track");
  const group = document.querySelector(".shop-by-videos__group");
  const container = document.querySelector(".shop-by-videos__container");

  // Ensure GSAP is loaded and our elements exist
  if (!track || !group || typeof gsap === "undefined") return;

  let marqueeTween;

  function initMarquee() {
    // Kill existing tween if we are re-initializing (like on window resize)
    if (marqueeTween) marqueeTween.kill();

    // Calculate the width of one full group of videos + the gap (16px)
    const groupWidth = group.offsetWidth + 16;

    // Get speed from settings (default 40)
    const speedSetting = parseFloat(container.dataset.speed) || 40;

    // Calculate duration based on width so speed is consistent regardless of item count
    const duration = (groupWidth / 100) * (speedSetting / 10);

    // Animate the track moving to the left exactly the width of ONE group.
    // Because Group 2 is an exact duplicate, it creates a seamless infinite loop.
    marqueeTween = gsap.to(track, {
      x: -groupWidth,
      duration: duration,
      ease: "none",
      repeat: -1,
    });
  }

  // Initialize
  initMarquee();

  // Re-calculate on window resize in case image widths adapt
  window.addEventListener("resize", () => {
    // Small timeout to allow CSS to finish reflowing
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(initMarquee, 250);
  });

  // Pause scrolling when hovering over the videos so users can click products
  track.addEventListener("mouseenter", () => marqueeTween.pause());
  track.addEventListener("mouseleave", () => marqueeTween.play());

  // Also pause on touch devices when interacting
  track.addEventListener("touchstart", () => marqueeTween.pause());
  track.addEventListener("touchend", () => marqueeTween.play());
});

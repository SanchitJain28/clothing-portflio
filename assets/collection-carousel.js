// collection-carousel.js
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".collection-carousel");

  sections.forEach((section) => {
    const trackContainer = section.querySelector(
      ".collection-carousel__track-container",
    );
    const track = section.querySelector(".collection-carousel__track");
    const cards = section.querySelectorAll(".collection-carousel__card");
    const btnPrev = section.querySelector(".collection-carousel__nav--prev");
    const btnNext = section.querySelector(".collection-carousel__nav--next");
    const progressBar = section.querySelector(
      ".collection-carousel__progress-bar",
    );

    if (!track || cards.length === 0 || typeof gsap === "undefined") return;

    let currentIndex = 1; // Start with the second card focused (like the image)
    if (cards.length < 3) currentIndex = 0; // Fallback if fewer than 3 cards

    // Configuration
    const gap = parseInt(window.getComputedStyle(track).gap) || 30;
    const activeScale = 1.05; // The center card pops out 5%
    const inactiveScale = 0.9; // Side cards shrink to 90%

    function updateCarousel() {
      // 1. Calculate the center position
      const containerWidth = trackContainer.offsetWidth;
      const cardWidth = cards[0].offsetWidth;

      // Offset calculation to perfectly center the current index
      const offset =
        containerWidth / 2 - cardWidth / 2 - currentIndex * (cardWidth + gap);

      // 2. Animate the track X position
      gsap.to(track, {
        x: offset,
        duration: 0.6,
        ease: "power3.out",
      });

      // 3. Animate the scales and active classes of the cards
      cards.forEach((card, index) => {
        if (index === currentIndex) {
          card.classList.add("is-active");
          gsap.to(card, {
            scale: activeScale,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            zIndex: 2,
          });
        } else {
          card.classList.remove("is-active");
          gsap.to(card, {
            scale: inactiveScale,
            opacity: 0.85, // Slightly faded for depth
            duration: 0.6,
            ease: "power3.out",
            zIndex: 1,
          });
        }
      });

      // 4. Update the Progress Bar
      // Calculation: (Current Index / Total Navigable Steps) * 100
      let progress = 0;
      if (cards.length > 1) {
        progress = (currentIndex / (cards.length - 1)) * 100;
      } else {
        progress = 100;
      }

      gsap.to(progressBar, {
        width: `${progress}%`,
        duration: 0.6,
        ease: "power3.out",
      });
    }

    // Event Listeners for Arrows
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        if (currentIndex < cards.length - 1) {
          currentIndex++;
          updateCarousel();
        }
      });
    }

    // Make individual cards clickable to focus them (if they aren't already focused)
    cards.forEach((card, index) => {
      card.addEventListener("click", (e) => {
        if (index !== currentIndex) {
          e.preventDefault(); // Prevent navigating away if it's just coming into focus
          currentIndex = index;
          updateCarousel();
        }
      });
    });

    // Initialize layout
    updateCarousel();

    // Re-calculate on window resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Reset transforms temporarily to get accurate measurements
        gsap.set(track, { clearProps: "x" });
        gsap.set(cards, { clearProps: "scale" });
        updateCarousel();
      }, 250);
    });
  });
});

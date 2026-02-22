document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".custom-card");
  const gridContainer = document.querySelector(".custom-grid__container");

  if (!cards.length) return;

  // Function to run animations
  const animateCards = () => {
    // Check if GSAP is available (Global variable)
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      gsap.to(cards, {
        duration: 0.8,
        opacity: 1,
        y: 0,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridContainer,
          start: "top 85%", // Triggers when top of grid hits 85% of viewport height
          toggleActions: "play none none none",
        },
      });
    } else {
      // Vanilla JS Fallback using IntersectionObserver
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Get all cards inside the container
              cards.forEach((card, index) => {
                setTimeout(() => {
                  card.style.transition =
                    "opacity 0.6s ease, transform 0.6s ease";
                  card.style.opacity = "1";
                  card.style.transform = "translateY(0)";
                }, index * 100); // Stagger effect
              });
              // Stop observing after animation runs
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 },
      );

      observer.observe(gridContainer);
    }
  };

  animateCards();
});

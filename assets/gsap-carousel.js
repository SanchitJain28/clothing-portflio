document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") {
    console.error("GSAP is not loaded. Please include GSAP in your theme.");
    return;
  }

  const sliders = document.querySelectorAll(".gsap-carousel-wrapper");

  sliders.forEach((slider) => {
    initGsapSlider(slider);
  });
});

function initGsapSlider(wrapper) {
  const slides = Array.from(wrapper.querySelectorAll(".gsap-slide"));
  const nextBtn = wrapper.querySelector(".next-btn");
  const prevBtn = wrapper.querySelector(".prev-btn");
  const dots = Array.from(wrapper.querySelectorAll(".gsap-dot"));

  if (slides.length < 2) return; // Don't run if only 1 slide

  let currentIndex = 0;
  let isAnimating = false;
  let autoPlayTimer;

  // Settings from Schema (could be passed via data attributes, hardcoded defaults here)
  const autoPlayEnabled = true; // You can pull this from liquid if needed
  const autoPlaySpeed = 5000;

  // Initial setup: Ensure text is visible for the first slide
  gsap.set(
    slides[0].querySelectorAll(
      ".gsap-subtitle, .gsap-title, .gsap-desc, .gsap-btn-wrapper",
    ),
    {
      y: 0,
      opacity: 1,
    },
  );

  const goToSlide = (index, direction = "next") => {
    if (isAnimating || index === currentIndex) return;
    isAnimating = true;

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[index];
    const nextTextItems = nextSlide.querySelectorAll(
      ".gsap-subtitle, .gsap-title, .gsap-desc, .gsap-btn-wrapper",
    );
    const nextImg = nextSlide.querySelector(".gsap-slide-img");
    const currentImg = currentSlide.querySelector(".gsap-slide-img");

    // Update Dots
    dots.forEach((d) => d.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");

    // Create Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        currentSlide.classList.remove("active");
        nextSlide.classList.add("active");
        currentIndex = index;
      },
    });

    // 1. Prepare Next Slide (Set positions based on direction)
    const xStart = direction === "next" ? "100%" : "-100%";
    const xEnd = direction === "next" ? "-20%" : "20%"; // Parallax effect for exiting image

    // Make next slide visible but offscreen initially
    gsap.set(nextSlide, { autoAlpha: 1, zIndex: 2, x: xStart });
    gsap.set(currentSlide, { zIndex: 1 });

    // Prepare text elements hidden
    gsap.set(nextTextItems, { y: 30, opacity: 0 });

    // 2. Animate Slides
    tl.to(
      currentSlide,
      {
        duration: 1,
        x: direction === "next" ? "-100%" : "100%",
        ease: "power3.inOut",
      },
      0,
    )
      .to(
        nextSlide,
        {
          duration: 1,
          x: "0%",
          ease: "power3.inOut",
        },
        0,
      )

      // 3. Parallax Image Effect (Optional inner movement)
      .fromTo(
        nextImg,
        { scale: 1.2 },
        { scale: 1, duration: 1.2, ease: "power2.out" },
        0,
      )

      // 4. Text Reveal Stagger
      .to(
        nextTextItems,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.4",
      ); // Start before slide finishes
  };

  // Event Listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopAutoPlay();
      let nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex, "next");
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopAutoPlay();
      let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prevIndex, "prev");
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      stopAutoPlay();
      const targetIndex = parseInt(e.target.dataset.index);
      const direction = targetIndex > currentIndex ? "next" : "prev";
      goToSlide(targetIndex, direction);
    });
  });

  // Autoplay Logic
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      let nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex, "next");
    }, autoPlaySpeed);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
  }

  if (autoPlayEnabled) startAutoPlay();

  // Handle Resize
  window.addEventListener("resize", () => {
    gsap.set(slides, { clearProps: "all" });
    // Reset to current state visually if needed, simpler to just let CSS handle resize
  });
}
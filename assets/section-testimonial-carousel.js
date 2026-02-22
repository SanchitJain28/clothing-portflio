class TestimonialCarousel {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector(".testimonial-carousel__track");
    this.slides = container.querySelectorAll(".testimonial-carousel__slide");
    this.prevBtn = container.querySelector(".testimonial-carousel__nav--prev");
    this.nextBtn = container.querySelector(".testimonial-carousel__nav--next");
    this.dotsContainer = container.querySelector(".testimonial-carousel__dots");

    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.autoplayInterval = null;

    this.sectionId = container.dataset.sectionId;
    this.settings = this.getSettings();

    this.init();
  }

  getSettings() {
    const schemaScript = document.querySelector(
      `script[data-section-id="${this.sectionId}"]`,
    );
    if (schemaScript) {
      try {
        const settings = JSON.parse(schemaScript.textContent);
        return settings;
      } catch (e) {
        return { autoplay: true, autoplay_speed: 5 };
      }
    }
    return { autoplay: true, autoplay_speed: 5 };
  }

  init() {
    if (this.totalSlides <= 1) return;

    this.createDots();
    this.attachEvents();
    this.setupSwipe();

    if (this.settings.autoplay) {
      this.startAutoplay();
    }

    this.container.addEventListener("mouseenter", () => this.stopAutoplay());
    this.container.addEventListener("mouseleave", () => {
      if (this.settings.autoplay) this.startAutoplay();
    });
  }

  createDots() {
    this.slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("testimonial-carousel__dot");
      if (index === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.addEventListener("click", () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
    });
    this.dots = this.dotsContainer.querySelectorAll(
      ".testimonial-carousel__dot",
    );
  }

  attachEvents() {
    this.prevBtn?.addEventListener("click", () => this.prev());
    this.nextBtn?.addEventListener("click", () => this.next());
  }

  setupSwipe() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    this.track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.stopAutoplay();
    });

    this.track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    });

    this.track.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;

      const diff = startX - currentX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }

      if (this.settings.autoplay) this.startAutoplay();
    });
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateCarousel();
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
  }

  updateCarousel() {
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;

    this.dots?.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  startAutoplay() {
    this.stopAutoplay();
    const speed = (this.settings.autoplay_speed || 5) * 1000;
    this.autoplayInterval = setInterval(() => this.next(), speed);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".testimonial-carousel");
  carousels.forEach((carousel) => new TestimonialCarousel(carousel));
});

if (Shopify?.designMode) {
  document.addEventListener("shopify:section:load", (event) => {
    const carousel = event.target.querySelector(".testimonial-carousel");
    if (carousel) new TestimonialCarousel(carousel);
  });
}

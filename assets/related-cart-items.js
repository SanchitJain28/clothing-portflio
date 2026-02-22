if (!customElements.get("related-products-carousel")) {
  customElements.define(
    "related-products-carousel",
    class RelatedProductsCarousel extends HTMLElement {
      constructor() {
        super();
        this.track = this.querySelector(".related-cart-items__track");
        this.prevBtn = this.querySelector(".related-cart-items__nav--prev");
        this.nextBtn = this.querySelector(".related-cart-items__nav--next");
        this.currentIndex = 0;
        this.slides = this.querySelectorAll(".related-cart-items__slide");

        this.prevBtn.addEventListener("click", () => this.prev());
        this.nextBtn.addEventListener("click", () => this.next());

        this.updateButtons();
      }

      next() {
        if (this.currentIndex < this.slides.length - 1) {
          this.currentIndex++;
          this.updateCarousel();
        }
      }

      prev() {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.updateCarousel();
        }
      }

      updateCarousel() {
        const slideWidth = this.slides[0].offsetWidth;
        const gap = 0;
        this.track.style.transform = `translateX(-${this.currentIndex * (slideWidth + gap)}px)`;
        this.updateButtons();
      }

      updateButtons() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.slides.length - 1;
      }
    },
  );
}

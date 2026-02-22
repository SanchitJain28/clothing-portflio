class CartRelatedProducts extends HTMLElement {
  constructor() {
    super();

    this.carousel = this.querySelector(".cart-related-products__carousel");
    this.track = this.querySelector(".cart-related-products__track");
    this.prevBtn = this.querySelector(".cart-related-products__nav-btn--prev");
    this.nextBtn = this.querySelector(".cart-related-products__nav-btn--next");
    this.items = Array.from(this.querySelectorAll(".cart-related-product"));
    this.addBtns = this.querySelectorAll(".cart-related-product__add-btn");

    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;

    if (this.items.length > 0) {
      this.init();
    }
  }

  init() {
    this.updateCarouselSettings();
    this.setupEventListeners();
    this.updateButtons();
  }

  updateCarouselSettings() {
    const width = window.innerWidth;

    if (width <= 480) {
      // Calculate available width: viewport - drawer padding - carousel padding
      const availableWidth = Math.min(width, 480) - 40; // 40px total horizontal padding
      this.itemWidth = Math.min(260, availableWidth - 20);
      this.gap = 10;
      this.visibleItems = 1;
    } else if (width <= 750) {
      this.itemWidth = 280;
      this.gap = 10;
      this.visibleItems = 1;
    } else {
      this.itemWidth = 280;
      this.gap = 10;
      const carouselWidth = this.carousel?.offsetWidth || 380;
      this.visibleItems = Math.floor(
        carouselWidth / (this.itemWidth + this.gap),
      );
    }

    this.maxIndex = Math.max(0, this.items.length - this.visibleItems);
  }

  setupEventListeners() {
    this.prevBtn?.addEventListener("click", () => this.prev());
    this.nextBtn?.addEventListener("click", () => this.next());

    this.addBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleAddToCart(e));
    });

    this.track.addEventListener("mousedown", (e) => this.handleDragStart(e));
    this.track.addEventListener("touchstart", (e) => this.handleDragStart(e), {
      passive: true,
    });

    document.addEventListener("mousemove", (e) => this.handleDragMove(e));
    document.addEventListener("touchmove", (e) => this.handleDragMove(e), {
      passive: false,
    });

    document.addEventListener("mouseup", () => this.handleDragEnd());
    document.addEventListener("touchend", () => this.handleDragEnd());

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.updateCarouselSettings();
        this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
        this.goToSlide(this.currentIndex, false);
        this.updateButtons();
      }, 150);
    });
  }

  handleDragStart(e) {
    this.isDragging = true;
    this.startX = e.type === "mousedown" ? e.clientX : e.touches[0].clientX;
    this.track.style.cursor = "grabbing";
  }

  handleDragMove(e) {
    if (!this.isDragging) return;
    this.currentX = e.type === "mousemove" ? e.clientX : e.touches[0].clientX;
  }

  handleDragEnd() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.track.style.cursor = "grab";

    const diff = this.startX - this.currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  prev() {
    this.goToSlide(Math.max(0, this.currentIndex - 1));
  }

  next() {
    this.goToSlide(Math.min(this.maxIndex, this.currentIndex + 1));
  }

  goToSlide(index, animate = true) {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    const offset = -(this.currentIndex * (this.itemWidth + this.gap));

    this.track.style.transition = animate ? "transform 0.5s ease" : "none";
    this.track.style.transform = `translateX(${offset}px)`;

    this.updateButtons();
  }

  updateButtons() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
    }
  }

  async handleAddToCart(e) {
    const btn = e.currentTarget;
    const variantId = btn.dataset.productId;

    if (!variantId) return;

    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = "...";

    try {
      const response = await fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] }),
      });

      if (!response.ok) throw new Error("Failed");

      btn.textContent = "✓";
      btn.style.backgroundColor = "#C3FF87";
      btn.style.color = "#004B1A";

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = "";
        btn.style.color = "";
        btn.disabled = false;
      }, 1500);

      document.dispatchEvent(new CustomEvent("cart:refresh"));
    } catch (error) {
      console.error("Error:", error);
      btn.textContent = "✗";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    }
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("cart-related-products")
) {
  customElements.define("cart-related-products", CartRelatedProducts);
}

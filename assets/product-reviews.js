/**
 * Product Reviews Functionality - Maison Luxe
 * Calculates ratings from blocks and handles sorting/filtering
 */

class ProductReviews {
  constructor() {
    this.sortSelect = document.getElementById("sortReviews");
    this.filterRating = document.getElementById("filterRating");
    this.filterMedia = document.getElementById("filterMedia");
    this.reviewsList = document.querySelector(".reviews-list");
    this.loadMoreBtn = document.querySelector(".btn-load-more");
    this.helpfulBtns = document.querySelectorAll(".helpful-btn");

    this.reviews = Array.from(document.querySelectorAll(".review-item"));
    this.visibleCount = 0;
    this.increment = 5;

    this.init();
  }

  init() {
    this.calculateRatings();
    this.attachEventListeners();
    this.initializeReviews();
  }

  calculateRatings() {
    if (this.reviews.length === 0) return;

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    this.reviews.forEach((review) => {
      const rating = parseInt(review.dataset.rating) || 0;

      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating]++;
        totalRating += rating;
      }
    });

    const totalReviews = this.reviews.length;
    const averageRating = (totalRating / totalReviews).toFixed(1);

    this.updateSummary(averageRating, totalReviews, ratingCounts);
  }

  updateSummary(averageRating, totalReviews, ratingCounts) {
    const ratingNumber = document.querySelector(".rating-number");
    if (ratingNumber) {
      ratingNumber.textContent = averageRating;
    }

    const reviewCount = document.querySelector(".review-count");
    if (reviewCount) {
      reviewCount.textContent = `${totalReviews} review${totalReviews !== 1 ? "s" : ""}`;
    }

    const summaryStars = document.querySelector(
      ".reviews-summary__rating .rating-stars",
    );
    if (summaryStars) {
      summaryStars.dataset.rating = averageRating;
      this.renderStars(summaryStars, parseFloat(averageRating));
    }

    for (let i = 1; i <= 5; i++) {
      const count = ratingCounts[i] || 0;
      const percentage =
        totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

      const bars = document.querySelectorAll(
        ".reviews-summary__breakdown .rating-bar",
      );
      const ratingBar = bars[5 - i];

      if (ratingBar) {
        const fill = ratingBar.querySelector(".rating-bar__fill");
        const percentageText = ratingBar.querySelector(
          ".rating-bar__percentage",
        );

        if (fill) fill.style.width = `${percentage}%`;
        if (percentageText) percentageText.textContent = `${percentage}%`;
      }
    }
  }

  renderStars(container, rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    container.innerHTML = "";

    for (let i = 0; i < fullStars; i++) {
      container.innerHTML += this.getStarSVG("full");
    }

    if (hasHalfStar) {
      container.innerHTML += this.getStarSVG("half");
    }

    for (let i = 0; i < emptyStars; i++) {
      container.innerHTML += this.getStarSVG("empty");
    }
  }

  getStarSVG(type) {
    const svgBase =
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">';

    if (type === "full") {
      return `${svgBase}<path d="M8 0L9.79611 3.87336L14 4.5L11 7.59L11.5922 12L8 9.87336L4.40779 12L5 7.59L2 4.5L6.20389 3.87336L8 0Z" fill="currentColor"/></svg>`;
    } else if (type === "half") {
      return `${svgBase}<defs><linearGradient id="half-${Math.random()}"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path d="M8 0L9.79611 3.87336L14 4.5L11 7.59L11.5922 12L8 9.87336L4.40779 12L5 7.59L2 4.5L6.20389 3.87336L8 0Z" fill="url(#half-${Math.random()})"/></svg>`;
    } else {
      return `${svgBase}<path d="M8 0L9.79611 3.87336L14 4.5L11 7.59L11.5922 12L8 9.87336L4.40779 12L5 7.59L2 4.5L6.20389 3.87336L8 0Z" fill="transparent" stroke="currentColor" stroke-width="1"/></svg>`;
    }
  }

  attachEventListeners() {
    if (this.sortSelect) {
      this.sortSelect.addEventListener("change", () => this.handleSort());
    }

    if (this.filterRating) {
      this.filterRating.addEventListener("change", () => this.handleFilter());
    }

    if (this.filterMedia) {
      this.filterMedia.addEventListener("change", () => this.handleFilter());
    }

    if (this.loadMoreBtn) {
      this.loadMoreBtn.addEventListener("click", () => this.loadMore());
    }

    this.helpfulBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleHelpfulVote(e));
    });
  }

  initializeReviews() {
    this.reviews.forEach((review, index) => {
      review.style.display = index < this.increment ? "block" : "none";
    });

    this.visibleCount = Math.min(this.increment, this.reviews.length);
    this.updateLoadMoreButton();
  }

  getReviewRating(review) {
    return parseInt(review.dataset.rating) || 0;
  }

  handleSort() {
    const sortValue = this.sortSelect.value;
    const reviewsArray = Array.from(this.reviews);

    reviewsArray.sort((a, b) => {
      switch (sortValue) {
        case "recent":
          return this.sortByDate(a, b);
        case "helpful":
          return this.sortByHelpful(a, b);
        case "rating-high":
          return this.sortByRating(a, b, "desc");
        case "rating-low":
          return this.sortByRating(a, b, "asc");
        default:
          return 0;
      }
    });

    this.reviewsList.innerHTML = "";
    reviewsArray.forEach((review) => this.reviewsList.appendChild(review));
    this.reviews = reviewsArray;
    this.handleFilter();
  }

  sortByDate(a, b) {
    const dateA = this.parseDateString(
      a.querySelector(".review-date")?.textContent,
    );
    const dateB = this.parseDateString(
      b.querySelector(".review-date")?.textContent,
    );
    return dateB - dateA;
  }

  sortByHelpful(a, b) {
    const helpfulA = this.getHelpfulCount(a);
    const helpfulB = this.getHelpfulCount(b);
    return helpfulB - helpfulA;
  }

  sortByRating(a, b, order = "desc") {
    const ratingA = this.getReviewRating(a);
    const ratingB = this.getReviewRating(b);
    return order === "desc" ? ratingB - ratingA : ratingA - ratingB;
  }

  getHelpfulCount(review) {
    const yesBtn = review.querySelector('.helpful-btn[data-action="yes"]');
    return parseInt(yesBtn?.textContent.match(/\d+/)?.[0] || 0);
  }

  parseDateString(dateStr) {
    if (!dateStr) return new Date();

    const match = dateStr.match(/(\d+)\s+(month|year|day|week)s?\s+ago/);
    if (!match) return new Date();

    const value = parseInt(match[1]);
    const unit = match[2];
    const now = new Date();

    switch (unit) {
      case "day":
        now.setDate(now.getDate() - value);
        break;
      case "week":
        now.setDate(now.getDate() - value * 7);
        break;
      case "month":
        now.setMonth(now.getMonth() - value);
        break;
      case "year":
        now.setFullYear(now.getFullYear() - value);
        break;
    }

    return now;
  }

  handleFilter() {
    const ratingFilter = this.filterRating?.value || "all";
    const mediaFilter = this.filterMedia?.checked || false;

    this.reviews.forEach((review) => {
      let showReview = true;

      if (ratingFilter !== "all") {
        const reviewRating = this.getReviewRating(review);
        if (reviewRating !== parseInt(ratingFilter)) {
          showReview = false;
        }
      }

      if (mediaFilter) {
        const hasMedia = review.querySelector(".review-media");
        if (!hasMedia) {
          showReview = false;
        }
      }

      review.style.display = showReview ? "block" : "none";
    });

    this.updateLoadMoreButton();
  }

  loadMore() {
    const hiddenReviews = this.reviews.filter(
      (review) =>
        review.style.display === "none" && this.shouldShowReview(review),
    );

    hiddenReviews.slice(0, this.increment).forEach((review) => {
      review.style.display = "block";
    });

    this.visibleCount = this.reviews.filter(
      (r) => r.style.display !== "none",
    ).length;
    this.updateLoadMoreButton();
  }

  shouldShowReview(review) {
    const ratingFilter = this.filterRating?.value || "all";
    const mediaFilter = this.filterMedia?.checked || false;

    if (ratingFilter !== "all") {
      const reviewRating = this.getReviewRating(review);
      if (reviewRating !== parseInt(ratingFilter)) return false;
    }

    if (mediaFilter) {
      const hasMedia = review.querySelector(".review-media");
      if (!hasMedia) return false;
    }

    return true;
  }

  updateLoadMoreButton() {
    if (!this.loadMoreBtn) return;

    const hiddenReviews = this.reviews.filter(
      (review) =>
        review.style.display === "none" && this.shouldShowReview(review),
    );

    this.loadMoreBtn.style.display =
      hiddenReviews.length > 0 ? "inline-block" : "none";
  }

  handleHelpfulVote(e) {
    const btn = e.currentTarget;
    const action = btn.dataset.action;
    const currentCount = parseInt(btn.textContent.match(/\d+/)?.[0] || 0);
    const newCount = currentCount + 1;

    const icon = btn.querySelector("svg").cloneNode(true);
    btn.innerHTML = "";
    btn.appendChild(icon);
    btn.appendChild(document.createTextNode(` ${newCount}`));

    btn.style.borderColor = "#2D5C3F";
    btn.style.color = "#2D5C3F";
    btn.disabled = true;

    const siblingBtn = btn.parentElement.querySelector(
      `.helpful-btn[data-action="${action === "yes" ? "no" : "yes"}"]`,
    );
    if (siblingBtn) {
      siblingBtn.disabled = true;
      siblingBtn.style.opacity = "0.5";
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new ProductReviews());
} else {
  new ProductReviews();
}

class CartRewards {
  constructor() {
    this.milestones = [
      { threshold: 5000, label: "FREE SHIPPING", icon: "🚚" },
      { threshold: 10000, label: "FREE NORTHERN LIGHTS", icon: "🌌" },
      { threshold: 20000, label: "FREE TABLE LAMP", icon: "✨" },
    ];

    this.init();
    this.setupEventListeners();
  }

  init() {
    this.updateProgress();
  }

  setupEventListeners() {
    if (typeof subscribe !== "undefined") {
      subscribe(PUB_SUB_EVENTS.cartUpdate, () => {
        setTimeout(() => this.updateProgress(), 100);
      });
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(".cart-drawer.is-empty")) {
        return;
      }
      this.updateProgress();
    });

    const cartDrawer = document.querySelector("cart-drawer");
    if (cartDrawer) {
      observer.observe(cartDrawer, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
  }

  async getCartTotal() {
    try {
      const response = await fetch("/cart.js");
      const cart = await response.json();
      return cart.total_price;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return 0;
    }
  }

  async updateProgress() {
    const rewardsContainer = document.getElementById("cart-rewards");
    if (!rewardsContainer) return;

    const total = await this.getCartTotal();
    const progressBar = document.getElementById("cart-rewards-progress");
    const messageEl = document.getElementById("cart-rewards-message");
    const milestoneEls = document.querySelectorAll(".cart-rewards__milestone");

    const maxThreshold = this.milestones[this.milestones.length - 1].threshold;
    const progressPercent = Math.min((total / maxThreshold) * 100, 100);
    console.log(progressPercent, "PROGRESS PERCENT");

    if (progressBar) {
      if (!progressBar.textContent) {
        progressBar.innerHTML = "&nbsp;";
      }

      progressBar.style.width = "0%";
      void progressBar.offsetWidth;

      setTimeout(() => {
        progressBar.style.width = `${progressPercent}%`;
      }, 100);
    }

    let currentMilestone = null;
    let nextMilestone = null;

    for (let i = 0; i < this.milestones.length; i++) {
      const milestone = this.milestones[i];
      const milestoneEl = milestoneEls[i];

      if (!milestoneEl) continue;

      if (total >= milestone.threshold) {
        milestoneEl.classList.add("completed");
        milestoneEl.classList.remove("active");
        currentMilestone = milestone;
      } else {
        milestoneEl.classList.remove("completed");
        if (!nextMilestone) {
          nextMilestone = milestone;
          milestoneEl.classList.add("active");
        } else {
          milestoneEl.classList.remove("active");
        }
      }
    }

    if (messageEl) {
      if (total >= maxThreshold) {
        messageEl.innerHTML =
          '<span class="cart-rewards__gift-badge">FREE GIFT 🎁</span>';
      } else if (nextMilestone) {
        const remaining = nextMilestone.threshold - total;
        const formattedRemaining = this.formatPrice(remaining);
        messageEl.textContent = `Only ${formattedRemaining} left to get ${nextMilestone.label.toLowerCase()}!`;
      } else {
        messageEl.textContent = "";
      }
    }

    const nextRewardContainer = document.getElementById(
      "cart-rewards-next-reward",
    );
    const nextRewardIcon = document.getElementById("next-reward-icon");
    const nextRewardLabel = document.getElementById("next-reward-label");
    const nextRewardProgress = document.getElementById("next-reward-progress");

    if (nextMilestone && nextRewardContainer) {
      const remaining = nextMilestone.threshold - total;
      const progress =
        ((total -
          (this.milestones[this.milestones.indexOf(nextMilestone) - 1]
            ?.threshold || 0)) /
          (nextMilestone.threshold -
            (this.milestones[this.milestones.indexOf(nextMilestone) - 1]
              ?.threshold || 0))) *
        100;

      nextRewardIcon.textContent = nextMilestone.icon;
      nextRewardLabel.textContent = `Next: ${nextMilestone.label}`;
      nextRewardProgress.textContent = `${this.formatPrice(remaining)} away`;

      nextRewardContainer.style.display = "flex";
    } else if (nextRewardContainer) {
      nextRewardContainer.style.display = "none";
    }
  }

  formatPrice(cents) {
    const rupees = cents / 100;
    return `₹${rupees.toFixed(2)}`;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new CartRewards();
  });
} else {
  new CartRewards();
}

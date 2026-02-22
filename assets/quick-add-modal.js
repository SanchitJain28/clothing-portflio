document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("quick-add-modal");
  if (!modal) return; // Exit if modal doesn't exist

  const modalOverlay = modal.querySelector(".qa-modal__overlay");
  const closeBtn = modal.querySelector(".qa-modal__close");
  const modalTitle = document.getElementById("qa-title");
  const modalPrice = document.getElementById("qa-price");
  const modalComparePrice = document.getElementById("qa-compare-price");
  const modalImage = document.getElementById("qa-image");
  const variantsContainer = document.getElementById("qa-variants");
  const variantIdInput = document.getElementById("qa-variant-id");
  const addBtn = document.getElementById("qa-add-btn");
  const errorMsg = document.getElementById("qa-error");

  let currentProduct = null;

  // 1. Open Modal Logic
  document.querySelectorAll(".custom-quick-add-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const handle = btn.dataset.productHandle;
      openModal(handle);
    });
  });

  // 2. Fetch Data and Populate
  function openModal(handle) {
    // Reset Modal
    modalTitle.textContent = "Loading...";
    modalPrice.textContent = "";
    modalComparePrice.textContent = "";
    variantsContainer.innerHTML = "";
    addBtn.disabled = true;
    addBtn.textContent = "Loading...";
    modal.classList.add("is-open");

    fetch(`/products/${handle}.js`)
      .then((response) => response.json())
      .then((product) => {
        currentProduct = product;
        populateModal(product);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        modalTitle.textContent = "Error loading product";
      });
  }

  function populateModal(product) {
    modalTitle.textContent = product.title;
    modalImage.src = product.featured_image;
    modalImage.alt = product.title;

    // Clear previous variants
    variantsContainer.innerHTML = "";

    // If product has variants
    if (product.variants.length > 1) {
      // Create Dropdowns for Options (Size, Color, etc)
      product.options.forEach((option, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "qa-variant-group";

        const label = document.createElement("label");
        label.className = "qa-variant-label";
        label.textContent = option.name;

        const select = document.createElement("select");
        select.className = "qa-variant-select";
        select.dataset.index = index; // Track which option this is

        option.values.forEach((value) => {
          const opt = document.createElement("option");
          opt.value = value;
          opt.textContent = value;
          select.appendChild(opt);
        });

        // Listen for changes
        select.addEventListener("change", () => updateSelectedVariant(product));

        wrapper.appendChild(label);
        wrapper.appendChild(select);
        variantsContainer.appendChild(wrapper);
      });
    } else {
      // Simple product (no variants)
      variantIdInput.value = product.variants[0].id;
    }

    // Initial Update
    updateSelectedVariant(product);
  }

  function updateSelectedVariant(product) {
    let selectedVariant;

    if (product.variants.length > 1) {
      // Get all selected options
      const selects = Array.from(variantsContainer.querySelectorAll("select"));
      const currentOptions = selects.map((s) => s.value);

      // Find matching variant
      selectedVariant = product.variants.find((variant) => {
        return variant.options.every((val, i) => val === currentOptions[i]);
      });
    } else {
      selectedVariant = product.variants[0];
    }

    if (selectedVariant) {
      // Update Price
      modalPrice.textContent = formatMoney(selectedVariant.price);
      if (selectedVariant.compare_at_price > selectedVariant.price) {
        modalComparePrice.textContent = formatMoney(
          selectedVariant.compare_at_price,
        );
      } else {
        modalComparePrice.textContent = "";
      }

      // Update Image if variant has one
      if (selectedVariant.featured_image) {
        modalImage.src = selectedVariant.featured_image.src;
      }

      // Update ID Input
      variantIdInput.value = selectedVariant.id;

      // Update Button State
      if (selectedVariant.available) {
        addBtn.disabled = false;
        addBtn.textContent = "ADD TO CART";
      } else {
        addBtn.disabled = true;
        addBtn.textContent = "SOLD OUT";
      }
    } else {
      addBtn.disabled = true;
      addBtn.textContent = "UNAVAILABLE";
    }
  }

  // 3. Add to Cart Logic
  document.getElementById("qa-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const variantId = variantIdInput.value;

    addBtn.textContent = "ADDING...";
    addBtn.disabled = true;
    errorMsg.style.display = "none";

    const formData = {
      items: [
        {
          id: variantId,
          quantity: 1,
        },
      ],
    };

    fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status) {
          // Error from Shopify
          throw new Error(data.description || "Error adding to cart");
        }

        // Success
        addBtn.textContent = "ADDED!";
        setTimeout(() => {
          closeModal();

          // Trigger Theme specific cart update (Common for Dawn/Shopify themes)
          // If your theme uses a different event, update this.
          document.documentElement.dispatchEvent(
            new CustomEvent("cart:refresh", { bubbles: true }),
          );

          // Alternatively reload or redirect
          // window.location.href = '/cart';
        }, 500);
      })
      .catch((error) => {
        console.error("Error:", error);
        addBtn.textContent = "TRY AGAIN";
        addBtn.disabled = false;
        errorMsg.textContent = error.message;
        errorMsg.style.display = "block";
      });
  });

  // 4. Close Modal Logic
  function closeModal() {
    modal.classList.remove("is-open");
  }

  closeBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  // Helper: Simple Money Formatter
  function formatMoney(cents) {
    return theme.currency
      ? theme.currency.replace("{{amount}}", (cents / 100).toFixed(2))
      : "$" + (cents / 100).toFixed(2);
  }
});

// Polyfill for theme currency if not defined
if (typeof theme === "undefined") {
  var theme = { currency: "Rs. {{amount}}" };
}

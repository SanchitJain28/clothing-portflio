document.addEventListener("DOMContentLoaded", function () {
  // 1. Define the Dataset
  const collectionData = {
    tops: {
      fabric: "Fabric Details: 95% Cotton, 5% Spandex (Breathable Terry)",
      type: "Jackets & Hoodies",
      fitPosition: "50%", // 0% = Small, 50% = True, 100% = Large
      modelStats:
        'Model wears size S and is 177.8cms/5\'10" tall, with a 33" Bust size and 27" waist size',
      manufacturer: "FlexForm Tops Division",
    },
    "sports-bras": {
      fabric: "Fabric Details: 78% Nylon, 22% Spandex (Sweat-wicking)",
      type: "High-Support Sports Bra",
      fitPosition: "30%", // Runs slightly small/tight
      modelStats:
        'Model wears size M and is 172cms/5\'8" tall, with a 34" Bust size',
      manufacturer: "FlexForm Activewear Division",
    },
    leggings: {
      fabric: "Fabric Details: 80% Polyester, 20% Elastane (Squat-proof)",
      type: "Performance Leggings",
      fitPosition: "50%", // True to size
      modelStats:
        'Model wears size S and is 175cms/5\'9" tall, with a 26" Waist and 36" Hip',
      manufacturer: "FlexForm Bottoms Division",
    },
    // Fallback if product isn't in main collections
    default: {
      fabric: "Fabric Details: Premium Activewear Blend",
      type: "Activewear",
      fitPosition: "50%",
      modelStats: "Model wears size S",
      manufacturer: "FlexForm General",
    },
  };

  // 2. Get the handle from the HTML hook
  const container = document.querySelector(".product-details-section");
  if (!container) return; // Exit if section doesn't exist

  const currentHandle = container.getAttribute("data-collection-handle");

  // 3. Select the data to use
  const data = collectionData[currentHandle] || collectionData["default"];

  // 4. Inject Data into DOM
  const fabricEl = document.getElementById("js-fabric-content");
  const typeEl = document.getElementById("js-type-content");
  const fitDot = document.getElementById("js-fit-dot");
  const modelEl = document.getElementById("js-model-content");
  // Optional: If you wanted sold-by dynamic too
  // const soldEl = document.getElementById('js-sold-content');

  if (fabricEl) fabricEl.innerText = data.fabric;
  if (typeEl) typeEl.innerText = data.type;
  if (modelEl) modelEl.innerText = data.modelStats;

  // Set the dot position for Fit Slider
  if (fitDot) fitDot.style.left = data.fitPosition;
});

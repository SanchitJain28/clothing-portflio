document.addEventListener("DOMContentLoaded", function () {
  const bannerContent = document.querySelector(".moving-promo-banner__content");
  if (bannerContent) {
    // You can adjust the animation duration here.
    // A longer duration means slower movement.
    const animationDuration = "15s";
    bannerContent.style.animationDuration = animationDuration;

    // If you need the animation to be infinitely responsive to text length,
    // you would calculate the width of the text and set the duration dynamically.
    // For this example, a fixed duration is used.
  }
});

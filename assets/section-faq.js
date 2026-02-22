document.addEventListener("DOMContentLoaded", function () {
  const faqTriggers = document.querySelectorAll(".faq-trigger");

  faqTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      // Toggle active class on the button
      this.classList.toggle("active");

      // Get the next sibling (the answer div)
      const content = this.nextElementSibling;

      // Toggle the open class
      content.classList.toggle("open");

      // Handle the height animation
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        // Set max-height to the scrollHeight (actual height of content)
        content.style.maxHeight = content.scrollHeight + "px";
      }

      // Optional: Close other accordions when one opens (Accordion vs Toggle behavior)
      // Uncomment lines below to enable "Only one open at a time"
      /*
      faqTriggers.forEach(otherTrigger => {
        if (otherTrigger !== this && otherTrigger.classList.contains('active')) {
          otherTrigger.classList.remove('active');
          otherTrigger.nextElementSibling.classList.remove('open');
          otherTrigger.nextElementSibling.style.maxHeight = null;
        }
      });
      */
    });
  });
});

class TabbedCollections {
  constructor(container) {
    this.container = container;
    this.tabs = container.querySelectorAll(".tabbed-collections__tab");
    this.panels = container.querySelectorAll(".tabbed-collections__panel");

    this.init();
  }

  init() {
    this.tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => this.handleTabClick(e));
    });

    this.container.addEventListener("keydown", (e) => this.handleKeyboard(e));
  }

  handleTabClick(e) {
    const clickedTab = e.currentTarget;
    const targetIndex = parseInt(clickedTab.dataset.tabIndex);

    this.switchTab(targetIndex);
  }

  switchTab(index) {
    this.tabs.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
      } else {
        tab.classList.remove("active");
        tab.setAttribute("aria-selected", "false");
      }
    });

    this.panels.forEach((panel, i) => {
      if (i === index) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });
  }

  handleKeyboard(e) {
    const currentTab = document.activeElement;

    if (!currentTab.classList.contains("tabbed-collections__tab")) return;

    const currentIndex = parseInt(currentTab.dataset.tabIndex);
    let newIndex = currentIndex;

    if (e.key === "ArrowLeft") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
      e.preventDefault();
    } else if (e.key === "Home") {
      newIndex = 0;
      e.preventDefault();
    } else if (e.key === "End") {
      newIndex = this.tabs.length - 1;
      e.preventDefault();
    } else {
      return;
    }

    this.tabs[newIndex].focus();
    this.switchTab(newIndex);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const tabbedCollectionSections = document.querySelectorAll(
    ".tabbed-collections",
  );

  tabbedCollectionSections.forEach((section) => {
    new TabbedCollections(section);
  });
});

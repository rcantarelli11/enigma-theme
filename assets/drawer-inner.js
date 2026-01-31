class DrawerInner extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      scrollSentinels: "[data-scroll-start], [data-scroll-end]",
      viewport: ".drawer-viewport",
    };
  }

  connectedCallback() {
    this.scrollSentinels = this.querySelectorAll(this.selectors.scrollSentinels);

    this.observer = new IntersectionObserver(this.handleIntersectionChange, {
      root: this.querySelector(this.selectors.viewport),
    });

    this.scrollSentinels.forEach((entry) => this.observer.observe(entry));
  }

  handleIntersectionChange(entries) {
    entries.forEach((entry) => {
      entry.target.setAttribute("data-visible", entry.isIntersecting);
    });
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }
}

if (!customElements.get("drawer-inner")) {
  customElements.define("drawer-inner", DrawerInner);
}

class BlogNavigation extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      mobileNavigationSelect: "#blog-navigation-mobile",
    };
  }

  connectedCallback() {
    this.mobileNavigationSelect = this.querySelector(
      this.selectors.mobileNavigationSelect,
    );
    this.controller = new AbortController();

    this.mobileNavigationSelect?.addEventListener(
      "change",
      (e) => {
        window.location.href = e.target.value;
      },
      {
        signal: this.controller.signal,
      },
    );
  }

  disconnectedCallback() {
    this.eventController.abort();
  }
}

if (!customElements.get("blog-navigation")) {
  customElements.define("blog-navigation", BlogNavigation);
}

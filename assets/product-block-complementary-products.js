class ProductBlockComplementaryProducts extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      block: "[js-product-block-complementary-products-component]",
      item: "[js-complementary-product-item]",
      sliderComponent: "[js-scroll-slider-component]",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();

    if (this.dataset.productSource === "app") {
      this.#loadAppProducts();
    }
  }

  #loadAppProducts() {
    const url = `${window.theme.routes.productRecommendations}?section_id=${this.dataset.sectionId}&limit=${this.dataset.maxProducts}&product_id=${this.dataset.productId}&intent=complementary`;

    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        const doc = new DOMParser().parseFromString(text, "text/html");
        const newSliderComponent = doc.querySelector(
          `${this.selectors.block} ${this.selectors.sliderComponent}`,
        );
        const items = newSliderComponent.querySelectorAll(this.selectors.item);

        if (items.length > 0) {
          const sliderComponent = this.querySelector(
            this.selectors.sliderComponent,
          );

          sliderComponent.replaceWith(newSliderComponent);
        } else {
          if (!Shopify.designMode) {
            this.style.display = "none";
          }
        }
      });
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("product-block-complementary-products")) {
  customElements.define(
    "product-block-complementary-products",
    ProductBlockComplementaryProducts,
  );
}

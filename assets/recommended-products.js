class RecommendedProducts extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      recommendations: "[data-recommendations]",
    };

    this.classes = {
      hidden: "hidden",
      loading: "loading",
    };
  }

  connectedCallback() {
    const { sectionId, productId, productLimit } = this.dataset;

    this.content = this.querySelector(this.selectors.recommendations);

    const requestUrlParams = new URLSearchParams({
      section_id: sectionId,
      limit: productLimit,
      product_id: productId,
    });

    fetch(`${window.theme.routes.productRecommendations}?${requestUrlParams}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const newContent = html.querySelector(this.selectors.recommendations);

        if (newContent.innerHTML.trim() !== "") {
          this.content.innerHTML = newContent.innerHTML;
          this.classList.remove(this.classes.loading);
        } else {
          this.classList.add(this.classes.hidden);
        }
      });
  }
}

if (!customElements.get("recommended-products")) {
  customElements.define("recommended-products", RecommendedProducts);
}

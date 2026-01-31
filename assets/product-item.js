class ProductItem extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      productMediaTemplate: "[js-quick-view-media-template]",
      quickShopButton: "[js-quick-shop-button]",
      swatchImages: "[js-product-item-swatch-image]",
      swatches: "[js-swatch]",
      swatchOverflowButton: "[js-product-listing-swatch-overflow]",
    };

    this.classes = {
      active: "active",
      swatchActive: "swatch-active",
      selectedSwatch: "swatch--selected",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    // Quick shop button present if feature enabled which means swatch overflow link opens modal
    this.quickShopButton = this.querySelector(this.selectors.quickShopButton);

    this.swatchImages = this.querySelectorAll(this.selectors.swatchImages);
    this.swatches = this.querySelectorAll(this.selectors.swatches);
    this.swatchOverflowButton = this.querySelector(
      this.selectors.swatchOverflowButton,
    );

    // If we have swatches, add click listeners to each swatch
    this.swatches.forEach((swatch) => {
      swatch.addEventListener("click", this.handleSwatchClick.bind(this), {
        signal: this.controller.signal,
      });
    });

    // If we have swatch overflow, add a click listener
    if (this.swatchOverflowButton && this.quickShopButton) {
      this.swatchOverflowButton.addEventListener(
        "click",
        this.handleSwatchOverflowClick.bind(this),
        { signal: this.controller.signal },
      );
    }
  }

  handleSwatchClick(event) {
    const swatch = event.currentTarget;

    // If the swatch is already selected, deselect it and return
    if (swatch.classList.contains(this.classes.selectedSwatch)) {
      swatch.classList.remove(this.classes.selectedSwatch);
      this.classList.remove(this.classes.swatchActive);

      for (let i = 0; i < this.swatchImages.length; i++) {
        const swatchImage = this.swatchImages[i];

        if (swatchImage.dataset.swatchValue === swatch.dataset.value) {
          swatchImage.classList.remove(this.classes.active);
          break
        }
      }

      return
    }

    // Hide currently active swatch image
    this.swatchImages.forEach((swatchImage) => {
      swatchImage.classList.remove(this.classes.active);
    });

    // Deselect all swatches
    this.swatches.forEach((swatch) => {
      swatch.classList.remove(this.classes.selectedSwatch);
    });

    // Select the current swatch and show the associated image
    swatch.classList.add(this.classes.selectedSwatch);

    let foundSwatchImage = false;

    for (let i = 0; i < this.swatchImages.length; i++) {
      const swatchImage = this.swatchImages[i];

      if (swatchImage.dataset.swatchValue === swatch.dataset.value) {
        this.classList.add(this.classes.swatchActive);
        swatchImage.classList.add(this.classes.active);
        foundSwatchImage = true;
        break
      }
    }

    if (!foundSwatchImage) {
      this.classList.remove(this.classes.swatchActive);
    }
  }

  handleSwatchOverflowClick() {
    this.openQuickView();
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("product-item")) {
  customElements.define("product-item", ProductItem);
}

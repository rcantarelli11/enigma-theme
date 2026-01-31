import { E as EVENTS } from './events-58bc9098.js';

class ProductBlockVariantSelector extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      variantButton: "[js-variant-button]",
      variantGroup: "[js-variant-group-container]",
      variantLabelValue: "[js-variant-label-value]",
      variantOption: "[js-variant-option]",
      variantInput: "[js-variant-input]",
      noJsVariantSelector: "[js-no-js-variant-selector",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();

    // Listen for variant change
    this.initActiveVariants();

    // Reinitialize listeners on variant change
    this.addEventListener(
      EVENTS.PRODUCT_VARIANT_CHANGED,
      this.handleRepaint.bind(this),
      { signal: this.controller.signal },
    );
  }

  // TODO: This gets called a lot, see if there's a more performant solution
  initActiveVariants() {
    this.activeVariantsController = new AbortController();

    // Remove no-js variant selector to prevent conflicting id's
    this.noJsVariantSelector = this.querySelector(
      this.selectors.noJsVariantSelector,
    );
    this.noJsVariantSelector?.remove();

    this.variantInputs = this.querySelectorAll(this.selectors.variantInput);
    this.variantInputs.forEach((input) => {
      input.addEventListener("change", this.onVariantChange, {
        signal: this.activeVariantsController.signal,
      });
    });

    // Listeners for tabbing and selecting swatches and chips specifically
    this.variantButton = this.querySelectorAll(this.selectors.variantButton);
    this.variantButton.forEach((button) => {
      button.addEventListener(
        "keydown",
        (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            const swatchButton = button.getAttribute("js-swatch");
            const chipButton = button.getAttribute("js-chip");

            if (swatchButton !== null) {
              const swatchWrapper = event.target.parentElement;
              const inputHtml = swatchWrapper.previousElementSibling;

              this.onVariantChangeA11y(inputHtml);
            } else if (chipButton !== null) {
              this.onVariantChangeA11y(event.target.previousElementSibling);
            }
          }
        },
        {
          signal: this.activeVariantsController.signal,
        },
      );
    });
  }

  onVariantChange(event) {
    this.variantLayout = this.getAttribute("data-variant-layout");
    this.swatchOption = this.getAttribute("data-swatch-option");

    switch (this.variantLayout) {
      case "chips":
        event.target.parentElement.parentElement
          .querySelector(".chip--selected")
          .classList.remove("chip--selected");

        event.target.parentElement
          .querySelector("[js-chip]")
          .classList.add("chip--selected");
        break

      case "swatches":
        event.target.parentElement.parentElement
          .querySelector(".swatch--selected")
          .classList.remove("swatch--selected");

        event.target.parentElement
          .querySelector("[js-swatch]")
          .classList.add("swatch--selected");
        break
    }

    let optionValueElement;
    if (this.variantLayout === "swatches" || this.variantLayout === "chips") {
      optionValueElement = event.target;
    } else if (this.variantLayout === "dropdown") {
      optionValueElement = event.target.selectedOptions[0];
    }

    // The current main product can either be the PDP's/Featured Prod or the product within the Quick view
    // TODO: Dry up repetition after binding `this` to onVariantChange to get scope and altering it's internal use of `this`
    const currentMainProductSection = this.closest("[js-product-section]");
    const productWithinQuickView =
      currentMainProductSection.dataset.sectionType === "quick-view-product";

    const variantChangingEvent = new CustomEvent(
      EVENTS.PRODUCT_VARIANT_CHANGING,
      {
        bubbles: true,
        detail: {
          newOptionInput: optionValueElement,
          withinQuickView: productWithinQuickView,
        },
      },
    );

    currentMainProductSection.dispatchEvent(variantChangingEvent);
  }

  onVariantChangeA11y(inputHtml) {
    // The current main product can either be the PDP's/Featured Prod or the product within the Quick view
    const currentMainProductSection = this.closest("[js-product-section]");
    const productWithinQuickView =
      currentMainProductSection.dataset.sectionType === "quick-view-product";

    const variantChangingEvent = new CustomEvent(
      EVENTS.PRODUCT_VARIANT_CHANGING,
      {
        bubbles: true,
        detail: {
          newOptionInput: inputHtml,
          withinQuickView: productWithinQuickView,
        },
      },
    );

    currentMainProductSection.dispatchEvent(variantChangingEvent);
  }

  handleRepaint() {
    this.activeVariantsController.abort();
    this.initActiveVariants();
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("product-block-variant-selector")) {
  customElements.define(
    "product-block-variant-selector",
    ProductBlockVariantSelector,
  );
}

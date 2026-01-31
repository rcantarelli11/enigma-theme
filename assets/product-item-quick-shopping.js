import { d as addItemById, a as contexts } from './cart-cce84c00.js';
import { d as dialog } from './modals-452e00fa.js';
import { E as EVENTS } from './events-58bc9098.js';
import { i as insertedMarkupFixes } from './inserted-markup-fixes-26b497bf.js';
import './svg-images-loaded-7454cac3.js';

class ProductItemQuickShopping extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      allowedProductBlocks: "[js-product-block-allowed-in-quickview]",
      allowedProductDialog: ".product-dialog-allowed-in-quickview",
      storeAvailabilityContent: "[js-store-availability-container]",
      productDetails: "[js-product-details]",
      productMediaTemplate: "[js-quick-view-media-template]",
      productInner: "[js-product-inner]",
      productSection: "[js-product-section]",
      quickShopButton: "[js-quick-shop-button]",
      quickShopButtonWrapper: "[js-quick-shop-button-wrapper]",
      quickShopError: "[js-quick-shop-error]",
      quickViewContent: "[js-quick-view-content]",
      quickViewFullDetailsTemplate: "[js-quick-view-full-details-template]",
      quickViewTemplate: "[js-quick-view-template]",
      quickShoppingWrapper: "[js-quick-shopping-wrapper]",
      removeFromQuickView: "[js-remove-from-quick-view]",
      swatchImages: "[js-product-item-swatch-image]",
      swatches: "[js-swatch]",
      swatchOverflowButton: "[js-product-listing-swatch-overflow]",
    };

    this.classes = {
      hasError: "has-error",
      active: "active",
      quickViewProductInner: "product-inner--quick-view",
      success: "success",
      swatchActive: "swatch-active",
      selectedSwatch: "swatch--selected",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.quickShopButton = this.querySelector(this.selectors.quickShopButton);
    this.quickShopButtonWrapper = this.querySelector(
      this.selectors.quickShopButtonWrapper,
    );

    // Initialize quick shop functionality
    if (this.quickShopButton) {
      this.quickShopType = this.quickShopButton.getAttribute("data-type");
      this.quickShopWithinDialog =
        this.getAttribute("data-within-dialog") === "true";
      this.hasVariants =
        this.quickShopButton.getAttribute("data-has-variants") === "true";

      this.quickShoppingWrapper = this;
      this.quickViewTemplate = this.querySelector(
        this.selectors.quickViewTemplate,
      );

      // TODO: what happens if the same product is rendered in two product items on a page?
      this.quickViewID = `quick-view-${this.getAttribute("data-product-id")}`;

      // Listen for click on quick shop button
      this.quickShopButton.addEventListener(
        "click",
        this.handleQuickShopClick.bind(this),
        { signal: this.controller.signal },
      );

      // Listen for mouseover on quick shop button
      // TODO: see note in handleQuickShopMouseover
      // this.quickShopButton.addEventListener(
      //   "mouseover",
      //   this.handleQuickShopMouseover.bind(this),
      //   { once: true },
      // )

      // If quick shop type is "quick-add" and the product has no variants, add
      // listeners for:
      //   - quick-add success
      //   - quick-add failure
      //   - cart update (clear error)
      if (this.quickShopType === "quick-add" && !this.hasVariants) {
        this.addEventListener(
          EVENTS.QUICK_ADD_SUCCESS,
          this.handleQuickAddSuccess.bind(this),
          { signal: this.controller.signal },
        );

        this.quickShopError = this.querySelector(this.selectors.quickShopError);

        this.addEventListener(
          EVENTS.QUICK_ADD_ERROR,
          this.handleQuickAddError.bind(this),
          { signal: this.controller.signal },
        );

        document.addEventListener(
          EVENTS.CART_CHANGED,
          this.handleCartUpdate.bind(this),
          { signal: this.controller.signal },
        );
      }

      // Listen for "quick add" error to show message and update button state
      this.quickShopButton.addEventListener(
        EVENTS.QUICK_ADD_ERROR,
        this.handleQuickAddError.bind(this),
        { signal: this.controller.signal },
      );
    }
  }

  handleQuickShopClick(event) {
    event.preventDefault();

    if (this.quickShopType === "quick-add" && !this.hasVariants) {
      this.handleQuickAdd();
    } else {
      this.openQuickView();
    }
  }

  // handleQuickShopMouseover() {
  // TODO: this does not work currently, the browser always refetches on click, probably becase
  //  the URL has cache-control:no-cache, no-store - it is possible that this worked on the
  //  section rendering API? if we want to do this here we could fetch on mouseover and store
  //  response here in the custom element, and reuse it if it is not stale upon actual click.
  //   Also would be good to do on variant change in modal
  //   // If the quick view experience can be opened, preload the associated product page
  //   if (
  //     (this.quickShopType === "quick-add" && this.hasVariants) ||
  //     this.quickShopType === "quick-view"
  //   ) {
  //     // this.getQuickViewProductSection()
  //     const prefetchLink = document.createElement("LINK")

  //     prefetchLink.setAttribute("rel", "prefetch")
  //     prefetchLink.setAttribute("href", this.getAttribute("data-product-url"))
  //     prefetchLink.setAttribute("as", "fetch")
  //     prefetchLink.setAttribute("crossorigin", "use-credentials")
  //     prefetchLink.setAttribute("type", "text/html")
  //     document.head.appendChild(prefetchLink)
  //   }
  // }

  handleQuickAdd() {
    this.quickShopButtonWrapper.dispatchEvent(
      new CustomEvent(EVENTS.BUTTON_STATE_STARTED),
    );

    addItemById(
      this.quickShopButton.dataset.variantId,
      1,
      contexts.productItem,
      this,
    );
  }

  handleQuickAddSuccess() {
    this.quickShopButtonWrapper.dispatchEvent(
      new CustomEvent(EVENTS.BUTTON_STATE_COMPLETED),
    );
    this.classList.remove(this.classes.hasError);
  }

  handleQuickAddError(event) {
    this.quickShopButtonWrapper.dispatchEvent(
      new CustomEvent(EVENTS.BUTTON_STATE_INCOMPLETED),
    );

    this.classList.add(this.classes.hasError);
    this.quickShopError.innerText = event.detail.errorMessage;
  }

  handleCartUpdate() {
    this.classList.remove(this.classes.hasError);
  }

  async openQuickView() {
    if (!this.quickViewTemplate) {
      console.debug("openQuickView called when template doesn't exist");
      return
    }

    this.quickShopButtonWrapper.dispatchEvent(
      new CustomEvent(EVENTS.BUTTON_STATE_STARTED),
    );

    const templateContent = this.quickViewTemplate.content.cloneNode(true);
    const quickViewModal = templateContent.querySelector("dialog");

    // Deregistering dialogs is benefitial both within drawers and outside of them
    // to prevent duplicate dialogs in different sections
    if (window.flu.dialogs[this.quickViewID]) {
      window.flu.dialogs[this.quickViewID][1].destroy({
        deregister: true,
      });
    }

    if (this.quickShopWithinDialog) {
      // If the Quick view is nested within another dialog like the Cart drawer
      // the QV dialog needs to be moved outside to prevent nested dialog issues
      const parentDialogContainer = this.closest("dialog").parentElement;
      parentDialogContainer.appendChild(templateContent);
      // Multiple dialogs can be present so the current one needs to be found
      this.quickView = parentDialogContainer.querySelector(
        `dialog[data-fluco-dialog='${this.quickViewID}']`,
      );
      this.quickViewContent = this.quickView.querySelector(
        this.selectors.quickViewContent,
      );
    } else {
      // Prevent appending duplicate dialogs
      if (
        !window.flu.dialogs[
          `quick-view-${this.getAttribute("data-product-id")}`
        ]
      ) {
        this.quickShoppingWrapper.appendChild(templateContent);
        this.quickViewContent = this.querySelector(
          this.selectors.quickViewContent,
        );
      }
    }

    // Create the quick-view-modal if not yet created
    // TODO: can this be a shared modal across products?
    if (
      !window.flu.dialogs[`quick-view-${this.getAttribute("data-product-id")}`]
    ) {
      dialog(quickViewModal);
    }

    // TODO consider breaking this out into something like convertProductPageToQuickView
    const productSection = await this.getQuickViewProductSection();
    const productSectionElement = productSection.cloneNode(false);
    const productSectionInner = productSection
      .querySelector(this.selectors.productInner)
      .cloneNode(false);

    // Note: Quickview specific media markup in a template tag on the product page:
    // Because quick view is not compatable with with photoswipe lightbox (z-index vs dialog stacking context)
    // we need a lightbox-less version of the media here so that when we fetch the product page content for QV
    // we have markup that will work (inline video player etc.).  Originally we tried to fetch the markup as is
    // as manipulate it to support inline playing but there is too much complexity to doing so.  Some improvements
    // here could be to only do this if lightbox is enabled and use the default content if not.
    const productMediaTemplate = productSection.querySelector(
      this.selectors.productMediaTemplate,
    );
    const productMediaFragment = productMediaTemplate.content;

    this.quickViewFullDetailsLink = productSection
      .querySelector(this.selectors.quickViewFullDetailsTemplate)
      ?.content.cloneNode(true);

    const productDetails = productSection
      .querySelector(this.selectors.productDetails)
      .cloneNode(false);

    productSectionElement.setAttribute(
      "data-section-type",
      "quick-view-product",
    );

    // Strip all inline styles from product section otherwise we will be setting color scheme vars
    // here which conflict with with modal vars.  If we ever have PDP vars on here that are relevant
    // outside of color settings, we will need to do something different here
    productSectionElement.style = "";

    // Add a class for styling tweaks
    productSectionInner.classList.add(this.classes.quickViewProductInner);

    // Regardless of the setting on the product page, we want the quick view display to be full width
    productSectionInner.setAttribute("data-mobile-media-width", "full_width");

    // All product blocks that are whitelisted with the js-product-block-allowed-in-quickview attribute
    // are appended in the order that they appear except for buy button which is shifted to the end.
    // Some blocks need specific modifications.
    let buyButtonBlockToInsert;
    productSection
      .querySelectorAll(this.selectors.allowedProductBlocks)
      .forEach((block) => {
        // To avoid glitches with dialogs-inside-dialogs (close button closing both) we detect
        // if there is a whitelisted dialog in the block and inject it after the main quick-view dialog
        if (block.querySelector(this.selectors.allowedProductDialog)) {
          const subDialogs = block.querySelectorAll("dialog");
          subDialogs.forEach((subDialog) => {
            const clonedDialog = subDialog.cloneNode(true);
            subDialog.remove();
            const subDialogId = clonedDialog.getAttribute("data-fluco-dialog");

            // To be safe, lets remove any previous version of this dialog before
            // reinserting/intiting.  TODO: look into better options for this
            if (window.flu.dialogs[subDialogId]) {
              window.flu.dialogs[subDialogId][1].destroy({
                deregister: true,
              });
            }

            document
              .querySelector(`dialog[data-fluco-dialog='${subDialogId}']`)
              ?.remove();

            quickViewModal.after(clonedDialog);
            dialog(clonedDialog);
          });
        }

        // Specific block type conditionals
        if (block.hasAttribute("js-product-block-title")) {
          // Linkify the title block
          const titleLink = document.createElement("a");
          titleLink.setAttribute("href", this.getAttribute("data-product-url"));
          titleLink.innerHTML = block.innerHTML;
          block.replaceChildren(titleLink);
        } else if (block.hasAttribute("js-product-block-buy-buttons")) {
          // Remove store availability content from buy buttons
          block.querySelector(this.selectors.storeAvailabilityContent)?.remove();

          // Add in view full details link
          if (this.quickViewFullDetailsLink) {
            block.append(this.quickViewFullDetailsLink);
          }

          // Buy button is always shifted to end of other blocks
          buyButtonBlockToInsert = block;
          block = null;
        }

        if (block) {
          productDetails.appendChild(block);
        }
      });

    if (buyButtonBlockToInsert) {
      // Store availability and Sticky add to cart need to be removed from Quick view
      const removedFeatures = buyButtonBlockToInsert.querySelectorAll(
        this.selectors.removeFromQuickView,
      );
      removedFeatures?.forEach((feature) => {
        feature.remove();
      });

      productDetails.appendChild(buyButtonBlockToInsert);
    }

    productSectionInner.appendChild(productMediaFragment);
    productSectionInner.appendChild(productDetails);
    productSectionElement.appendChild(productSectionInner);
    insertedMarkupFixes(productSectionElement);

    window.dispatchEvent(
      new CustomEvent(EVENTS.MODAL_POPUP_OPEN(this.quickViewID)),
    );

    this.quickViewContent.replaceChildren(productSectionElement);

    this.quickShopButtonWrapper.dispatchEvent(
      new CustomEvent(EVENTS.BUTTON_STATE_INCOMPLETED),
    );
  }

  async getQuickViewProductSection() {
    const productPage = await fetch(`${this.getAttribute("data-product-url")}`);

    if (productPage) {
      const productPageText = await productPage.text();
      const productDocument = new DOMParser().parseFromString(
        productPageText,
        "text/html",
      );

      return productDocument.querySelector(this.selectors.productSection)
    }
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("product-item-quick-shopping")) {
  customElements.define("product-item-quick-shopping", ProductItemQuickShopping);
}

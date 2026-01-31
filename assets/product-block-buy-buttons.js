import { b as addItemByForm, a as contexts } from './cart-cce84c00.js';
import { E as EVENTS } from './events-58bc9098.js';
import { s as srraf } from './srraf.es-487187f3.js';

class ProductBlockBuyButtons extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      productContainer: "main-product-default, [js-quick-view-content]",
      detailsContainer: ".product__details",
      storeAvailabilityDrawerTrigger: "[js-store-availability-drawer-trigger]",
      variantSelectorContent: "product-block-variant-selector",

      // Sticky add to cart
      footer: "footer",
      buyButtons: "[js-buy-buttons]",
      stickyATC: "[js-sticky-atc]",
      stickyATCAddToCartButton: "[js-sticky-atc-add-to-cart-button-wrapper]",
      stickyATCDialog: "[data-fluco-dialog='sticky-add-to-cart-modal']",
      stickyATCModalHandlebar: "[js-sticky-atc-modal-handlebar]",
      stickyATCModalTrigger: "[js-sticky-atc-modal-trigger]",
      stickyATCModalClose: "[js-sticky-atc-modal-close]",
      stickyATCContent: "[js-sticky-atc-content]",
      stickyATCVariantContainer: "[js-sticky-atc-variant-container]",
      stickyATCVariantInput: "[js-variant-input]",
      stickyATCVariantButton: "[js-variant-button]",

      // Add to cart success and error
      addToCartButton: "[js-add-to-cart-button-wrapper]",
      addToCartError: "[js-add-to-cart-error]",
      giftCardRecipientForm: ".gift-card-recipient__fields",
      giftCardRecipientInput: ".gift-card-recipient__input",
      productForm: "[data-product-form]",
      showGiftCardRecipientCheckbox: "#gift-card-show-form",
    };

    this.classes = {
      hasError: "has-error",
      active: "active",
      changePending: "change-pending",
      heightCheckPending: "height-check-pending",
      delayRevealAnimation: "delay-reveal-animation",
    };

    this.strings = window.theme.strings;
  }

  connectedCallback() {
    this.controller = new AbortController();
    const eventOptions = { signal: this.controller.signal };

    this.productContainer = this.closest(this.selectors.productContainer);
    this.detailsContainer = this.productContainer.querySelector(
      this.selectors.detailsContainer,
    );

    // Listen for quantity change
    this.productContainer.addEventListener(
      EVENTS.QUANTITY_INPUT_CHANGE,
      () => {
        this.classList.remove(this.classes.hasError);
      },
      eventOptions,
    );

    // Listen for variant change
    this.addEventListener(
      EVENTS.PRODUCT_VARIANT_CHANGED,
      this.handleRepaint.bind(this),
      eventOptions,
    );

    this.initContentListeners();

    // Sticky add to cart content & listeners
    this.stickyATC = this.querySelector(this.selectors.stickyATC);

    if (this.stickyATC) {
      // Globally required vars
      this.stickyATCContent = this.querySelector(
        this.selectors.stickyATCContent,
      );
      this.stickyATCHasModalContent =
        this.stickyATC.getAttribute("data-has-modal-content") === "true";

      this.stickyATCAddToCartButtons = this.querySelectorAll(
        this.selectors.stickyATCAddToCartButton,
      );
      this.stickyATCDialog = this.querySelector(this.selectors.stickyATCDialog);

      this.initStickyATC();
    }
  }

  //
  // General setup functions
  //
  initContentListeners() {
    this.contentListenersController = new AbortController();
    const eventOptions = { signal: this.contentListenersController.signal };

    // Assign load and reassign on variant change
    this.addToCartButton = this.querySelector(this.selectors.addToCartButton);

    // Check gift card recipient form setting and gift card product
    this.enableGiftCardRecipientForm =
      this.getAttribute("data-enable-gift-card-recipient-form") === "true";

    this.showGiftCardRecipientCheckbox = this.querySelector(
      this.selectors.showGiftCardRecipientCheckbox,
    );
    if (
      this.enableGiftCardRecipientForm &&
      this.showGiftCardRecipientCheckbox
    ) {
      this.setupGiftCardRecipientForm();
    }

    // Listen for Store availability drawer click
    this.storeAvailabilityDrawerTrigger = this.querySelector(
      this.selectors.storeAvailabilityDrawerTrigger,
    );

    if (this.storeAvailabilityDrawerTrigger) {
      this.drawerId =
        this.storeAvailabilityDrawerTrigger.getAttribute("data-drawer-id");

      this.storeAvailabilityDrawerTrigger.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          window.dispatchEvent(
            new CustomEvent(EVENTS.MODAL_POPUP_OPEN(this.drawerId)),
          );
        },
        eventOptions,
      );
    }

    // Listen for Add to cart submit
    this.productForm = this.querySelector(this.selectors.productForm);
    this.productForm?.addEventListener(
      "submit",
      (event) => {
        this.handleFormSubmission(event);
      },
      eventOptions,
    );

    // Listen for Add to cart error at product container level
    this.addToCartError = this.querySelector(this.selectors.addToCartError);
    this.addEventListener(
      EVENTS.PRODUCT_ADD_ERROR,
      this.handleAddToCartError.bind(this),
      eventOptions,
    );

    // Listen for successfull add to cart
    this.addEventListener(
      EVENTS.PRODUCT_ADD_SUCCESS,
      () => {
        this.classList.remove(this.classes.hasError);
        this.resetGiftCardRecipientForm();
        this.handleAddToCartSuccess();
      },
      eventOptions,
    );
  }

  //
  // Gift card functions
  //
  setupGiftCardRecipientForm() {
    this.giftCardRecipientForm = this.querySelector(
      this.selectors.giftCardRecipientForm,
    );
    this.giftCardRecipientInputs = this.querySelectorAll(
      this.selectors.giftCardRecipientInput,
    );

    // Set default form visibility
    this.showGiftCardRecipientCheckbox.checked = false;
    this.giftCardRecipientForm.style.display = "none";

    // Listen for checked 'show form' input
    this.showGiftCardRecipientCheckbox.addEventListener(
      "change",
      () => {
        if (this.showGiftCardRecipientCheckbox.checked) {
          this.giftCardRecipientForm.style.display = "block";
        } else {
          // Reset required to 'disable' the form's requirements
          this.resetGiftCardRecipientForm();
        }
      },
      { signal: this.controller.signal },
    );
  }

  resetGiftCardRecipientForm() {
    if (!this.giftCardRecipientInputs) {
      return
    }

    this.giftCardRecipientInputs.forEach((input) => {
      input.value = "";
      input.classList.remove("has-error");
    });

    this.showGiftCardRecipientCheckbox.checked = false;
    this.giftCardRecipientForm.style.display = "none";
  }

  //
  // Sticky Add to Cart functions
  //
  initStickyATC(options = {}) {
    if (this.stickyATCHasModalContent) {
      this.initStickyATCModalContent();
    } else {
      this.stickyATC.classList.remove(this.classes.delayRevealAnimation);
    }

    // Sticky ATC IO's need smallest delay to improve display/hide on variant change
    // Most impactful when buy button block is within view on load
    if (options.onVariantChange) {
      setTimeout(() => {
        this.initStickyATCListeners(this.stickyATCHasModalContent);
      }, 0);
    } else {
      this.initStickyATCListeners(this.stickyATCHasModalContent);
    }
  }

  initStickyATCListeners(hasModalContent) {
    this.stickyATCListenersController = new AbortController();
    const eventOptions = { signal: this.stickyATCListenersController.signal };

    // Watch for when Buy button or Footer are in view
    const observerOptions = {
      rootMargin: "0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      let showStickyATC = null;
      for (const entry of entries) {
        showStickyATC = true;
        this.buyButtonsOrFooterIntersecting = entry.isIntersecting;

        if (this.buyButtonsOrFooterIntersecting) {
          if (
            (hasModalContent && !this.stickyATCDialog.open) ||
            !hasModalContent
          ) {
            showStickyATC = false;
            break
          }
        }
      }

      this.updateStickyATCVisibility({ showStickyATC });
    };

    this.observer = new IntersectionObserver(observerCallback, observerOptions);
    this.buyButtonBlock = this.querySelector(this.selectors.buyButtons);
    this.observer.observe(this.buyButtonBlock);
    this.footer = document.querySelector(this.selectors.footer);
    // The theme settings allow for a hidden footer so a check is needed before assigning an observer.
    // The buy button block has to exist for the Sticky ATC to work so no check is needed there.
    if (this.footer) {
      this.observer.observe(this.footer);
    }

    // Prep modal and content
    if (hasModalContent) {
      // Listen for click to open Sticky ATC modal
      // Click (Desktop & mobile) supported for details container
      this.stickyATCModalTrigger = this.stickyATCContent.querySelector(
        this.selectors.stickyATCModalTrigger,
      );
      this.stickyATCModalTrigger.addEventListener(
        "click",
        this.openStickyATCModal,
        eventOptions,
      );

      // Handlebar supports 'swipe' which waits for pointerup for all pointerTypes
      this.peekingStickyATCHandlebar = this.stickyATCContent.querySelector(
        this.selectors.stickyATCModalHandlebar,
      );
      this.activeStickyATCHandlebar = this.stickyATCDialog.querySelector(
        this.selectors.stickyATCModalHandlebar,
      );

      this.peekingStickyATCHandlebar.addEventListener(
        "pointerdown",
        (event) => {
          this.touchSlideStickyATCModal(event, "open");
        },
        eventOptions,
      );

      this.activeStickyATCHandlebar.addEventListener(
        "pointerdown",
        (event) => {
          this.touchSlideStickyATCModal(event, "close");
        },
        eventOptions,
      );

      // Listen for screen width change to update animation height
      this.widthWatcher = srraf(({ vw, pvw }) => {
        if (vw === pvw) return
        this.stickyATCDialog.classList.add(this.classes.heightCheckPending);
        this.setStickyATCAnimationHeight();
      });

      // Listen for Sticky add to cart closing to control animations
      window.addEventListener(
        EVENTS.MODAL_POPUP_CLOSED("sticky-add-to-cart-modal"),
        () => {
          if (this.buyButtonsOrFooterIntersecting) {
            this.updateStickyATCVisibility({ showStickyATC: false });
          }
          this.stickyATCDialog.classList.add("modal--will-open");
        },
        eventOptions,
      );

      // Listen for modal closing via link
      this.stickyATCModalCloseLink = this.stickyATCDialog.querySelector(
        this.selectors.stickyATCModalClose,
      );

      this.stickyATCModalCloseLink.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          this.closeStickyATCModal();
        },
        eventOptions,
      );

      // Listen for cart drawer opening to close modal for animation timing
      window.addEventListener(
        EVENTS.CART_DRAWER_OPENING,
        () => {
          if (this.stickyATCDialog.open) {
            this.closeStickyATCModal();
          }
        },
        eventOptions,
      );

      // Listen for variant clicks within modal
      this.stickyATCVariantInputs = this.querySelectorAll(
        this.selectors.stickyATCVariantInput,
      );
      this.stickyATCVariantInputs.forEach((input) => {
        input.addEventListener(
          "change",
          this.onStickyATCVariantChange,
          eventOptions,
        );
      });

      this.stickyATCVariantButtons = this.querySelectorAll(
        this.selectors.stickyATCVariantButton,
      );
      this.stickyATCVariantButtons.forEach((button) => {
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

                this.onStickyATCVariantChangeA11y(inputHtml);
              } else if (chipButton !== null) {
                this.onStickyATCVariantChangeA11y(
                  event.target.previousElementSibling,
                );
              }
            }
          },
          eventOptions,
        );
      });
    }
  }

  touchSlideStickyATCModal(event, state) {
    this.setPointerCapture(event.pointerId);
    this.onpointerup = () => {
      if (state === "open") {
        this.openStickyATCModal(event);
      } else if (state === "close") {
        this.closeStickyATCModal(event);
      }
    };
  }

  openStickyATCModal(event) {
    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent(EVENTS.MODAL_POPUP_OPEN("sticky-add-to-cart-modal")),
    );
  }

  closeStickyATCModal() {
    window.dispatchEvent(
      new CustomEvent(EVENTS.MODAL_POPUP_CLOSE("sticky-add-to-cart-modal")),
    );
  }

  updateStickyATCVisibility(options = {}) {
    if (options.showStickyATC) {
      this.stickyATC.classList.add(this.classes.active);
      this.visibleStickyATC = true;
    } else {
      this.stickyATC.classList.remove(this.classes.active);
      this.visibleStickyATC = false;
    }
  }

  initStickyATCModalContent() {
    this.variantSelectorContent = document.querySelector(
      this.selectors.variantSelectorContent,
    );
    this.stickyATCVariantContainer = this.stickyATCDialog.querySelector(
      this.selectors.stickyATCVariantContainer,
    );

    this.stickyATCVariantContainer.innerHTML =
      this.variantSelectorContent.innerHTML;

    this.setStickyATCAnimationHeight();
  }

  setStickyATCAnimationHeight() {
    this.stickyATCContent = this.querySelector(this.selectors.stickyATCContent);
    this.peekingHeight = this.stickyATCContent.getBoundingClientRect().height;

    const availableHeight = window.innerHeight * 0.9; // Matching CSS limit of 90svh
    const dialogHeight = this.stickyATCDialog.getBoundingClientRect().height;
    // If available height is smaller (likely on mobile) it needs to set the animation height
    const modalRevealHeight = (
      Math.min(availableHeight, dialogHeight) - this.peekingHeight
    ).toFixed(2);

    this.stickyATCDialog.style.setProperty(
      "--modal-reveal-height",
      `${modalRevealHeight}px`,
    );
    this.stickyATCDialog.classList.remove(this.classes.heightCheckPending);
    // Animation delay is needed otherwise it alters the calculated height
    this.stickyATC.classList.remove(this.classes.delayRevealAnimation);
  }

  onStickyATCVariantChange(event) {
    this.variantLayout = this.getAttribute("data-variant-layout");

    let optionValueElement;
    if (this.variantLayout === "swatches" || this.variantLayout === "chips") {
      optionValueElement = event.target;
    } else if (this.variantLayout === "dropdown") {
      optionValueElement = event.target.selectedOptions[0];
    }

    const variantChangingEvent = new CustomEvent(
      EVENTS.PRODUCT_VARIANT_CHANGING,
      {
        bubbles: true,
        detail: {
          newOptionInput: optionValueElement,
          withinStickyModal: true,
        },
      },
    );

    this.dispatchEvent(variantChangingEvent);
  }

  onStickyATCVariantChangeA11y(inputHtml) {
    const variantChangingEvent = new CustomEvent(
      EVENTS.PRODUCT_VARIANT_CHANGING,
      {
        bubbles: true,
        detail: {
          newOptionInput: inputHtml,
          withinStickyModal: true,
        },
      },
    );

    this.dispatchEvent(variantChangingEvent);
  }

  //
  // Variant and quantity change handling functions
  //
  handleRepaint() {
    this.contentListenersController.abort();
    this.initContentListeners();

    if (this.stickyATC) {
      // Reassign vars to updated content
      this.stickyATCAddToCartButtons = this.querySelectorAll(
        this.selectors.stickyATCAddToCartButton,
      );
      this.stickyATCDialog = this.querySelector(this.selectors.stickyATCDialog);

      this.stickyATCListenersController.abort();
      this.initStickyATC({ onVariantChange: true });
    }
  }

  //
  // Add to cart and newElements results handling functions
  //
  handleFormSubmission(event) {
    event.preventDefault();

    // Animation states
    this.detailsContainer.classList.add(this.classes.changePending);
    this.addToCartButton.dispatchEvent(
      new CustomEvent(EVENTS.BUTTON_STATE_STARTED),
    );

    if (this.stickyATCAddToCartButtons && this.visibleStickyATC) {
      this.stickyATCAddToCartButtons.forEach((button) => {
        button.dispatchEvent(new CustomEvent(EVENTS.BUTTON_STATE_STARTED));
      });
    }

    // Cart API
    addItemByForm(this.productForm, contexts.productPage, this);
  }

  handleAddToCartSuccess() {
    this.detailsContainer.classList.remove(this.classes.changePending);
    this.addToCartButton.dispatchEvent(
      new CustomEvent(EVENTS.BUTTON_STATE_COMPLETED),
    );

    this.productContainer.dispatchEvent(
      new CustomEvent(EVENTS.PRODUCT_ADD_SUCCESS),
    );

    if (this.stickyATCAddToCartButtons) {
      this.stickyATCAddToCartButtons.forEach((button) => {
        button.dispatchEvent(new CustomEvent(EVENTS.BUTTON_STATE_COMPLETED));
      });
    }
  }

  handleAddToCartError(event) {
    this.detailsContainer.classList.remove(this.classes.changePending);
    this.addToCartButton.dispatchEvent(
      new CustomEvent(EVENTS.BUTTON_STATE_INCOMPLETED),
    );

    if (this.stickyATCAddToCartButtons) {
      this.stickyATCAddToCartButtons.forEach((button) => {
        button.dispatchEvent(new CustomEvent(EVENTS.BUTTON_STATE_INCOMPLETED));
      });

      // Close Sticky add to cart modal with form error
      if (this.stickyATCHasVariants && this.stickyATCDialog.open) {
        this.closeStickyATCModal();
      }
    }

    const formErrors = event.detail.errorMessage.errors;
    this.classList.add(this.classes.hasError);

    // Gift card recipient errors can come with better error context
    if (formErrors) {
      const sectionId = this.querySelector(
        this.selectors.giftCardRecipientForm,
      ).getAttribute("data-section-id");
      this.addToCartError.innerText = "";

      Object.entries(formErrors).forEach(([key]) => {
        // Update error field visual and aria
        const errorMessageID = `gift-card-recipient-${key}-error--${sectionId}`;
        const errorInput = this.querySelector(
          `#gift-card-recipient-${key}--${sectionId}`,
        );
        errorInput.classList.add(this.classes.hasError);
        errorInput.setAttribute("aria-invalid", true);
        errorInput.setAttribute("aria-describedby", errorMessageID);

        // List errors together above add to cart button
        this.addToCartError.innerText +=
          `${this.strings.products.giftCardRecipientErrors[key]}` + "\n";
      });
    } else {
      this.addToCartError.innerText = event.detail.errorMessage.description;
    }

    this.addToCartError.scrollIntoView({ block: "center" });
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("product-blocks-buy-buttons")) {
  customElements.define("product-block-buy-buttons", ProductBlockBuyButtons);
}

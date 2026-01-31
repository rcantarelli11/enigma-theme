import { s as svgImagesLoaded, o as oldSafariSrcsetKludge } from './svg-images-loaded-7454cac3.js';
import { E as EVENTS } from './events-58bc9098.js';

class CartContent extends HTMLElement {
  constructor() {
    super();

    this.classes = {
      cartHasChangePending: "change-pending",
      deletionAnimation: "deletion-animation",
      deletionAnimationPending: "deletion-animation-pending",
    };

    this.selectors = {
      shopifySection: ".shopify-section",
      freeShippingBar: "[js-free-shipping-bar]",
      cartItems: "[js-cart-items]",
      cartItem: "cart-item",
      cartItemByKey: (key) => `cart-item[data-cart-item-key="${key}"]`,
      cartItemById: (id) => `cart-item[data-cart-item-id="${id}"]`,
      cartText: "[js-cart-text]",
      cartFooterSubtotal: "[js-cart-footer-subtotal]",
      focusibleItems: "[href], button, input",
      crossSells: "cross-sells",
    };

    this.REFRESH_MODES = {
      FULL: "full",
      PORTIONS: "portions",
    };
  }

  setScrollableViewport() {
    this.scrollableViewport = this.selectors.scrollableViewport
      ? this.querySelector(this.selectors.scrollableViewport)
      : document.documentElement;
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.sectionId = this.dataset.sectionId;
    this.shopifySection = this.closest(this.selectors.shopifySection);
    this.hasDoneInitialRefetch = false;

    this.setScrollableViewport();

    this.addEventListener(EVENTS.CART_ITEM_CHANGE_PENDING, () => {
      this.classList.add(this.classes.cartHasChangePending);
    });

    document.addEventListener(EVENTS.CART_ERROR, () => {
      this.classList.remove(this.classes.cartHasChangePending);
    });

    document.addEventListener(EVENTS.CART_CHANGED, (event) => {
      // Any update to the cart requires the items be replaced with
      // the version from the server.  This is because discounts
      // can impact prices of other items.

      let deletedItemEl;
      let newCartItemAdded = false;
      const cartData = event.detail.cartData;

      if (cartData.items_removed && cartData.items_removed.length) {
        // If the cart update is the result of a fully deleted item, we want to
        // animate out the card before refetching all content.  We can detect if
        // it was deleted vs reduced in quantity by comparing items_removed and items
        const removedItem = cartData.items_removed[0];
        const variantIsStillInCart = cartData.items.find((item) => {
          return item.variant_id === removedItem.variant_id
        });

        if (!variantIsStillInCart) {
          deletedItemEl = this.querySelector(
            this.selectors.cartItemByKey(removedItem.view_key),
          );
        }
      }

      if (cartData.items_added && cartData.items_added.length) {
        // If the cart update resulted in a totally new item being added
        // (not just increase in quantity) we want to know so we can scroll
        // to top of items
        const addedItem = cartData.items_added[0];
        const itemInCart = cartData.items.find((item) => {
          return item.variant_id === addedItem.variant_id
        });

        if (itemInCart.quantity === addedItem.quantity) {
          newCartItemAdded = true;
        }
      }

      if (deletedItemEl) {
        this.#animateOutDeletedItem(deletedItemEl, () => {
          this.refetchContents();
        });
      } else {
        this.refetchContents({ scrollToTop: newCartItemAdded });
      }
    });
  }

  disconnectedCallback() {
    this.controller.abort();
  }

  #animateOutDeletedItem(element, callback) {
    element.style.setProperty("--height", `${element.offsetHeight}px`);
    element.classList.add(this.classes.deletionAnimationPending);
    element.addEventListener(
      "transitionend",
      () => {
        callback();
      },
      {
        signal: this.controller.signal,
        once: true,
      },
    );
    window.requestAnimationFrame(() => {
      element.classList.add(this.classes.deletionAnimation);
    });
  }

  getHTMLFromSectionResponseText(responseText) {
    const responseHTML = document
      .createRange()
      .createContextualFragment(responseText);

    return responseHTML.querySelector(this.tagName)
  }

  /**
   * Determines the way the component updates the UI when the cart has changed.
   * If this returns this.REFRESH_MODES.FULL then it will replace all content
   * whereas this.REFRESH_MODES.PORTIONS will refresh relevant portions for a
   * more seamless experience
   *
   * @param {String} newHTML - The HTML returned via the section rendering API for the cart
   * @return {String} either this.REFRESH_MODES.FULL or this.REFRESH_MODES.PORTIONS
   */
  determineRefreshMode(newHTML) {
    const oldCartItems = this.querySelector(this.selectors.cartItems);
    const newCartItems = newHTML.querySelector(this.selectors.cartItems);

    if (!!oldCartItems !== !!newCartItems) {
      return this.REFRESH_MODES.FULL
    } else {
      return this.REFRESH_MODES.PORTIONS
    }
  }

  swapFullContents(newHTML) {
    this.replaceChildren(...svgImagesLoaded(newHTML).children);
  }

  swapPartialContents(newHTML, options) {
    // Update mode: replace individual components (more seamless)
    const previousScrollTop = this.scrollableViewport.scrollTop;

    const oldCartItems = this.querySelector(this.selectors.cartItems);
    const newCartItems = newHTML.querySelector(this.selectors.cartItems);

    const focusedElement = document.activeElement;
    const focusedCartItem = focusedElement?.closest(this.selectors.cartItem);
    const lastFocusedCartItemId =
      focusedCartItem?.getAttribute("data-cart-item-id");
    const lastFocusedAriaLabel = focusedElement?.getAttribute("aria-label");

    oldCartItems.replaceChildren(...svgImagesLoaded(newCartItems).children);

    oldSafariSrcsetKludge(oldCartItems);

    this.querySelector(this.selectors.cartText).innerHTML =
      newHTML.querySelector(this.selectors.cartText).innerHTML;

    this.querySelector(this.selectors.cartFooterSubtotal).innerHTML =
      newHTML.querySelector(this.selectors.cartFooterSubtotal).innerHTML;

    if (this.querySelector(this.selectors.freeShippingBar)) {
      const newFreeShippingBarEl = newHTML.querySelector(
        this.selectors.freeShippingBar,
      );

      if (newFreeShippingBarEl) {
        this.#updateFreeShippingBarWithNewEl(newFreeShippingBarEl);
      }
    }

    if (this.querySelector(this.selectors.crossSells)) {
      const newCrossSells = newHTML.querySelector(this.selectors.crossSells);

      if (newCrossSells) {
        this.querySelector(this.selectors.crossSells).replaceWith(newCrossSells);
      } else {
        this.querySelector(this.selectors.crossSells).innerHTML = "";
      }
    }

    if (lastFocusedCartItemId) {
      const card = this.querySelector(
        this.selectors.cartItemById(lastFocusedCartItemId),
      );

      if (card) {
        if (lastFocusedAriaLabel) {
          card.querySelector(`[aria-label="${lastFocusedAriaLabel}"]`)?.focus();
        } else {
          card.querySelector(this.selectors.focusibleItems)?.focus();
        }
      } else {
        // if the last focused card was deleted, focus the first card's first focusible item
        this.querySelector(this.selectors.cartItem)
          ?.querySelector(this.selectors.focusibleItems)
          ?.focus();
      }
    }

    if (this.scrollableViewport) {
      if (options.scrollToTop) {
        this.scrollableViewport.scrollTo({
          top: 0,
        });
      } else if (previousScrollTop) {
        this.scrollableViewport.scrollTo({
          top: previousScrollTop,
          behavior: "instant",
        });
      }
    }
  }

  refetchContents(
    options = {
      scrollToTop: false,
    },
  ) {
    this.hasDoneInitialRefetch = true;

    fetch(`${window.location.pathname}?section_id=${this.sectionId}`)
      .then((response) => response.text())
      .then((responseText) => {
        this.classList.remove(this.classes.cartHasChangePending);

        const newHTML = this.getHTMLFromSectionResponseText(responseText);

        if (this.determineRefreshMode(newHTML) === this.REFRESH_MODES.FULL) {
          // Update mode: replace all contents
          this.swapFullContents(newHTML, options);
        } else {
          this.swapPartialContents(newHTML, options);
        }

        oldSafariSrcsetKludge(this);

        if (this.contentsRefetched) {
          this.contentsRefetched();
        }
      });
  }

  #updateFreeShippingBarWithNewEl(element) {
    const freeShippingBar = this.querySelector(this.selectors.freeShippingBar);
    const oldStyle = this.querySelector(
      this.selectors.freeShippingBar,
    ).getAttribute("style");
    const newStyle = element.getAttribute("style");

    // We persist the old style as we swap the content and then update with the
    // new style once swapped, so that the progress bar transitions between values
    element.setAttribute("style", oldStyle);
    freeShippingBar.replaceWith(element);

    setTimeout(() => {
      this.querySelector(this.selectors.freeShippingBar).setAttribute(
        "style",
        newStyle,
      );
    }, 100);
  }
}

if (!customElements.get("cart-content")) {
  customElements.define("cart-content", CartContent);
}

export { CartContent as default };

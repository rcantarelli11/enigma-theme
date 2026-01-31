import { c as changeItemQuantity, a as contexts } from './cart-cce84c00.js';
import { E as EVENTS } from './events-58bc9098.js';

class CartItem extends HTMLElement {
  constructor() {
    super();

    this.classes = {
      changePending: "change-pending",
      deletePending: "delete-pending",
    };

    this.selectors = {
      errorDisplay: "[js-error-display]",
      deleteButton: "[js-delete-button]",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();

    const eventOptions = {
      signal: this.controller.signal,
    };

    this.cartItemKey = this.dataset.cartItemKey;

    // Because the cart re-renders cart items on any update, we can
    // use the data attribute to know the last valid quantity.  This
    // is necessary to revert things on quantity change error
    this.lastConfirmedQuantity = this.dataset.cartItemQuantity;

    this.quantityInput = this.querySelector("quantity-input");
    this.quantityInput.addEventListener(
      EVENTS.QUANTITY_INPUT_CHANGE,
      (event) => {
        this.dispatchEvent(
          new CustomEvent(EVENTS.CART_ITEM_CHANGE_PENDING, {
            bubbles: true,
          }),
        );

        this.classList.add(this.classes.changePending);
        changeItemQuantity(
          this,
          this.cartItemKey,
          event.detail.quantity,
          contexts.cartDrawer,
        );
      },
      eventOptions,
    );

    this.deleteButton = this.querySelector(this.selectors.deleteButton);

    this.deleteButton.addEventListener(
      "click",
      () => {
        this.classList.add(this.classes.deletePending);
        this.dispatchEvent(
          new CustomEvent(EVENTS.CART_ITEM_CHANGE_PENDING, {
            bubbles: true,
          }),
        );
        changeItemQuantity(
          this,
          this.cartItemKey,
          0,
          contexts.cartDrawer,
        );
      },
      eventOptions,
    );

    this.addEventListener(
      EVENTS.CART_ITEM_CHANGE_ERROR,
      (event) => {
        if (this.cartItemKey === event.detail.cartItemKeyOrId) {
          this.#displayErrorMessage(event.detail.errorMessage);
          this.classList.remove(this.classes.changePending);
          if (this.lastConfirmedQuantity !== undefined) {
            this.quantityInput.setQuantity(this.lastConfirmedQuantity);
          }
        }
      },
      eventOptions,
    );
  }

  disconnectedCallback() {
    this.controller.abort();
  }

  #displayErrorMessage(message) {
    this.errorDisplay = this.querySelector(this.selectors.errorDisplay);
    this.errorDisplay.hidden = false;
    this.errorDisplay.innerText = message;
  }
}

if (!customElements.get("cart-item")) {
  customElements.define("cart-item", CartItem);
}

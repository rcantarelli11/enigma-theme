import { E as EVENTS } from './events-58bc9098.js';

class CartCount extends HTMLElement {
  constructor() {
    super();
    this.classes = {
      prepareToUpdate: "prepare-to-update",
      updated: "updated",
    };
  }

  connectedCallback() {
    this.eventController = new AbortController();

    document.addEventListener(
      EVENTS.CART_CHANGED,
      this.handleCartChange.bind(this),
      {
        signal: this.eventController.signal,
      },
    );
  }

  disconnectedCallback() {
    this.eventController.abort();
  }

  handleCartChange(event) {
    if (!Number.isInteger(event.detail.cartData.item_count)) {
      return
    }
    const newCount = parseInt(event.detail.cartData.item_count, 10);

    const currentCount = parseInt(this.dataset.cartCount, 10);

    if (newCount === currentCount) {
      return
    }

    this.classList.add(this.classes.prepareToUpdate);
    setTimeout(() => {
      this.innerText = newCount > 99 ? "99+" : newCount;
      this.dataset.cartCount = newCount;
      this.classList.add(this.classes.updated);
      setTimeout(() => {
        this.classList.remove(
          this.classes.prepareToUpdate,
          this.classes.updated,
        );
      }, 320);
    }, 160);
  }
}

if (!customElements.get("cart-count")) {
  customElements.define("cart-count", CartCount);
}

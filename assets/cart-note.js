import { u as updateNote } from './cart-cce84c00.js';
import { E as EVENTS } from './events-58bc9098.js';

class CartNote extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      textarea: "textarea",
      details: "details",
      errorMessageEl: ".error-display",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.textarea = this.querySelector(this.selectors.textarea);
    this.details = this.querySelector(this.selectors.details);

    this.addEventListener("toggle", this.#handleToggle, {
      signal: this.controller.signal,
      capture: true,
    });

    this.addEventListener(
      EVENTS.CART_NOTE_CHANGED_ERROR,
      (event) => {
        const errorMessageEl = this.querySelector(this.selectors.errorMessageEl);
        errorMessageEl.innerHTML = event.detail.errorMessage;
        errorMessageEl.scrollIntoView();
      },
      {
        signal: this.controller.signal,
      },
    );

    document.addEventListener(
      EVENTS.CART_NOTE_CHANGED,
      (data) => {
        this.committedCartNote = data.note;
      },
      {
        signal: this.controller.signal,
      },
    );

    this.textarea.addEventListener(
      "blur",
      this.#handleTextareaBlur.bind(this),
      {
        signal: this.controller.signal,
      },
    );

    this.committedCartNote = this.textarea.value.trim();
  }

  disconnectedCallback() {
    this.controller.abort();
  }

  #handleToggle(event) {
    if (event.target.open) {
      this.textarea.focus(); // Note, completely uneffective on mobile safari

      // TODO:  The scroll into view is not working reliably, why? Event below
      // is handled in cart-drawer.js and scroll-to-bottom is done to solve for now
      this.textarea.scrollIntoView({ block: "nearest", inline: "nearest" });
      this.dispatchEvent(new Event(EVENTS.CART_NOTE_OPENED, { bubbles: true }));
    }
  }

  #handleTextareaBlur(event) {
    const note = event.target.value.trim();
    this.details.setAttribute("data-populated", !!note.length);

    if (note !== this.committedCartNote) {
      updateNote(this, note);
    }
  }
}

if (!customElements.get("cart-note")) {
  customElements.define("cart-note", CartNote);
}

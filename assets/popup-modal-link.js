import { E as EVENTS } from './events-58bc9098.js';
import { d as dialog } from './modals-452e00fa.js';

const { SHOPIFY_SECTION_LOAD, MODAL_POPUP_OPEN } = EVENTS;

class PopupModalLink extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      link: "[js-popup-modal-link]",
      popupContent: "[js-popup-modal-content]",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.link = this.querySelector(this.selectors.link);
    this.popupId = `popup-modal-${this.dataset.blockId}`;
    this.popupContent = this.querySelector(this.selectors.popupContent);

    this.link.addEventListener("click", this.#handleLinkClick.bind(this), {
      signal: this.controller.signal,
    });

    this.closest(".shopify-section").addEventListener(
      SHOPIFY_SECTION_LOAD,
      () => {
        this.#handleSectionLoad();
      },
      {
        signal: this.controller.signal,
      },
    );
  }

  #handleLinkClick(event) {
    event.preventDefault();

    const dialog = document.querySelector(
      `dialog[data-fluco-dialog='${this.popupId}']`,
    );
    const template = dialog.querySelector("template:not([data-initialized])");

    if (template) {
      template.after(template.content.cloneNode(true));
      template.setAttribute("data-initialized", true);
    }

    window.dispatchEvent(new CustomEvent(MODAL_POPUP_OPEN(this.popupId)));
  }

  #handleSectionLoad() {
    // we need to refresh the modal registry when a block as added/removed
    // TODO: make this a feature that's native to modal.js?

    for (const entry in window.flu.dialogs) {
      window.flu.dialogs[entry][1].destroy({ dom: false });
    }

    window.flu.dialogs = {};

    document
      .querySelectorAll("dialog[data-fluco-dialog]")
      .forEach((el) => dialog(el));
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("popup-modal-link")) {
  customElements.define("popup-modal-link", PopupModalLink);
}

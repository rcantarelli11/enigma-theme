import { s as srraf } from './srraf.es-487187f3.js';
import { E as EVENTS } from './events-58bc9098.js';

class PasswordHeaderWrapper extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      passwordLoginTrigger: "[js-password-login-trigger]",
    };

    this.events = {
      openPasswordLoginModal: new CustomEvent(EVENTS.MODAL_PASSWORD_LOGIN_OPEN),
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.setHeightVariable();
    this.widthWatcher = srraf(({ vw, pvw }) => {
      if (vw === pvw) return
      this.setHeightVariable();
    });

    this.passwordLoginTrigger = this.querySelector(
      this.selectors.passwordLoginTrigger,
    );

    this.passwordLoginTrigger.addEventListener(
      "click",
      this.openPasswordLoginModal.bind(this),
      { signal: this.controller.signal },
    );
  }

  disconnectedCallback() {
    this.widthWatcher?.destroy();
  }

  /**
   * Measures the header's height and applies that value to a document CSS variable.
   */
  setHeightVariable() {
    if (this.offsetHeight !== this.lastSetHeight) {
      document.documentElement.style.setProperty(
        "--header-height",
        `${this.offsetHeight}px`,
      );
      this.lastSetHeight = this.offsetHeight;
    }
  }

  openPasswordLoginModal() {
    window.dispatchEvent(this.events.openPasswordLoginModal);
  }
}

if (!customElements.get("password-header-wrapper")) {
  customElements.define("password-header-wrapper", PasswordHeaderWrapper);
}

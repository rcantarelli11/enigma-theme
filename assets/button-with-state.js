import { E as EVENTS } from './events-58bc9098.js';

class ButtonWithState extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      buttonWithState: "[js-button-with-state]",
    };

    this.classes = {
      active: "active",
      adding: "adding",
      success: "success",
      postSuccess: "post-success",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.buttonWithState = this.querySelector(this.selectors.buttonWithState);

    this.addEventListener(EVENTS.BUTTON_STATE_STARTED, () => {
      this.handleButtonStateStarted();
    });

    this.addEventListener(EVENTS.BUTTON_STATE_COMPLETED, () => {
      this.handleButtonStateCompleted();
    });

    this.addEventListener(EVENTS.BUTTON_STATE_INCOMPLETED, () => {
      this.handleButtonStateIncompleted();
    });
  }

  handleButtonStateStarted() {
    this.buttonWithState.classList.add(this.classes.active, this.classes.adding);
  }

  handleButtonStateCompleted() {
    this.buttonWithState.classList.remove(this.classes.adding);
    this.buttonWithState.classList.add(this.classes.success);

    setTimeout(() => {
      this.buttonWithState.classList.remove(this.classes.success);
      this.buttonWithState.classList.add(this.classes.postSuccess);

      setTimeout(() => {
        this.buttonWithState.classList.remove(
          this.classes.active,
          this.classes.postSuccess,
        );
      }, 1000);
    }, 800);
  }

  handleButtonStateIncompleted() {
    this.buttonWithState.classList.remove(
      this.classes.adding,
      this.classes.active,
    );
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("button-with-state")) {
  customElements.define("button-with-state", ButtonWithState);
}

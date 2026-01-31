import { d as debounce } from './debounce-f0994045.js';
import { E as EVENTS } from './events-58bc9098.js';

class SearchInput extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      clearButton: "[js-clear-button]",
      input: "input[type='search'",
    };

    this.classes = {
      inProgress: "in-progress",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.debounce = debounce();

    this.clearButton = this.querySelector(this.selectors.clearButton);
    this.input = this.querySelector(this.selectors.input);

    this.clearButton.addEventListener(
      "click",
      this.handleClearClicked.bind(this),
      { signal: this.controller.signal },
    );

    this.input.addEventListener("input", () => {
      this.debounce(() => {
        this.dispatchEvent(
          new CustomEvent(EVENTS.SEARCH_INPUT_CHANGED, {
            bubbles: true,
          }),
        );
      });
    });
  }

  handleClearClicked(event) {
    event.preventDefault();

    this.input.value = "";
    this.input.focus();
    this.input.dispatchEvent(new CustomEvent("input"));
  }

  disconnectedCallback() {
    this.controller.abort();
  }

  getValue() {
    return this.input.value.trim()
  }

  focus() {
    this.input.focus();
  }

  setInProgress(inProgress) {
    if (inProgress) {
      this.classList.add(this.classes.inProgress);
    } else {
      this.classList.remove(this.classes.inProgress);
    }
  }
}

if (!customElements.get("search-input")) {
  customElements.define("search-input", SearchInput);
}

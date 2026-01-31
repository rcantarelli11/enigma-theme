import { d as debounce } from './debounce-f0994045.js';
import { E as EVENTS } from './events-58bc9098.js';

class QuantityInput extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector("[js-quantity-input");
    this.minusButton = this.querySelector("[js-quantity-minus]");
    this.plusButton = this.querySelector("[js-quantity-plus]");
    this.debounce = debounce();

    this.input.addEventListener("keyup", this.handleInputKeyup.bind(this));
    this.input.addEventListener("change", this.handleInputChange.bind(this));
    this.minusButton.addEventListener(
      "click",
      this.handleButtonClick.bind(this),
    );
    this.plusButton.addEventListener("click", this.handleButtonClick.bind(this));

    this.lastValue = this.input.value;
    this.updateInputWidth();
  }

  /**
   * Updates the input width based on the number of digits in the value (as the value is typed).
   */
  handleInputKeyup() {
    this.updateInputWidth();
  }

  /**
   * Emits a custom event when the input value has changed. Contains references to the input and each button.
   */
  handleInputChange(event) {
    this.updateInputWidth();

    const inputChangeEvent = new CustomEvent(EVENTS.QUANTITY_INPUT_CHANGE, {
      bubbles: true,
      detail: {
        input: this.input,
        minusButton: this.minusButton,
        plusButton: this.plusButton,
        quantity: parseInt(this.input.value, 10),
        previousQuantity: parseInt(this.lastValue, 10),
      },
    });

    this.dispatchEvent(inputChangeEvent);

    this.lastValue = this.input.value;
  }

  /**
   * Adjusts the input value depending on which button was clicked.
   * @param {object} event - The "click" event.
   */
  handleButtonClick(event) {
    event.preventDefault();

    const currentQuantity = parseInt(this.input.value, 10);
    const minQuantity = parseInt(this.input.getAttribute("min"), 10);

    if (event.currentTarget === this.minusButton) {
      const newQuantity = currentQuantity - 1;

      this.input.value = Math.max(newQuantity, minQuantity);
    } else {
      this.input.value = currentQuantity + 1;
    }

    this.updateInputWidth();

    // Debounce triggering the "change" event so that consecutive clicks don't overload things
    this.debounce(() => this.input.dispatchEvent(new Event("change")));
    return false
  }

  /**
   * Updates the input width based on the number of digits in the value.
   */
  updateInputWidth() {
    this.input.style.setProperty("--num-chars", this.input.value.length);
  }

  /**
   * Allows the value to be updated externally
   */
  setQuantity(value) {
    this.input.value = value;
    this.updateInputWidth();
  }

  disconnectedCallback() {
    this.input.removeEventListener("change", this.handleInputChange);
    this.minusButton.removeEventListener("click", this.handleButtonClick);
    this.plusButton.removeEventListener("click", this.handleButtonClick);
  }
}

if (!customElements.get("quantity-input")) {
  customElements.define("quantity-input", QuantityInput);
}

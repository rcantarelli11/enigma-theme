class PriceRange extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      fromInput: "[js-from-input]",
      toInput: "[js-to-input]",
      fromSlider: "[js-from-slider]",
      toSlider: "[js-to-slider]",
    };

    this.colors = {
      outOfRange: "var(--color-text-alpha-20)",
      inRange: "var(--color-accent)",
    };

    this.events = {
      change: new Event("change", { bubbles: true }),
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.fromInput = this.querySelector(this.selectors.fromInput);
    this.toInput = this.querySelector(this.selectors.toInput);
    this.fromSlider = this.querySelector(this.selectors.fromSlider);
    this.toSlider = this.querySelector(this.selectors.toSlider);
    this.maxValue = parseInt(this.toInput.getAttribute("max"), 10);

    this.inputs = [this.fromInput, this.toInput];
    this.sliders = [this.fromSlider, this.toSlider];

    this.inputs.forEach((input) => {
      input.addEventListener("change", this.handleInputChange.bind(this), {
        signal: this.controller.signal,
      });
    });

    this.sliders.forEach((slider) => {
      slider.addEventListener("input", this.handleSliderChange.bind(this), {
        signal: this.controller.signal,
      });
    });

    this.updateBackground();
  }

  handleInputChange(event) {
    // The filter form acts on any change, so we need to cancel this event to do some validation first
    event.preventDefault();
    event.stopPropagation();

    if (event.target.dataset.inputType === "min") {
      let fromValue = parseInt(event.target.value, 10);
      let toValue = parseInt(this.toInput.value, 10);

      if (fromValue >= toValue || fromValue >= this.maxValue) {
        toValue = Math.min(fromValue + 1, this.maxValue);
        this.toInput.value = toValue;

        if (toValue === this.maxValue) {
          fromValue = toValue - 1;
          event.target.value = fromValue;
        }
      }

      this.fromSlider.value = fromValue;
    } else {
      let fromValue = parseInt(this.fromInput.value, 10);
      let toValue = parseInt(event.target.value, 10);

      if (toValue <= fromValue) {
        fromValue = Math.max(toValue - 1, 0);
        this.fromInput.value = fromValue;

        if (fromValue === 0) {
          toValue = fromValue + 1;
          event.target.value = toValue;
        }
      }

      this.toSlider.value = toValue;
    }

    this.updateBackground();

    // Dispatch change on parent to avoid infinite loop with event beig cancelled above
    event.target.parentNode.dispatchEvent(this.events.change);
  }

  handleSliderChange(event) {
    if (event.target.dataset.inputType === "min") {
      const fromValue = parseInt(event.target.value, 10);

      this.fromInput.value = fromValue;

      if (fromValue === 0) {
        this.fromInput.value = "";
      } else if (fromValue >= parseInt(this.toInput.value, 10) - 1) {
        const newValue = Math.min(fromValue + 1, this.maxValue);

        this.toInput.value = newValue;
        this.toSlider.value = newValue;
      }
    } else {
      const toValue = parseInt(event.target.value, 10);

      this.toInput.value = toValue;

      if (toValue === this.maxValue) {
        this.toInput.value = "";
      } else if (toValue <= parseInt(this.fromInput.value, 10) + 1) {
        const newValue = Math.max(toValue - 1, 0);

        this.fromInput.value = newValue;
        this.fromSlider.value = newValue;
      }
    }

    this.updateBackground();
  }

  updateBackground() {
    const fromValue =
      this.fromInput.value === "" ? 0 : parseInt(this.fromInput.value, 10);
    const toValue =
      this.toInput.value === ""
        ? this.maxValue
        : parseInt(this.toInput.value, 10);
    const fromPositionPercentage = (fromValue / this.maxValue) * 100;
    const toPositionPercentage = (toValue / this.maxValue) * 100;

    this.toSlider.style.background = `linear-gradient(
      to right,
      ${this.colors.outOfRange} 0%,
      ${this.colors.outOfRange} ${fromPositionPercentage}%,
      ${this.colors.inRange} ${fromPositionPercentage}%,
      ${this.colors.inRange} ${toPositionPercentage}%,
      ${this.colors.outOfRange} ${toPositionPercentage}%,
      ${this.colors.outOfRange} 100%
    )`;
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("price-range")) {
  customElements.define("price-range", PriceRange);
}

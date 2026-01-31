class LocalizationForm extends HTMLElement {
  connectedCallback() {
    this.elements = {
      form: this.querySelector("form"),
      input: this.querySelector("[js-localization-input]"),
      options: this.querySelectorAll("[js-localization-option]"),
    };
    this.eventController = new AbortController();

    this.elements.options.forEach((option) =>
      option.addEventListener("click", (e) => this.onOptionClick(e), {
        signal: this.eventController.signal,
      }),
    );
  }

  disconnectedCallback() {
    this.eventController.abort();
  }

  onOptionClick(e) {
    e.preventDefault();
    this.elements.input.value = e.currentTarget.dataset.value;
    this.elements.form.submit();
  }
}

if (!customElements.get("localization-form")) {
  customElements.define("localization-form", LocalizationForm);
}

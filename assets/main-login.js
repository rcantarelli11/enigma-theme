class MainLogin extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      formModeToggle: "[js-form-mode-toggle]",
      formSuccessMessage: ".form-status--success",
      formSuccessRelay: "[js-form-success-relay]",
    };
  }

  connectedCallback() {
    this.urlHash = window.location.hash;
    this.formSuccessMessage = this.querySelector(
      this.selectors.formSuccessMessage,
    );
    this.formModeToggleEls = this.querySelectorAll(
      this.selectors.formModeToggle,
    );
    this.controller = new AbortController();

    if (this.urlHash === "#recover") {
      this.dataset.formMode = "recover";
    } else if (this.formSuccessMessage) {
      const formSuccessRelay = this.querySelector(
        this.selectors.formSuccessRelay,
      );
      formSuccessRelay.replaceWith(this.formSuccessMessage.cloneNode(true));
    }

    this.formModeToggleEls.forEach((element) => {
      element.addEventListener(
        "click",
        () => {
          this.dataset.formMode =
            this.dataset.formMode === "login" ? "recover" : "login";
        },
        {
          signal: this.controller.signal,
        },
      );
    });
  }

  disconnectedCallback() {
    this.eventController.abort();
  }
}

if (!customElements.get("main-login")) {
  customElements.define("main-login", MainLogin);
}

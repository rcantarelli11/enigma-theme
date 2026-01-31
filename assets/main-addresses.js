import { E as EVENTS } from './events-58bc9098.js';

class MainAddresses extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      newAddressButton: "#address-new-button",
      editAddressButton: "#address-edit-button",
      deleteAddressButton: "#address-delete-button",
      countryOption: "[js-country-option]",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();

    this.countryOptions = this.querySelectorAll(this.selectors.countryOption);
    this.deleteAddressButtonEls = this.querySelectorAll(
      this.selectors.deleteAddressButton,
    );
    this.newAddressButton = this.querySelector(this.selectors.newAddressButton);
    this.editAddressButtonEls = this.querySelectorAll(
      this.selectors.editAddressButton,
    );

    this.#setupCountries();

    this.newAddressButton.addEventListener(
      "click",
      () => {
        window.dispatchEvent(new CustomEvent(EVENTS.MODAL_ADDRESS_NEW_OPEN));
      },
      { signal: this.controller.signal },
    );

    this.editAddressButtonEls.forEach((button) => {
      button.addEventListener(
        "click",
        (e) => {
          window.dispatchEvent(
            new CustomEvent(
              EVENTS.MODAL_ADDRESS_EDIT_OPEN(e.target.dataset.addressId),
            ),
          );
        },
        {
          signal: this.controller.signal,
        },
      );
    });

    this.deleteAddressButtonEls.forEach((button) => {
      button.addEventListener(
        "click",
        (e) => {
          const { confirmMessage, target } = e.currentTarget.dataset;
          if (confirm(confirmMessage)) {
            window.Shopify.postLink(target, {
              parameters: { _method: "delete" },
            });
          }
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

  #setupCountries() {
    if (Shopify && Shopify.CountryProvinceSelector) {
      this.countryOptions.forEach((el) => {
        const { formId } = el.dataset;
        const countrySelector = `address-country--${formId}`;
        const provinceSelector = `address-province--${formId}`;
        const containerSelector = `address-province-container--${formId}`;

        new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
          hideElement: containerSelector,
        });
      });
    }
  }
}

if (!customElements.get("main-addresses")) {
  customElements.define("main-addresses", MainAddresses);
}

class AccordionGroup extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      openAccordionItem: "[js-accordion-item][open]",
    };
  }

  connectedCallback() {
    // We don't need to bind 'this' here because the element is already 'this'
    this.addEventListener("toggle", this.handleToggle, true);
  }

  handleToggle(event) {
    // If the accordion only allows a single item to be open at once we close any other open items
    if (event.target.open && this.hasAttribute("data-single-open")) {
      this.querySelectorAll(this.selectors.openAccordionItem).forEach(
        (item) => {
          if (item !== event.target) {
            item.close();
          }
        },
      );
    }
  }

  disconnectedCallback() {
    this.removeEventListener("toggle", this.handleToggle, true);
  }
}

if (!customElements.get("accordion-group")) {
  customElements.define("accordion-group", AccordionGroup);
}

import { E as EVENTS } from './events-58bc9098.js';

const { SHOPIFY_BLOCK_SELECT, SHOPIFY_BLOCK_DESELECT } = EVENTS;

class AccordionItem extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      details: "[js-accordion-item]",
      summary: "[js-accordion-item-summary]",
      content: "[js-accordion-item-content]",
      parentSection: ".shopify-section",
    };

    this.classes = {
      willAnimate: "will-animate",
      animateOpen: "animate-open",
      animateClose: "animate-close",
      animating: "animating",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.accordionItems = this.querySelectorAll(this.selectors.accordionItem);

    this.details = this.querySelector(this.selectors.details);
    this.summary = this.querySelector(this.selectors.summary);
    this.content = this.querySelector(this.selectors.content);
    this.isOpening = false;
    this.isClosing = false;

    this.summary.addEventListener("click", this.handleSummaryClick.bind(this), {
      signal: this.controller.signal,
    });
    this.content.addEventListener(
      "animationend",
      this.handleAnimationEnd.bind(this),
      { signal: this.controller.signal },
    );

    // Block events
    if (window.Shopify.designMode) {
      this.parentSection = this.closest(this.selectors.parentSection);
      this.parentSection.addEventListener(
        SHOPIFY_BLOCK_SELECT,
        this.handleItemSelect.bind(this),
        { signal: this.controller.signal },
      );
      this.parentSection.addEventListener(
        SHOPIFY_BLOCK_DESELECT,
        this.handleItemDeselect.bind(this),
        { signal: this.controller.signal },
      );
    }
  }

  handleSummaryClick(event) {
    event.preventDefault();

    if (this.isClosing || !this.details.open) {
      this.open();
    } else if (this.isOpening || this.details.open) {
      this.close();
    }
  }

  updateHeightVar() {
    this.details.style.setProperty(
      "--accordion-opened-animation-height",
      `${this.content.offsetHeight}px`,
    );
  }

  open() {
    this.details.open = true;
    this.isOpening = true;
    this.isClosing = false;
    this.details.classList.add(this.classes.willAnimate);
    this.updateHeightVar();
    this.details.classList.add(this.classes.animateOpen, this.classes.animating);
  }

  close() {
    this.isClosing = true;
    this.isOpening = false;
    this.details.classList.add(this.classes.willAnimate);
    this.updateHeightVar();
    this.details.classList.add(
      this.classes.animateClose,
      this.classes.animating,
    );
  }

  handleAnimationEnd() {
    if (this.isOpening) {
      this.details.classList.remove(
        this.classes.animateOpen,
        this.classes.willAnimate,
        this.classes.animating,
      );
    }

    if (this.isClosing) {
      this.details.classList.remove(
        this.classes.animateClose,
        this.classes.willAnimate,
        this.classes.animating,
      );
      this.details.open = false;
    }

    this.isOpening = false;
    this.isClosing = false;
  }

  handleItemSelect(event) {
    if (event.detail.blockId === this.getAttribute("data-block-id")) {
      if (this.isClosing || !this.details.open) {
        this.open();
      }
    }
  }

  handleItemDeselect(event) {
    if (event.detail.blockId === this.getAttribute("data-block-id")) {
      if (this.isOpening || this.details.open) {
        this.close();
      }
    }
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("accordion-item")) {
  customElements.define("accordion-item", AccordionItem);
}

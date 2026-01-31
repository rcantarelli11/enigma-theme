/**
 * @class Disclosure
 * @description A webcomponent that uses a base of summary / details elements to enhance a disclosure: a trigger element that displays a popover on click. The enhancements are: closing the popover on document click/change in focus, and animations during open/close
 */

class Disclosure extends HTMLElement {
  constructor() {
    super();

    this.classes = {
      willAnimate: "will-animate",
      animateOpen: "animate-open",
      animateClose: "animate-close",
      animating: "animating",
      userIsTabbing: "user-is-tabbing",
    };
  }

  connectedCallback() {
    this.generalController = new AbortController();
    this.focusController = new AbortController();

    // We don't need to bind 'this' here because the element is already 'this'
    this.addEventListener("toggle", this.handleToggle, true);

    this.disclosureContentEl = this.querySelector(".disclosure-content");
    this.triggerEl = this.querySelector(".disclosure-trigger");
    this.detailsEl = this.querySelector("details");

    this.triggerEl.addEventListener("click", this.onTriggerClick.bind(this), {
      signal: this.generalController.signal,
    });

    this.disclosureContentEl.addEventListener(
      "animationend",
      this.handleAnimationEnd.bind(this),
      { signal: this.generalController.signal },
    );
  }

  handleToggle(event) {
    if (event.target.open) {
      document.addEventListener("click", this.handleOutsideClick.bind(this), {
        signal: this.focusController.signal,
      });

      this.addEventListener("focusout", this.handleFocusOut.bind(this), {
        signal: this.focusController.signal,
      });
    } else {
      this.focusController.abort();
      this.focusController = new AbortController();
    }
  }

  handleOutsideClick(event) {
    if (!this.contains(event.target)) this.close();
  }

  handleFocusOut() {
    if (document.body.classList.contains(this.classes.userIsTabbing)) {
      setTimeout(() => {
        if (!this.contains(document.activeElement)) this.close();
      }, 70);
    }
  }

  onTriggerClick(event) {
    event.preventDefault();
    if (this.isClosing || !this.detailsEl.open) {
      this.open();
    } else if (this.isOpening || this.detailsEl.open) {
      this.close();
    }
  }

  updateHeightVar() {
    this.detailsEl.style.setProperty(
      "--disclosure-opened-animation-height",
      `${this.disclosureContentEl.offsetHeight}px`,
    );
  }

  open() {
    this.detailsEl.open = true;
    this.isOpening = true;
    this.detailsEl.classList.add(this.classes.willAnimate);
    this.updateHeightVar();
    this.detailsEl.classList.add(
      this.classes.animateOpen,
      this.classes.animating,
    );
  }

  close() {
    this.isClosing = true;
    this.detailsEl.classList.add(this.classes.willAnimate);
    this.updateHeightVar();
    this.detailsEl.classList.add(
      this.classes.animateClose,
      this.classes.animating,
    );
  }

  handleAnimationEnd() {
    if (this.isOpening) {
      this.isOpening = false;
      this.detailsEl.classList.remove(
        this.classes.animateOpen,
        this.classes.willAnimate,
        this.classes.animating,
      );
    }

    if (this.isClosing) {
      this.detailsEl.classList.remove(
        this.classes.animateClose,
        this.classes.willAnimate,
        this.classes.animating,
      );
      this.isClosing = false;
      this.detailsEl.open = false;
    }
  }

  disconnectedCallback() {
    this.removeEventListener("toggle", this.handleToggle, true);
    this.generalController.abort();
  }
}

if (!customElements.get("disclosure-component")) {
  customElements.define("disclosure-component", Disclosure);
}

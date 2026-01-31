import { g as getMediaQuery } from './media-queries-5a9283a8.js';
import { E as EVENTS } from './events-58bc9098.js';

const PREFIX = "fluco_";

function localStorageAvailable() {
  const test = "test";

  try {
    localStorage.setItem(test, test);

    if (localStorage.getItem(test) !== test) {
      return false
    }

    localStorage.removeItem(test);
    return true
  } catch {
    return false
  }
}

function getStorage(key) {
  if (!localStorageAvailable()) return null
  return JSON.parse(localStorage.getItem(PREFIX + key))
}

function removeStorage(key) {
  if (!localStorageAvailable()) return null
  localStorage.removeItem(PREFIX + key);
  return true
}

function setStorage(key, value) {
  if (!localStorageAvailable()) return null
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
  return true
}

const { MODAL_POPUP_OPEN, MODAL_POPUP_CLOSE, MODAL_POPUP_CLOSED } = EVENTS;

class PopupBlock extends HTMLElement {
  constructor() {
    super();

    this.classes = { visible: "visible" };

    this.selectors = {
      tab: (id) => `[js-popup-tab][data-id="${id}"]`,
      tabButton: "[js-popup-tab-button]",
      tabDismiss: "[js-dismiss-tab]",
      newsletterForm: "form.content__newsletter-form",
      formSuccessMessage: ".success-display",
      dismissButton: "[js-dismiss-button]",
    };

    this.dataAttributes = {
      id: "data-id",
      popupType: "data-popup-type",
      delayType: "data-delay-type",
      delayValue: "data-delay-value",
      hourFrequency: "data-hour-frequency",
      showOnExitIntent: "data-show-on-exit-intent",
      isSignup: "data-is-signup",
    };
  }

  connectedCallback() {
    this.id = this.getAttribute(this.dataAttributes.id);
    this.popupType = this.getAttribute(this.dataAttributes.popupType);
    this.delayType = this.getAttribute(this.dataAttributes.delayType);
    this.delayValue = parseInt(
      this.getAttribute(this.dataAttributes.delayValue),
      10,
    );
    this.hourFrequency = parseInt(
      this.getAttribute(this.dataAttributes.hourFrequency),
      10,
    );
    this.showOnExitIntent = this.getAttribute(
      this.dataAttributes.showOnExitIntent,
    );
    this.isSignup = this.getAttribute(this.dataAttributes.isSignup) === "true";

    this.tab = this.querySelector(this.selectors.tab(this.id));
    this.formSuccessMessage = this.querySelector(
      this.selectors.formSuccessMessage,
    );
    this.dismissButton = this.querySelector(this.selectors.dismissButton);

    this.storageKey = `popup-${this.id}`;
    this.signupSubmittedKey = `signup-submitted-${this.id}`;
    this.formSuccessKey = `form-success-${this.id}`;
    this.signupDismissedKey = `signup-dismissed-${this.id}`;

    this.signupSubmitted = Boolean(getStorage(this.signupSubmittedKey));
    this.formSuccessShown = Boolean(getStorage(this.formSuccessKey));
    this.signupDismissed = Boolean(getStorage(this.signupDismissedKey));
    this.hasPoppedUp = false;
    this.canPopUp = true;

    this.eventController = new AbortController();

    window.addEventListener(
      MODAL_POPUP_CLOSED(this.id),
      () => this.#handleHidePopup(),
      {
        signal: this.eventController.signal,
      },
    );

    // Check if popup should occur
    this.#shouldPopUp();

    if (this.dismissButton) {
      this.dismissButton.addEventListener(
        "click",
        () => window.dispatchEvent(new CustomEvent(MODAL_POPUP_CLOSE(this.id))),
        {
          signal: this.eventController.signal,
        },
      );
    }

    // Listen for form submission if signup type
    if (this.isSignup) {
      const form = this.querySelector(this.selectors.newsletterForm);
      if (form) {
        form.addEventListener("submit", () => this.#onNewsletterSubmit(), {
          signal: this.eventController.signal,
        });
      }
    }

    // Set up tab if exists
    if (this.tab) {
      const tabButton = this.tab.querySelector(this.selectors.tabButton);
      const tabDismiss = this.tab.querySelector(this.selectors.tabDismiss);

      tabButton.addEventListener("click", () => this.#handleTabClick(), {
        signal: this.eventController.signal,
      });
      tabDismiss.addEventListener("click", () => this.#hideTab(), {
        signal: this.eventController.signal,
      });
    }

    // Show popup immediately if signup form was submitted
    if (this.isSignup && this.formSuccessMessage && !this.formSuccessShown) {
      setStorage(this.formSuccessKey, Date());
      this.#showPopup();
    } else {
      this.#handleDelay();

      if (
        this.showOnExitIntent === "true" &&
        window.matchMedia(getMediaQuery("tablet")).matches
      ) {
        this.#handleExitIntent();
      }
    }
  }

  disconnectedCallback() {
    this.eventController.abort();
  }

  #handleDelay() {
    if (!this.canPopUp) return

    if (this.delayType === "timer") {
      setTimeout(() => {
        if (!this.hasPoppedUp) {
          this.#showPopup();
          setStorage(this.storageKey, Date());
        }
      }, this.delayValue);
    } else if (this.delayType === "scroll") {
      // Delay window / page height calcs until window has loaded
      window.addEventListener(
        "load",
        () => {
          // reduce delay value by 1 to better handle rounding issues
          const scrollPercent = (this.delayValue - 1) / 100;
          const scrollTarget =
            (document.body.scrollHeight - window.innerHeight) * scrollPercent;
          const scrollEventController = new AbortController();

          window.addEventListener(
            "scroll",
            () => {
              if (window.scrollY >= scrollTarget) {
                if (!this.hasPoppedUp) {
                  this.#showPopup();
                  setStorage(this.storageKey, Date());
                }

                scrollEventController.abort();
              }
            },
            {
              signal: scrollEventController.signal,
            },
          );
        },
        {
          once: true,
        },
      );
    }
  }

  #handleExitIntent() {
    if (!this.canPopUp) return
    const mouseoutEventController = new AbortController();

    document.body.addEventListener(
      "mouseout",
      (e) => {
        if (!e.relatedTarget && !e.toElement) {
          if (!this.hasPoppedUp) {
            this.#showPopup();
            setStorage(this.storageKey, Date());
            this.hasPoppedUp = true;
          }

          mouseoutEventController.abort();
        }
      },
      {
        signal: mouseoutEventController.signal,
      },
    );
  }

  #shouldPopUp() {
    // To avoid popups appearing while in the editor we're disabling them
    // Popups will only be visible in customizer when selected
    if (window.Shopify.designMode) {
      this.canPopUp = false;
      return
    }

    // If age has been verified then don't show popup
    // Or signup submitted or dismissed
    // don't show popup
    if (this.isSignup && this.signupSubmitted) {
      this.canPopUp = false;
      return
    }

    if (this.isSignup && !this.signupSubmitted && this.signupDismissed) {
      this.canPopUp = false;
      if (this.tab) {
        this.#showTab();
      }
      return
    }

    // If no date has been set allow the popup to set the first when opened
    if (!this.isSignup && !getStorage(this.storageKey)) {
      return
    }

    // Compare set date and allowed popup frequency hour diff
    const timeStart = new Date(getStorage(this.storageKey));
    const timeEnd = new Date();
    const hourDiff = (timeEnd - timeStart) / 1000 / 60 / 60;

    // Will not allow popup if the hour frequency is below the previously
    // set poppedup date.
    this.canPopUp = hourDiff > this.hourFrequency;
  }

  #handleTabClick() {
    this.#showPopup();
    if (this.popupType === "flyout" && !window.Shopify.designMode) {
      const focusable = this.querySelector(
        "button, [href], input, select, textarea",
      );
      if (focusable) {
        focusable.focus({ preventScroll: true });
      }
    }
  }

  #showPopup() {
    window.dispatchEvent(new CustomEvent(MODAL_POPUP_OPEN(this.id)));

    this.hasPoppedUp = true;
    if (window.Shopify.designMode && this.tab) {
      // Show tab in theme editor
      this.#showTab();
    } else if (this.tab) {
      // hide tab on popup open
      this.tab.classList.remove(this.classes.visible);
    }
  }

  #handleHidePopup() {
    if (this.isSignup && this.tab) {
      setStorage(this.signupDismissedKey, Date());

      if (window.Shopify.designMode && this.tab) {
        this.#hideTab();
        // show tab on close, clicking the tab will open the popup again
      } else if (this.tab) {
        this.#showTab();
      }
    }
  }

  #showTab() {
    this.tab.classList.add(this.classes.visible);
  }

  #hideTab() {
    this.tab.classList.remove(this.classes.visible);
    // When tab is removed we want the popup to be able to open again if it has a frequency
    // We have to remove the storage saying that the popup was dismissed
    removeStorage(this.signupDismissedKey);
  }

  #onNewsletterSubmit() {
    setStorage(this.signupSubmittedKey, Date());
  }
}

if (!customElements.get("popup-block")) {
  customElements.define("popup-block", PopupBlock);
}

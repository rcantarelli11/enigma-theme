import { s as svgImagesLoaded } from './svg-images-loaded-7454cac3.js';
import { i as insertedMarkupFixes } from './inserted-markup-fixes-26b497bf.js';
import CartContent from './cart-content.js';
import { E as EVENTS } from './events-58bc9098.js';
import './modals-452e00fa.js';

const activateTemplate = (key, options = {}) => {
  const templateElement = document.querySelector(
    `template[data-template-key='${key}']`,
  );

  if (!templateElement) {
    if (options.resolveOnMissing) {
      // eslint-disable-next-line no-console
      console.warn(
        "Template not found, resolving because of 'resolveOnMissing option",
      );
      return Promise.resolve({ wasInjected: false })
    }

    return Promise.reject(new Error("Template not found"))
  }

  if (templateElement.hasAttribute("data-has-been-activated")) {
    return Promise.resolve({ wasInjected: false })
  }

  const promise = new Promise((resolve) => {
    const templateClone = svgImagesLoaded(
      templateElement.content.cloneNode(true),
    );

    templateElement.after(templateClone);

    insertedMarkupFixes(templateClone);

    templateElement.setAttribute("data-has-been-activated", true);
    resolve({ wasInjected: true });
  });

  return promise
};

class CartDrawer extends CartContent {
  constructor() {
    super();

    this.classes = {
      ...this.classes,
      freeShippingBarIntialState: "free-shipping-bar--force-progress-to-0",
    };

    this.selectors = {
      ...this.selectors,
      templateTag: "template[data-template-key='cart-drawer']",
      dialogParent: "dialog",
      cartDrawer: "cart-drawer",
      drawerInner: "drawer-inner",
      footer: "[js-drawer-footer]",
      scrollableViewport: ".drawer-viewport",
      inlineSubtotal: "[js-inline-subtotal]",
      keepShoppingButton: "[js-keep-shopping-button]",
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.dialog = this.closest(this.selectors.dialogParent);
    this.eventOptions = this.controller.signal;

    setTimeout(() => {
      // There is a Shopify quirk where images via storefront rendering use "shop.myshopify.com/cdn", but
      // images via section rendering use "cdn.shopify.com". This leads to visual glitches when
      // "#refetchContents()" runs and refreshes the cart (while cart drawer is open).
      //
      // To mitigate this, we can refetch preemptively when the cart is closed so that any
      // future updates have reduced glitches because the initial markup is already swapped.
      //
      // Other have noted this in the Partners slack:
      //   https://shopifypartners.slack.com/archives/C4E704GBX/p1712156095481229
      if (!this.hasDoneInitialRefetch && !this.dialog.open) {
        super.refetchContents();
      }
    }, 3000);

    if (window?.Shopify?.designMode) {
      this.#bindThemeEditorEvents();
    }

    window.addEventListener(
      EVENTS.CART_DRAWER_OPENING,
      () => {
        activateTemplate("cart-drawer", { resolveOnMissing: true }).then(
          (data) => {
            if (data.wasInjected) {
              this.setScrollableViewport();
              this.#bindElementEvents();
            }

            const freeShippingBar = this.querySelector(
              this.selectors.freeShippingBar,
            );

            if (freeShippingBar) {
              freeShippingBar.classList.add(
                this.classes.freeShippingBarIntialState,
              );
              setTimeout(() => {
                freeShippingBar.classList.remove(
                  this.classes.freeShippingBarIntialState,
                );
              }, 600);
            }
          },
        );
      },
      this.eventOptions,
    );

    document.addEventListener(EVENTS.CART_ITEM_ADDED, () => {
      this.scrollableViewport.scrollTo({
        top: 0,
        behavior: this.dialog.open ? "smooth" : "instant",
      });
    });
  }

  getHTMLFromSectionResponseText(responseText) {
    // Overide: the drawer features a template, we have to override
    // this function from the super class

    const responseHTML = document
      .createRange()
      .createContextualFragment(responseText);

    const templateContent = responseHTML.querySelector(
      this.selectors.templateTag,
    ).innerHTML;

    const templateContentHTML = document
      .createRange()
      .createContextualFragment(templateContent);

    return templateContentHTML
  }

  swapFullContents(newHTML) {
    this.replaceChildren(...newHTML.children);
  }

  determineRefreshMode(newHTML) {
    const oldCartItems = this.querySelector(this.selectors.cartItems);
    const newCartItems = newHTML.querySelector(this.selectors.cartItems);

    if (!this.dialog.open || !!oldCartItems !== !!newCartItems) {
      return this.REFRESH_MODES.FULL
    } else {
      return this.REFRESH_MODES.PORTIONS
    }
  }

  contentsRefetched() {
    this.setScrollableViewport();
    this.#bindElementEvents();
  }

  #handleCartTextIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting !== this.cartTextIsVisible) {
        this.cartTextIsVisible = entry.isIntersecting;
        this.dataset.cartTextIsVisible = entry.isIntersecting;
      }
    });
  }

  #bindElementEvents() {
    // TODO: cart-note.js should scroll textarea into view but it
    // is not working reliably, so scrolling to bottom here for now
    this.addEventListener(
      EVENTS.CART_NOTE_OPENED,
      () => {
        if (this.scrollableViewport) {
          this.scrollableViewport.scrollTop =
            this.scrollableViewport.scrollHeight;
        }
      },
      {
        signal: this.controller.signal,
      },
    );

    this.keepShoppingButton = this.querySelector(
      this.selectors.keepShoppingButton,
    );

    this.keepShoppingButton?.addEventListener(
      "click",
      () => {
        window.dispatchEvent(new Event(EVENTS.CART_DRAWER_CLOSE));
      },
      {
        signal: this.controller.signal,
      },
    );

    const inlineSubtotal = this.querySelector(this.selectors.inlineSubtotal);

    if (this.inlineSubtotalIntersectionObserver) {
      this.inlineSubtotalIntersectionObserver.disconnect();
      this.inlineSubtotalIntersectionObserver = null;
    }

    if (inlineSubtotal) {
      this.inlineSubtotalIntersectionObserver = new IntersectionObserver(
        this.#handleCartTextIntersection.bind(this),
        {
          root: this.scrollableViewport,
          rootMargin: "0px 0px -95px 0px",
          threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        },
      );

      this.inlineSubtotalIntersectionObserver.observe(inlineSubtotal);
    }
  }

  #bindThemeEditorEvents() {
    document.addEventListener(
      EVENTS.SHOPIFY_SECTION_SELECT,
      (event) => {
        if (event.target === this.shopifySection) {
          window.dispatchEvent(new Event(EVENTS.CART_DRAWER_OPEN));
        }
      },
      this.eventOptions,
    );

    document.addEventListener(
      EVENTS.SHOPIFY_SECTION_DESELECT,
      (event) => {
        if (event.target === this.shopifySection) {
          window.dispatchEvent(new Event(EVENTS.CART_DRAWER_CLOSE));
          this.openedViaThemeEditorEvents = false;
        }
      },
      this.eventOptions,
    );
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("cart-drawer")) {
  customElements.define("cart-drawer", CartDrawer);
}

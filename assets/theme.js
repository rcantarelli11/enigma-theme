var pageTransition = () => {
  const pageTransitionOverlay = document.querySelector(
    "#page-transition-overlay",
  );
  const animationDuration = 200;

  if (pageTransitionOverlay) {
    pageTransitionOverlay.classList.remove("skip-transition");

    setTimeout(function () {
      pageTransitionOverlay.classList.remove("active");
    }, 0);

    setTimeout(() => {
      // Prevent the theme editor from seeing this
      pageTransitionOverlay.classList.remove("active");
    }, animationDuration);

    document.body.addEventListener("click", (event) => {
      const target = event.target;

      // Only want links...
      if (
        target.tagName !== "A" ||
        !target.getAttribute("href") ||
        target.getAttribute("target") === "_blank" ||
        target.classList.contains("no-transition")
      ) {
        return
      }

      const href = target.getAttribute("href");

      // That aren't anchors or mailto/tel links
      if (
        href[0] === "#" ||
        href.indexOf("mailto:") === 0 ||
        href.indexOf("tel:") === 0
      ) {
        return
      }

      onClickedToLeave(event, target);
    });

    window.onpageshow = function (e) {
      if (e.persisted) {
        pageTransitionOverlay.classList.remove("active");
      }
    };
  }

  function onClickedToLeave(event, target) {
    // avoid interupting open-in-new-tab click
    if (event.ctrlKey || event.metaKey) return

    event.preventDefault();

    // Hint to browser to prerender destination
    const linkHint = document.createElement("link");
    linkHint.setAttribute("rel", "prerender");
    linkHint.setAttribute("href", target.href);

    document.head.appendChild(linkHint);

    setTimeout(() => {
      window.location.href = target.href;
    }, animationDuration);

    pageTransitionOverlay.classList.add("active");
  }
};

const handleTab = () => {
  const formElments = ["input", "textarea", "select"];

  // Determine if the user is a mouse or keyboard user
  function handleFirstTab(event) {
    if (
      event.key === "Tab" &&
      !formElments.includes(document.activeElement.tagName.toLowerCase())
    ) {
      document.body.classList.add("user-is-tabbing");

      window.addEventListener("mousedown", handleMouseDownOnce);
      window.removeEventListener("keydown", handleFirstTab);
    }
  }

  function handleMouseDownOnce() {
    document.body.classList.remove("user-is-tabbing");

    window.addEventListener("keydown", handleFirstTab);
    window.removeEventListener("mousedown", handleMouseDownOnce);
  }

  window.addEventListener("keydown", handleFirstTab);
};

var n,e,i,o,t,r,f,d,p,u=[];function w(n,a){return e=window.pageXOffset,o=window.pageYOffset,r=window.innerHeight,d=window.innerWidth,void 0===i&&(i=e),void 0===t&&(t=o),void 0===p&&(p=d),void 0===f&&(f=r),(a||o!==t||e!==i||r!==f||d!==p)&&(!function(n){for(var w=0;w<u.length;w++)u[w]({x:e,y:o,px:i,py:t,vh:r,pvh:f,vw:d,pvw:p},n);}(n),i=e,t=o,f=r,p=d),requestAnimationFrame(w)}function srraf(e){return u.indexOf(e)<0&&u.push(e),n=n||w(performance.now()),{update:function(){return w(performance.now(),!0),this},destroy:function(){u.splice(u.indexOf(e),1);}}}

const EVENTS = {
  QUANTITY_INPUT_CHANGE: "quantity-input:quantity-changed",
  QUICK_ADD_SUCCESS: "quick-add:success",
  QUICK_ADD_ERROR: "quick-add:error",

  PRODUCT_VARIANT_CHANGING: "product:variant:changing",
  PRODUCT_VARIANT_CHANGED: "product:variant:changed",
  PRODUCT_ADD_SUCCESS: "product-add:success",
  PRODUCT_ADD_ERROR: "product-add:error",

  CART_ITEM_ADDED: "cart:item-added",
  CART_ITEM_CHANGED: "cart:item-changed",
  CART_ITEM_CHANGE_ERROR: "cart:item-change:error",
  CART_ITEM_REMOVED: "cart:item-removed",
  CART_NOTE_CHANGED: "cart:note-changed",
  CART_NOTE_CHANGED_ERROR: "cart:note-changed:error",
  CART_CHANGED: "cart:changed",
  CART_ERROR: "cart:error",
  CART_ITEM_CHANGE_PENDING: "cart:item-change-pending",

  CART_DRAWER_OPENING: "fluco:modal:cartDrawer:opening",
  CART_DRAWER_OPEN: "fluco:modal:cartDrawer:open",
  CART_DRAWER_CLOSE: "fluco:modal:cartDrawer:close",

  CART_NOTE_OPENED: "cart-note:opened",

  FILTER_REPAINT: "fluco:filters:repaint",
  FILTER_SORT_CHANGED: "fluco:filter-sort:changed",
  SORT_CHANGED: "fluco:sort:changed",

  ANNOUNCEMENT_HEIGHT_UPDATED: "fluco:announcement-height:updated",
  HEADER_HEIGHT_UPDATED: "fluco:header-height:updated",

  SHOPIFY_BLOCK_SELECT: "shopify:block:select",
  SHOPIFY_BLOCK_DESELECT: "shopify:block:deselect",

  SHOPIFY_SECTION_DESELECT: "shopify:section:deselect",
  SHOPIFY_SECTION_SELECT: "shopify:section:select",
  SHOPIFY_SECTION_LOAD: "shopify:section:load",
  SHOPIFY_SECTION_UNLOAD: "shopify:section:unload",

  ANNOUNCEMENT_BAR_STICKY_CHANGE: "fluco:announcement-bar:sticky-change",

  MODAL_PASSWORD_LOGIN_OPEN: "fluco:modal:passwordLogin:open",

  MODAL_ADDRESS_NEW_OPEN: "fluco:modal:new-address:open",
  MODAL_ADDRESS_EDIT_OPEN: (addressId) =>
    `fluco:modal:edit-address-${addressId}:open`,

  MODAL_POPUP_OPEN: (id) => `fluco:modal:${id}:open`,
  MODAL_POPUP_OPENING: (id) => `fluco:modal:${id}:opening`,
  MODAL_POPUP_CLOSE: (id) => `fluco:modal:${id}:close`,
  MODAL_POPUP_CLOSING: (id) => `fluco:modal:${id}:closing`,
  MODAL_POPUP_CLOSED: (id) => `fluco:modal:${id}:closed`,

  IMPACT_LOGO_LOADED: "fluco:impact-logo:loaded",
  IMPACT_LOGO_NOT_VISIBLE: "fluco:impact-logo:not-visible",
  IMPACT_LOGO_PARTIALLY_VISIBLE: "fluco:impact-logo:partially-visible",
  IMPACT_LOGO_VISIBLE: "fluco:impact-logo:visible",

  MODAL_MOBILE_CROSSBORDER_LANGUAGE_DRAWER_OPEN:
    "fluco:modal:mobileLanguageDrawer:open",
  MODAL_MOBILE_CROSSBORDER_COUNTRY_DRAWER_OPEN:
    "fluco:modal:mobileCountryDrawer:open",

  SCROLL_SLIDER_CHANGED: (scrollerId) =>
    `scroll-slider-${scrollerId}:slide-changed`,
  SCROLL_SLIDER_INIT: (scrollerId) => `scroll-slider-${scrollerId}:init`,
  SCROLL_SLIDER_INITIALIZED: (scrollerId) =>
    `scroll-slider-${scrollerId}:initialized`,
  SCROLL_SLIDER_GO_TO_SLIDE: (scrollerId) =>
    `scroll-slider-${scrollerId}:go-to-slide`,

  // TODO Consider renaming these events: see usage in product-item.js related to quickview where
  // it feels a bit off to use "STARTED" or "INCOMPLETED", because we are not actually doing any request,
  // just waiting for content to load
  BUTTON_STATE_STARTED: "fluco:button-state:started", // TODO: Consider naming this BUTTON_STATE_LOADING
  BUTTON_STATE_COMPLETED: "fluco:button-state:completed", // ODO: Consider naming this BUTTON_STATE_SUCCESS
  BUTTON_STATE_INCOMPLETED: "fluco:button-state:incompleted", // TODO: consider renaming this BUTTON_STATE_NORMAL

  SEARCH_INPUT_CHANGED: "fluco:search-input:changed",

  PREDICTIVE_SEARCH_DRAWER_OPENING:
    "fluco:modal:predictiveSearchDrawer:opening",
  PREDICTIVE_SEARCH_DRAWER_OPEN: "fluco:modal:predictiveSearchDrawer:open",
  PREDICTIVE_SEARCH_DRAWER_CLOSE: "fluco:modal:predictiveSearchDrawer:close",

  WINDOW_RESIZED: "fluco:window:resized",
  WINDOW_WIDTH_CHANGED: "fluco:window:width-changed",
  WINDOW_ABOVE_BREAKPOINT: (breakpoint) => `fluco:window:above-${breakpoint}`,
  WINDOW_BELOW_BREAKPOINT: (breakpoint) => `fluco:window:below-${breakpoint}`,
};

const breakpoints = [480, 720, 960, 1024, 1200, 1400];
const reversedBreakpoints = breakpoints.reverse();

const widthWatcher = () => {
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth;

  let lastSize = viewportWidth;

  srraf(({ vw }) => {
    document.dispatchEvent(new CustomEvent(EVENTS.WINDOW_RESIZED));

    if (vw > lastSize) {
      breakpoints.forEach((width) => {
        if (lastSize < width && vw >= width) {
          document.dispatchEvent(
            new CustomEvent(EVENTS.WINDOW_ABOVE_BREAKPOINT(width)),
          );
        }
      });
    } else {
      reversedBreakpoints.forEach((width) => {
        if (lastSize > width && vw < width) {
          document.dispatchEvent(
            new CustomEvent(EVENTS.WINDOW_BELOW_BREAKPOINT(width)),
          );
        }
      });
    }

    if (vw !== lastSize) {
      document.dispatchEvent(new CustomEvent(EVENTS.WINDOW_WIDTH_CHANGED));
    }

    lastSize = vw;
  });
};

/* eslint-disable accessor-pairs */

/**
 * @class Dialog
 * @description A dialog class
 * @param {HTMLElement} element - The dialog element
 *
 * @property {Object} data - The dialog data
 * @property {HTMLElement} data.element - The dialog element
 * @property {string} data.id - The dialog id
 * @property {HTMLElement} data.title - The dialog title element
 * @property {HTMLElement} data.description - The dialog description element
 *
 * @property {HTMLElement} data.content - The dialog content element
 *
 * @property {boolean} [reusable=false] - If the dialog should be reused
 * @property {boolean} [blurDismiss=false] - If the dialog should be closed on blur
 * @property {boolean} [modal=false] - If the dialog should be a modal
 * @property {boolean} [backdropDismiss=false] - If the dialog should be closed on backdrop click
 * @property {boolean} [closeButton=false] - If the dialog should have a close button
 * @property {Function} [callbackOpen] - Callback function to be called when the dialog is opened
 * @property {Function} [callbackClose] - Callback function to be called when the dialog is closed
 */
class Dialog {
  #config = {
    openMethod: "show",
    reusable: false,
    dynamicContent: false,
    blurDismiss: false,
  }

  /**
   * @constructor
   * @param {HTMLElement} element - The dialog element
   * @returns {Dialog} The dialog instance
   */
  constructor(element) {
    // Setup global flu dialog registry
    if (!window.flu) window.flu = {};
    if (!window.flu.dialogs) window.flu.dialogs = {};

    // Attempting to initialize a dialog with the same name as existing will return existing dialog instance
    if (window.flu.dialogs[element.dataset.flucoDialog]) {
      console.error(
        `Dialog with id ${element.dataset.flucoDialog} already exists`,
      );

      return window.flu.dialogs[element.dataset.flucoDialog]
    }

    this.data = {
      element,
      id: element.dataset.flucoDialog,
      title: element.querySelector("[data-title]"),
      description: element.querySelector("[data-description]"),
      content: element.querySelector("[data-content]"),
    };

    // add dialog to global flu dialog registry
    this.#registerDialog(element);
    this.eventController = new AbortController();
    this.eventOptions = { signal: this.eventController.signal };

    window.addEventListener(
      `fluco:modal:${this.data.id}:open`,
      (data) => {
        this.open(data);
      },
      this.eventOptions,
    );

    window.addEventListener(
      `fluco:modal:${this.data.id}:close`,
      () => {
        this.close();
      },
      this.eventOptions,
    );

    // Prevent "esc" key closing the dialog directly so we have time to animate out
    this.data.element.addEventListener("cancel", (event) => {
      event.preventDefault();
      this.close();
    });

    // Prevent close button from closing the dialog directly so we have time to animate out
    // Delegate binding so that close buttons in `template` tags are caught
    this.data.element.addEventListener("click", (event) => {
      if (event.target.closest("form[method='dialog']")) {
        this.#handleCloseButtonClick(event);
      }
    });
  }

  /**
   * @property {string} title - The dialog title
   * @example
   * dialog.title = 'My Dialog'
   */
  set title(value) {
    this.data.title.textContent = value;
  }

  /**
   * @method setTitle
   * @param {string} title - The dialog title
   * @returns {Dialog} The dialog instance
   * @example
   * dialog.setTitle('My Dialog')
   */
  setTitle(title) {
    this.title = title;

    return this
  }

  /**
   * @property {string} description - The dialog description
   * @example
   * dialog.description = 'My Dialog Description'
   */
  set description(value) {
    this.data.description.textContent = value;
  }

  /**
   * @method setDescription
   * @param {string} description - The dialog description
   * @returns {Dialog} The dialog instance
   * @example
   * dialog.setDescription('My Dialog Description')
   */
  setDescription(description) {
    this.description = description;

    return this
  }

  /**
   * @property {string} content - The dialog content
   * @example
   * dialog.content = 'My Dialog Content'
   */
  set content(value) {
    this.data.content.innerHTML = value;
  }

  /**
   * @method setContent
   * @param {string} content - The dialog content
   * @returns {Dialog} The dialog instance
   * @example
   * dialog.setContent('My Dialog Content')
   */
  setContent(content) {
    this.content = content;

    return this
  }

  /**
   * @property {boolean} reusable - If the dialog should be reusable
   * @example
   * dialog.reusable = true
   */
  set reusable(value) {
    if (typeof value !== "boolean") return
    this.#config.reusable = value;
  }

  /**
   * @method setReusable
   * @param {boolean} reusable - If the dialog should be reusable
   * @returns {Dialog} The dialog instance
   * @example
   * dialog.setReusable(true)
   */
  setReusable(reusable) {
    this.reusable = reusable;

    return this
  }

  /**
   * @property {boolean} blurDismiss - If the dialog should be closed on blur
   * @example
   * dialog.blurDismiss = true
   */
  set blurDismiss(value) {
    if (typeof value !== "boolean") return

    this.#config.blurDismiss = value;
  }

  /**
   * @method setBlurDismiss
   * @param {boolean} blurDismiss - If the dialog should be closed on blur
   * @returns {Dialog} The dialog instance
   * @example
   * dialog.setBlurDismiss(true)
   */
  setBlurDismiss(blurDismiss) {
    this.blurDismiss = blurDismiss;

    return this
  }

  /**
   * @property {boolean} modal - If the dialog should be a modal
   * @example
   * dialog.modal = true
   */
  set modal(value) {
    if (typeof value === "boolean" && value) {
      this.#config.openMethod = "showModal";
    }
  }

  /**
   * @method setModal
   * @param {boolean} modal - If the dialog should be a modal
   * @returns {Dialog} The dialog instance
   * @example
   * dialog.setModal(true)
   */
  setModal(modal) {
    this.modal = modal;

    return this
  }

  /**
   * @property {boolean} backdropDismiss - If the dialog should be closed on backdrop click
   * @example
   * dialog.backdropDismiss = true
   */
  set backdropDismiss(value) {
    if (typeof value === "boolean" && value) {
      this.data.element.addEventListener("click", (event) => {
        // A click on this.data.element is anywhere on the dialog element directly, or its ::backdrop
        // Direct clicks to element should be prevented by always including a full width/height element
        // within the dialog.  We do not want the dialog itself to close on click
        if (event.target === this.data.element) {
          this.close();
        }
      });
    }
  }

  /**
   * @method setBackdropDismiss
   * @param {boolean} backdropDismiss - If the dialog should be closed on backdrop click
   * @returns {Dialog} The dialog instance
   * @example
   * dialog.setBackdropDismiss(true)
   */
  setBackdropDismiss(backdropDismiss) {
    this.backdropDismiss = backdropDismiss;

    return this
  }

  /**
   * @property {Function} callbackOpen - Callback function to be called when the dialog is opened
   * @example
   * dialog.callbackOpen = (dialog) => console.log(dialog)
   */
  set callbackOpen(callback) {
    callback(this);
  }

  /**
   * @method setCallbackOpen
   * @param {Function} callback - Callback function to be called when the dialog is opened
   * @returns {Dialog} The dialog instance
   * @example
   * dialog.setCallbackOpen((dialog) => console.log(dialog))
   */
  setCallbackOpen(callback) {
    this.callbackOpen = callback;

    return this
  }

  /**
   * @property {Function} callbackClose - Callback function to be called when the dialog is closed
   * @example
   * dialog.callbackClose = (dialog) => console.log(dialog)
   */
  set callbackClose(callback) {
    callback(this);
  }

  /**
   * @method setCallbackClose
   * @param {Function} callback - Callback function to be called when the dialog is closed
   * @returns {Dialog} The dialog instance
   * @example
   * dialog.setCallbackClose((dialog) => console.log(dialog))
   */
  setCallbackClose(callback) {
    this.callbackClose = callback;

    return this
  }

  /**
   * @method open
   * @param {Object} detail - The dialog detail
   * @param {string} detail.title - The dialog title
   * @param {string} detail.description - The dialog description
   * @param {string} detail.content - The dialog content
   * @returns {Dialog} The dialog instance
   * @example
   * dialog.open({ title: 'My Dialog', description: 'My Dialog Description', content: 'My Dialog Content' })
   */
  open({ detail } = {}) {
    this.data.element.classList.remove("modal--will-close");

    return this.#emit("opening")
      .#setDynamicContent(detail)
      .#open()
      .#blurDismiss()
      .#emit("opened")
      .#callback(this.callbackOpen)
  }

  /**
   * @method close
   * @returns {Dialog} The dialog instance
   * @example
   * dialog.close()
   */
  close() {
    this.data.element.classList.add("modal--will-close");

    // Detect close animations and wait for them to complete before closing
    // this requires that animations are applied but not run with "modal--will-close"
    // and actually run with "modal--trigger-close-animation"
    const closeAnimations = this.data.element.getAnimations();
    const actuallyClose = () => {
      return this.#emit("closing")
        .#close()
        .clear()
        .#emit("closed")
        .#callback(this.callbackClose)
    };

    if (closeAnimations.length) {
      this.data.element.addEventListener(
        "animationend",
        () => {
          this.data.element.classList.remove(
            "modal--trigger-close-animation",
            "modal--will-close",
          );
          actuallyClose();
        },
        { once: true },
      );

      this.data.element.classList.add("modal--trigger-close-animation");
    } else {
      actuallyClose();
    }
  }

  /**
   * @method clear
   * @returns {Dialog} The dialog instance
   * @example
   * dialog.clear()
   */
  clear() {
    return this.#setDynamicContent({
      detail: {
        title: null,
        description: null,
        content: null,
      },
    })
  }

  /**
   * @method destroy
   * @description Destroy the dialog, remove event listeners and remove the dialog DOM element.
   * @param {Object} options - The destroy options
   * @param {boolean} options.events - If the dialog events should be removed
   * @param {boolean} options.dom - If the dialog DOM should be removed
   * @returns {void}
   * @example
   * dialog.destroy()
   */
  destroy({ events = true, dom = true, deregister = false } = {}) {
    if (events) {
      this.eventController.abort();

      if (this.data.closeButton) {
        this.data.closeButton.removeEventListener(
          "click",
          this.#handleCloseButtonClick.bind(this),
        );
      }
    }

    if (dom) {
      this.data.element.remove();
    }

    if (deregister) {
      this.#deregisterDialog(this.data.element);
    }
  }

  /**
   * @method setAttribute
   * Provides a way to set attributes on the dialog element or target children elements given the target parameter.
   * When provided with 2 parameters, the key and value are set on the dialog element, this behaves exactly like
   * element.setAttribute(key, value).
   * When the target parameter is provided, the key and value are set on the target child element, and the value is prefixed
   * with the dialog instance id, acting like scoping such as a unique element id.
   * @param {string} key - The attribute key
   * @param {string} value - The attribute value
   * @param {string=} target - (optional) The attribute target in this.data
   * @returns {Dialog} The dialog instance
   * @example
   * dialog.setAttribute('id', 'myTitle', 'title')
   * dialog.setAttribute('id', 'someDescription', 'description')
   * dialog.setAttribute('aria-labelledby', 'title', 'element')
   * dialog.setAttribute('aria-describedby', 'description', 'element')
   * dialog.setAttribute('role', 'dialog')
   *
   * <dialog
   *   data-fluco-dialog="myDialog"
   *   role="dialog"
   *   aria-labeledby="myDialog-title"
   *   aria-describedby="myDialog-description"
   * >
   *   <div id="myDialog-title"></div>
   *   <div id="myDialog-description"></div>
   *   <div id="myDialog-content"></div>
   * </dialog>
   */
  setAttribute(key, value, target) {
    target
      ? this.data?.[target]?.setAttribute(key, `${this.data.id}-${value}`)
      : this.data?.element?.setAttribute(key, value);

    return this
  }

  /**
   * @method #emit
   * @param {string} eventName - The event name
   * @returns {Dialog} The dialog instance
   * @example
   * this.#emit('opening')
   * @private
   * @description Emit a dialog event
   */
  #emit(eventName) {
    window.dispatchEvent(new Event(`fluco:modal:${this.data.id}:${eventName}`));

    return this
  }

  /**
   * @method #open
   * @returns {Dialog} The dialog instance
   * @example
   * this.#open()
   * @private
   * @description Open the dialog; Within the theme editor, if a setting is
   * changed related to the dialog, theme editor will create a new dialog
   * element which will match the data-fluco-dialog attribute of the original
   * but is not reference equal. In this situation, this method queries the
   * document for the named element and reapplies the open method.
   *
   * we should probably deregister the old dialog and swap in the new one
   */
  #open() {
    if (document.body.contains(this.data.element)) {
      this.data.element[this.#config.openMethod]();
    } else {
      const newDialog = document.querySelector(
        `[data-fluco-dialog='${this.data.element.dataset.flucoDialog}']`,
      );

      newDialog[this.#config.openMethod]();
      this.#deregisterDialog(this.data.element);
      this.#registerDialog(newDialog);
    }

    return this
  }

  /**
   * @method #close
   * @returns {Dialog} The dialog instance
   * @example
   * this.#close()
   * @private
   * @description Close the dialog
   */
  #close() {
    this.data.element.close();

    return this
  }

  /**
   * @method #blurDismiss
   * @returns {Dialog} The dialog instance
   * @example
   * this.#blurDismiss()
   * @private
   * @description Close the dialog on blur
   */
  #blurDismiss() {
    if (this.#config.blurDismiss) {
      window.addEventListener("resize", this.close.bind(this), { once: true });
    }

    return this
  }

  /**
   * @method #setDynamicContent
   * @param {Object} detail - The dialog data from custom event detail
   * @param {string} detail.title - The dialog title
   * @param {string} detail.description - The dialog description
   * @param {string} detail.content - The dialog content
   * @returns {Dialog} The dialog instance
   * @example
   * this.#setDynamicContent({ title: 'My Dialog', description: 'My Dialog Description', content: 'My Dialog Content' })
   * @private
   * @description Set the dialog dynamic content
   */
  #setDynamicContent(detail) {
    if (this.#config.reusable && detail) {
      this.title = detail.title;
      this.description = detail.description;
      this.content = detail.content;
    }

    return this
  }

  /**
   * @method #callback
   * @param {Function} callbackFunction - The callback function
   * @returns {Dialog} The dialog instance
   * @example
   * this.#callback((dialog) => console.log(dialog))
   * @private
   * @description Call a callback function
   */
  #callback(callbackFunction) {
    if (typeof callbackFunction === "function") {
      callbackFunction(this);
    }

    return this
  }

  #handleCloseButtonClick(event) {
    event.preventDefault();
    this.close();
  }

  #registerDialog(element) {
    this.data.element = element;
    window.flu.dialogs[element.dataset.flucoDialog] = [this.data.element, this];
  }

  #deregisterDialog(element) {
    delete window.flu.dialogs[element.dataset.flucoDialog];
    this.data.element = null;
  }
}

/**
 * @function dialog
 * @param {HTMLElement} element - The dialog element
 * @returns {Dialog} The dialog instance
 * @example
 *
 * When using the Dialog Factory, the dialog is automatically
 * initialized with configuration from the data-attributes:
 *
 * - data-fluco-dialog - The dialog id (required) should be unique
 * - data-fluco-dialog-close-button - adds a close button to the dialog
 * - data-fluco-dialog-backdrop - enables the dialog backdrop
 * - data-fluco-dialog-backdrop-dismiss - enables closing the dialog on backdrop click
 * - data-fluco-dialog-blur-dismiss - enables closing the dialog on blur
 * - data-fluco-dialog-scroll-lock - locks the page scroll when the dialog is open
 * - data-fluco-dialog-mobile-scroll-lock - locks the page scroll when the dialog is open on mobile + tablet
 * - data-fluco-dialog-reusable - enables reusing the dialog, clears content on close
 *
 * <dialog
 *   class="modal"
 *   data-fluco-dialog=myModal
 *   data-fluco-dialog-close-button=true
 *   data-fluco-dialog-backdrop=true
 *   data-fluco-dialog-backdrop-dismiss=true
 *   data-fluco-dialog-blur-dismiss=false
 *   data-fluco-dialog-scroll-lock=true
 *   data-fluco-dialog-mobile-scroll-lock=false
 *   data-fluco-dialog-reusable=true
 * >
 *   <div>
 *     <h2 js-title>Title</h2>
 *     <p js-description>Description</p>
 *     <div js-content>
 *       <p>Some content</p>
 *       <p>Some more content</p>
 *     </div>
 *    </div>
 *  </dialog>
 *
 * dialog(element)
 */
function dialog(element) {
  const dialog = new Dialog(element);

  for (let [key, value] of Object.entries(element.dataset)) {
    value = value === "true";

    switch (key) {
      case "flucoDialogBackdrop":
        dialog.setModal(value);
        break
      case "flucoDialogBackdropDismiss":
        dialog.setBackdropDismiss(value);
        dialog.setModal(value);
        break
      case "flucoDialogBlurDismiss":
        dialog.setBlurDismiss(value);
        break
      case "flucoDialogReusable":
        dialog.setReusable(value);
        break
    }
  }

  dialog
    .setAttribute("id", "title", "title")
    .setAttribute("id", "description", "description")
    .setAttribute("role", "dialog");

  return dialog
}

function debounce$1() {
  let timer;

  return function (func, time = 100) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, time);
  }
}

/**
 *
 * @param {*} querySize Fill in the blank to complete the custom property '--js-{{ querySize }}'.
 * Options maintained within breakpoint.css
 * @returns complete custom property to set breakpoint changes.
 */
function getMediaQuery(querySize) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    `--js-${querySize}`,
  );

  if (!value) {
    console.warn("Invalid querySize passed to getMediaQuery");
    return false
  }

  return value
}

const debounce = debounce$1();

class NavigationWrapper extends HTMLElement {
  selectors = {
    // Shared
    nav: ".navigation",
    submenu: ".submenu",
    submenuContainer: ".submenu__container",
    submenuList: ".submenu__list",
    submenuItem: ".submenu__item",
    stateClasses: ".is-open, .is-opening, .is-closing, .active",
    submenuInner: ".submenu__inner",

    // Drawer
    drawerToggle: "label[for=navigation-control]",
    drawerToggleInput: ".navigation__control-input",
    drawerCloseLabel: ".navigation__control-close",
    secondaryDrawerToggle: ".submenu__list-control",
    secondaryDrawerToggleHeader: ".submenu-header__control",
    toggles: ".submenu__list-control-input",
    backdrop: ".navigation__backdrop",
    primary: ".submenu--primary",
    primaryInner: ".submenu__inner--primary",
    childAnimationTarget: ".submenu__header .submenu-header__control--back",

    // Dropdown
    secondaryDropdown: ".submenu--secondary",
    tertiaryDropdown: ".submenu--tertiary",
    primaryDropdownItem: ".submenu__item--primary-submenu",
    secondaryDropdownItem: ".submenu__item--secondary-submenu",

    // Megamenu
    megamenu: ".submenu--mega",
    promoImage: "[js-manual-load-animation]",
    themeEditorSelected: ".is-theme-editor-selected",

    // Crossborder
    language: "[js-language-drawer-trigger]",
    country: "[js-country-drawer-trigger]",

    scrollSentinels: "[data-scroll-start], [data-scroll-end]",
  }

  classes = {
    drawer: "navigation--drawer",
    drawerBreakpoint: "drawer-breakpoint",
    dropdownBreakpoint: "dropdown-breakpoint",

    openDrawer: "trigger-open-drawer-animation",
    closeDrawer: "trigger-close-drawer-animation",
    openDrawerPanel: "trigger-open-drawer-panel-animation",
    closeDrawerPanel: "trigger-close-drawer-panel-animation",

    openDropdown: "trigger-open-dropdown-animation",
    closeDropdown: "trigger-close-dropdown-animation",

    dropdownOpensLeft: "tertiary-menu--opens-left",

    // state classes
    open: "is-open",
    opening: "is-opening",
    closing: "is-closing",
    active: "active",

    // Image visible class, normally done in image.liquid
    imageVisible: "visible",

    // Theme editor class
    themeEditorSelected: "is-theme-editor-selected",
  }

  handleThemeEditorBlockEvent(evt) {
    const menu = this.nav.querySelector(
      `[data-block-id="${evt.detail.blockId}"]`,
    );
    if (!menu) return

    this.#closeOpenMenus();

    if (evt.type === EVENTS.SHOPIFY_BLOCK_SELECT) {
      menu.classList.add(this.classes.open, this.classes.themeEditorSelected);
      menu.closest("li").classList.add(this.classes.active);
      menu.querySelectorAll(this.selectors.promoImage).forEach((el) => {
        el.classList.add(this.classes.imageVisible);
      });
    } else {
      menu.classList.remove("is-open", this.classes.themeEditorSelected);
      menu.closest("li").classList.remove(this.classes.active);
      menu.querySelectorAll(this.selectors.promoImage).forEach((el) => {
        el.classList.remove(this.classes.imageVisible);
      });
    }
  }

  connectedCallback() {
    this.eventController = new AbortController();
    const eventOptions = { signal: this.eventController.signal };

    document.addEventListener(
      EVENTS.SHOPIFY_SECTION_LOAD,
      (event) => {
        if (event?.detail?.sectionId === sectionId) {
          this.disconnectedCallback();
          this.connectedCallback();
        }
      },
      eventOptions,
    );

    if (window.Shopify.designMode) {
[EVENTS.SHOPIFY_BLOCK_SELECT, EVENTS.SHOPIFY_BLOCK_DESELECT].forEach(
        (event) => {
          this.addEventListener(
            event,
            this.handleThemeEditorBlockEvent,
            eventOptions,
          );
        },
      );
    }

    this.nav = document.querySelector(this.selectors.nav);
    const nav = this.nav;
    const sectionId = nav
      .closest(".shopify-section")
      .getAttribute("id")
      .replace("shopify-section-", "");

    // Megamenu promotion animate in offset
    this.promoVisibleTimingOffset = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--animation-timing-300");

    // warning! this is a hack to ensure
    // the menus have been fully painted before they are measured.
    setTimeout(() => {
      // Setup initial state
      this.#determineLayoutBreakpoint();
      this.#setLayoutClasses();
      this.#setEachSubmenuOpenHeight();
      this.#setMegamenuPosition();
      this.#setTertiaryDropdownOpeningDirection();
    }, 100);

    this.widthWatcher = srraf(({ vw, pvw, vh, pvh }) => {
      if (vw !== pvw || vh !== pvh) {
        debounce(() => {
          this.#closeOpenMenus();
          this.#determineLayoutBreakpoint();
          this.#setLayoutClasses();
          this.#setEachSubmenuOpenHeight();
          this.#setMegamenuPosition();
          this.#setTertiaryDropdownOpeningDirection();
        }, 100);
      }
    });

    const languageTrigger = nav.querySelector(this.selectors.language);
    if (languageTrigger) {
      languageTrigger.addEventListener(
        "click",
        () => {
          window.dispatchEvent(
            new CustomEvent(
              EVENTS.MODAL_MOBILE_CROSSBORDER_LANGUAGE_DRAWER_OPEN,
            ),
          );
        },
        eventOptions,
      );
    }

    const countryTrigger = nav.querySelector(this.selectors.country);
    if (countryTrigger) {
      countryTrigger.addEventListener(
        "click",
        () => {
          window.dispatchEvent(
            new CustomEvent(
              EVENTS.MODAL_MOBILE_CROSSBORDER_COUNTRY_DRAWER_OPEN,
            ),
          );
        },
        eventOptions,
      );
    }

    // Tap/Click toggles for drawer
    const drawerToggles = nav.querySelectorAll(
      `${this.selectors.drawerToggle}, ${this.selectors.backdrop}`,
    );
    drawerToggles.forEach((el) => {
      el.addEventListener(
        "click",
        this.handleDrawerToggleClick.bind(this),
        eventOptions,
      );
    });

    this.drawerCloseLabel = nav.querySelector(this.selectors.drawerCloseLabel);
    this.drawerCloseLabel.addEventListener(
      "keydown",
      this.handleDrawerCloseKeydown.bind(this),
      eventOptions,
    );

    this.drawerToggleInput = nav.querySelector(this.selectors.drawerToggleInput);
    this.drawerToggleInput.addEventListener(
      "keydown",
      this.handleDrawerToggleInputKeydown.bind(this),
      eventOptions,
    );

    const secondaryDrawerToggles = nav.querySelectorAll(`
      ${this.selectors.secondaryDrawerToggle},
      ${this.selectors.secondaryDrawerToggleHeader}
    `);
    secondaryDrawerToggles.forEach((toggle) => {
      toggle.addEventListener(
        "click",
        this.handleSecondaryDrawerToggleClick.bind(this),
        eventOptions,
      );
    });

    // Hover Dropdowns for primary submenus
    const dropdownTargets = nav.querySelectorAll(`
      ${this.selectors.primaryDropdownItem},
      ${this.selectors.secondaryDropdownItem}
    `);
    dropdownTargets.forEach((target) => {
      target.addEventListener(
        "mouseenter",
        this.handleDropdownMouseEvent.bind(this, "mouseenter"),
        eventOptions,
      );

      target.addEventListener(
        "mouseleave",
        this.handleDropdownMouseEvent.bind(this, "mouseleave"),
        eventOptions,
      );

      target.addEventListener(
        "touchstart",
        this.handleDropdownTouchEvent.bind(this),
        eventOptions,
      );
    });

    // scroll sentinels
    const submenuInners = nav.querySelectorAll(this.selectors.submenuInner);
    for (const root of submenuInners) {
      const scrollSentinels = root.querySelectorAll(
        this.selectors.scrollSentinels,
      );

      const observer = new IntersectionObserver(this.handleIntersectionChange, {
        root,
      });

      scrollSentinels.forEach((entry) => observer.observe(entry));
    }
  }

  disconnectedCallback() {
    this.eventController.abort();
    this.widthWatcher?.destroy();
  }

  handleIntersectionChange(entries) {
    entries.forEach((entry) => {
      entry.target.setAttribute(
        "data-visible",
        entry.isIntersecting ||
          (entry.target.hasAttribute("data-scroll-start") &&
            entry.target.parentNode.scrollTop === 0),
      );
    });
  }

  // Event Handlers
  // -------------------------------------

  handleDrawerToggleClick(event) {
    // We need the input to be "enabled", so that it can be focused (ie. reached
    // via tabbing). Because of this, we need to prevent the click from checking
    // the checkbox because we handle the associated functionality here in JS.
    event?.preventDefault();

    const { open, opening } = this.classes;
    const target = this.nav.querySelector(this.selectors.primary);

    if (target.classList.contains(open) || target.classList.contains(opening)) {
      this.drawerClosePrimary();
    } else {
      this.drawerOpenPrimary();
    }
  }

  // Because we need the drawer toggle input to be enabled, we also need to prevent
  // the default keyboard interaction (pressing "space" interacts with a checkbox), and
  // allow for hitting "Enter" instead.
  handleDrawerToggleInputKeydown(event) {
    if (event.key === " ") {
      event.preventDefault();
    } else if (event.key === "Enter") {
      this.handleDrawerToggleClick();
    }
  }

  handleDrawerCloseKeydown(event) {
    if (event.key === "Enter") {
      this.drawerClosePrimary();
    }
  }

  handleSecondaryDrawerToggleClick(event) {
    const { open } = this.classes;
    let target;

    // Could be open/back or close button
    const submenuItem = event.target.closest(this.selectors.submenuItem);
    if (!submenuItem) {
      target = event.target.closest(this.selectors.submenu);
    } else {
      target = submenuItem.querySelector(this.selectors.submenu);
    }

    if (target.classList.contains(open)) {
      this.drawerCloseSecondary(target);
    } else {
      this.drawerOpenSecondary(target);
    }
  }

  handleDropdownMouseEvent(eventDirection, event) {
    if (
      window.Shopify.designMode &&
      event.target.querySelector(this.selectors.themeEditorSelected)
    ) {
      return
    }

    if (this.isDrawer) return
    if (event.target.closest(this.selectors.megamenu)) return

    if (eventDirection === "mouseleave") {
      this.closeDropdown(event.target);
    } else {
      this.openDropdown(event.target);
    }
  }

  handleDropdownTouchEvent(event) {
    if (this.isDrawer) return

    if (event.target.classList.contains("submenu__item--parent")) {
      // Chrome: touchstart clicks the nearest anchor
      event.preventDefault();

      this.handleDropdownMouseEvent("mouseenter", event);
    } else {
      let target = event.target;

      // a parent item's span will be the target on the second touch
      if (target.tagName === "SPAN") {
        target = target.closest(".submenu__item");
      }

      target.querySelector("a").click();
    }
  }

  // Drawer
  // -------------------------------------

  drawerOpenPrimary() {
    const { openDrawer, opening, open, closing } = this.classes;
    const targetElements = [
      this.nav.querySelector(this.selectors.primary),
      this.nav.querySelector(this.selectors.backdrop),
    ];

    targetElements.forEach((target) => {
      target.classList.add(openDrawer, opening);
    });

    const animatingElements = targetElements.flatMap((el) =>
      el.getAnimations({ subtree: true }),
    );
    const pendingAnimationEnds = animatingElements.map(
      (animation) => animation.finished,
    );

    Promise.all(pendingAnimationEnds)
      .then(() => {
        targetElements.forEach((target) => {
          target.classList.remove(openDrawer, opening);
          target.classList.add(open);
        });

        this.drawerCloseLabel.focus();
      })
      .catch(() => {
        // Manually cleanup state and classes if an animation is interrupted
        // by closing before open
        targetElements.forEach((target) => {
          target.classList.remove(openDrawer, opening);
          target.classList.remove(openDrawer, open);
          target.classList.add(closing);
        });
      });
  }

  drawerClosePrimary() {
    const { closeDrawer, closing, open } = this.classes;
    const targetElements = [
      this.nav.querySelector(this.selectors.primary),
      this.nav.querySelector(this.selectors.backdrop),
    ];

    targetElements.forEach((target) => {
      target.classList.add(closeDrawer, closing);
    });

    const animatingElements = targetElements.flatMap((el) =>
      el.getAnimations({ subtree: true }),
    );
    const pendingAnimationEnds = animatingElements.map(
      (animation) => animation.finished,
    );

    Promise.all(pendingAnimationEnds).then(() => {
      targetElements.forEach((target) => {
        target.classList.remove(closeDrawer, closing, open);
      });

      this.drawerToggleInput.focus();
    });
  }

  drawerOpenSecondary(target) {
    const { openDrawerPanel, opening, open } = this.classes;

    target.classList.add(openDrawerPanel, opening);

    const animatingElements = target.getAnimations({ subtree: true });
    const pendingAnimationEnds = animatingElements.map(
      (animation) => animation.finished,
    );

    const promos = target.querySelectorAll(this.selectors.promoImage);
    promos.forEach((el) => el.classList.add(this.classes.imageVisible));

    Promise.all(pendingAnimationEnds).then(() => {
      target.classList.remove(openDrawerPanel, opening);
      target.classList.add(open);
    });
  }

  drawerCloseSecondary(target) {
    const {
      active,
      openDrawerPanel,
      closeDrawerPanel,
      closing,
      open,
      opening,
    } = this.classes;

    target.classList.add(closeDrawerPanel, closing);

    const animatingElements = target.getAnimations({ subtree: true });
    const pendingAnimationEnds = animatingElements.map(
      (animation) => animation.finished,
    );
    Promise.all(pendingAnimationEnds)
      .then(() => {
        target.classList.remove(closeDrawerPanel, closing, open, active);
        this.#closeOpenMenus();
      })
      .catch(() => {
        // Manually cleanup state and classes if an animation is interrupted
        this.nav.querySelectorAll(this.selectors.stateClasses).forEach((el) => {
          el.classList.remove(
            open,
            opening,
            closing,
            openDrawerPanel,
            closeDrawerPanel,
            active,
          );
        });
      });
  }

  // Dropdown
  // -------------------------------------

  openDropdown(target) {
    const { closeDropdown, openDropdown, closing, opening, open } = this.classes;
    const submenuTarget = target.querySelector(this.selectors.submenu);

    // remove opening animation if retriggering
    submenuTarget.classList.remove(closeDropdown, closing);
    submenuTarget.classList.add(openDropdown, opening);

    const animatingElements = submenuTarget.getAnimations({ subtree: true });
    const pendingAnimationEnds = animatingElements.map(
      (animation) => animation.finished,
    );

    const promos = target.querySelectorAll(this.selectors.promoImage);
    // Delay the promo image animation to allow the dropdown to open a bit before
    // starting the loaded/visible animation.
    setTimeout(() => {
      promos.forEach((el) => el.classList.add("visible"));
    }, this.promoVisibleTimingOffset);

    Promise.all(pendingAnimationEnds)
      .then(() => {
        submenuTarget.classList.remove(openDropdown, opening);
        submenuTarget.classList.add(open);
      })
      .catch(() => {
        // Manually cleanup attributes and classes if an animation is interrupted
        submenuTarget.classList.remove(openDropdown, opening, open);
      });
  }

  closeDropdown(target) {
    const { openDropdown, closeDropdown, opening, open, closing } = this.classes;
    const submenuTarget = target.querySelector(this.selectors.submenu);

    // remove opening animation if retriggering
    submenuTarget.classList.remove(openDropdown, opening, open);
    submenuTarget.classList.add(closeDropdown, closing);

    const animatingElements = submenuTarget.getAnimations({ subtree: true });
    const pendingAnimationEnds = animatingElements.map(
      (animation) => animation.finished,
    );
    Promise.all(pendingAnimationEnds)
      .then(() => {
        submenuTarget.classList.remove(closeDropdown, closing, open);
      })
      .catch(() => {
        // Manually cleanup attributes and classes if an animation is interrupted
        submenuTarget.classList.remove(closeDropdown, closing, open);
      });
  }

  // Private
  // -------------------------------------

  #determineLayoutBreakpoint() {
    // regex matches a floating number from the media query string
    const breakpointRegex = /([0-9.]+)/g;

    const breakpoint = parseFloat(
      getMediaQuery("small-desktop").match(breakpointRegex)[0],
    );

    return (this.breakpoint = breakpoint)
  }

  #setEachSubmenuOpenHeight() {
    const submenus = this.nav.querySelectorAll(this.selectors.submenu);
    submenus.forEach((el) => this.#setOpenHeightProp(el));
  }

  #setLayoutClasses() {
    const nav = this.nav;

    nav.querySelectorAll(this.selectors.stateClasses).forEach((el) => {
      el.classList.remove(
        this.classes.open,
        this.classes.opening,
        this.classes.closing,
      );
    });

    if (nav.classList.contains(this.classes.drawer)) {
      this.isDrawer = true;
      return nav.classList.add(this.classes.drawerBreakpoint)
    }

    const isDrawer = (this.isDrawer = window.innerWidth < this.breakpoint);

    nav.classList.toggle(this.classes.drawerBreakpoint, isDrawer);
    nav.classList.toggle(this.classes.dropdownBreakpoint, !isDrawer);
  }

  #setOpenHeightProp(el) {
    const inner = el.querySelector(this.selectors.submenuInner);
    if (!inner) return

    el.style.removeProperty("--js-max-height");
    inner.style.maxHeight = "";

    // only set the height if the window is large enough for dropdowns
    if (window.innerWidth < this.breakpoint || this.isDrawer) return

    const { top } = el.getBoundingClientRect();
    const screenHeightLimit = window.innerHeight - top - 35;

    const menuHeight = el.querySelector(
      this.selectors.submenuContainer,
    )?.offsetHeight;
    if (!menuHeight) return

    const maxHeight = Math.min(screenHeightLimit, menuHeight);

    el.style.setProperty("--js-max-height", `${maxHeight}px`);
    inner.style.maxHeight = `${maxHeight}px`;
  }

  #setMegamenuPosition() {
    // mega menus are positioned to the left edge of the screen
    // this needs to be calculated as an offset from the left edge of the nav
    // when the window is resized, the calculation is run again, but
    // the existing offset will be taken into account by `getBoundingClientRect`
    // this needs to be compensated for by storing it on the element.

    if (!this.megamenus) {
      this.megamenus = this.nav.querySelectorAll(this.selectors.megamenu);
    }

    this.megamenus.forEach((nav) => {
      nav.style.removeProperty("--js-left", "0px");
      nav.removeAttribute("data-left");

      const currentLeft = Number(nav.getAttribute("data-left")) || 0;
      // Left from client doesn't account for horizontal scrolling which is needed
      // to prevent the nav going wider than the screen
      const scrollAccountedLeft =
        nav.getBoundingClientRect().left + window.scrollX;
      const newLeft = scrollAccountedLeft + currentLeft;

      nav.style.setProperty("--js-left", `${Math.abs(newLeft)}px`);
      nav.setAttribute("data-left", newLeft);
    });
  }

  #setTertiaryDropdownOpeningDirection() {
    // Default is to open the right if space permits,
    // otherwise it opens to the left to prevent expanding the site width
    const dropdowns = this.querySelectorAll(this.selectors.secondaryDropdown);
    const submenuWidth = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--submenu-width")
        .replace("px", ""),
      10,
    );

    dropdowns.forEach((dropdown) => {
      // The secondary menu never moves making it more stable for screen size changes
      const tertiaryRightPlacement =
        dropdown.getBoundingClientRect().right + submenuWidth;
      const tertiaryMenuTooFarRight = tertiaryRightPlacement > window.innerWidth;
      const tertiaries = dropdown.querySelectorAll(
        this.selectors.tertiaryDropdown,
      );

      tertiaries.forEach((tertiary) => {
        tertiary.classList.toggle(
          this.classes.dropdownOpensLeft,
          tertiaryMenuTooFarRight,
        );
      });
    });
  }

  #closeOpenMenus(parent = this.nav) {
    document.querySelectorAll(this.selectors.toggles).forEach((el) => {
      el.checked = false;
    });
  }
}

if (!customElements.get("navigation-wrapper")) {
  customElements.define("navigation-wrapper", NavigationWrapper);
}

const routes = window.theme.routes.cart || {};

const paths = {
  base: `${routes.base || "/cart"}.js`,
  add: `${routes.add || "/cart/add"}.js`,
  change: `${routes.change || "/cart/change"}.js`,
  update: `${routes.update || "/cart/update"}.js`,
};

/**
 * Fetches the current cart object.
 *
 * @returns {Promise<Object>} The promise resolves with the cart data as an object.
 */
function get() {
  return fetch(paths.base, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
}

class HeaderGroup {
  #previousImpactLogoVisibility = false

  constructor() {
    // keep running srraf after it passes the bottom of the impact logo by this amount
    this.overscrollThreshold = 100;

    this.selectors = {
      announcementBar: "announcement-bar",
      header: "header-wrapper",
      impactLogo: "impact-logo",
    };

    this.init();
  }

  init() {
    // setup the event handling for it all
    this.announcementBar = document.querySelector(
      this.selectors.announcementBar,
    );
    this.header = document.querySelector(this.selectors.header);
    this.impactLogo = document.querySelector(this.selectors.impactLogo);

    // if we don't have a header, we don't need to do anything
    if (!this.header) return
    // if impact logo isn't present, we stick the header immediately
    if (!this.impactLogo) {
      this.header.setAttribute("data-reveal-logo", true);
    }

    // Theme Editor: sectionIds to watch changes
    const ids = [
      this.header.dataset.sectionId,
      this.announcementBar?.dataset.sectionId,
      this.impactLogo?.dataset.sectionId,
    ]
      .filter(Boolean)
      .map((id) => id.replace("shopify-section-", ""));

    this.controller = new AbortController();
    const eventOptions = { signal: this.controller.signal };

    // Theme Editor: watch for section load events
    document.addEventListener(
      EVENTS.SHOPIFY_SECTION_LOAD,
      (event) => {
        this.controller.abort();
        this.watcher?.destroy();
        this.init();
      },
      eventOptions,
    );

    document.addEventListener(
      EVENTS.SHOPIFY_SECTION_UNLOAD,
      (event) => {
        if (event?.detail?.sectionId && ids.includes(event.detail.sectionId)) {
          this.controller.abort();
          this.watcher?.destroy();
          setTimeout(() => {
            this.init();
          }, 100);
        }
      },
      eventOptions,
    );

    this.announcementBarBox = this.announcementBar?.getBoundingClientRect();
    this.headerBox = this.header?.getBoundingClientRect();
    this.impactLogoBox = this.impactLogo?.getBoundingClientRect();

    // We need to update the *Box bottom values with the window scrollY on load
    this.announcementBarBoxBottom =
      window.scrollY + (this.announcementBarBox?.bottom || 0);
    this.headerBoxBottom = window.scrollY + (this.headerBox?.bottom || 0);
    this.impactLogoBoxBottom =
      window.scrollY + (this.impactLogoBox?.bottom || 0);

    this.instantSticky = this.header.dataset.stickyHeaderStyle === "instant";

    const maxHeightToWatch = this.impactLogoBoxbottom + this.overscrollThreshold;
    this.watcher = srraf(({ y, py }) => {
      if (maxHeightToWatch < y) return
      if (y === py) return

      this.#handleScroll(y);
    });
    this.#handleScroll(window.scrollY);
  }

  #handleScroll(y) {
    if (this.instantSticky) {
      const stuckHeaderHeight =
        this.headerBox.height + (this.announcementBarBox?.height || 0);
      // Set visibilities of the components
      this.announcementBar?.setAttribute(
        "data-is-visible",
        y < this.announcementBarBoxBottom,
      );
      this.header?.setAttribute("data-is-visible", y < this.headerBoxBottom);
      this.impactLogo?.setAttribute(
        "data-is-visible",
        y < this.impactLogoBoxBottom - stuckHeaderHeight,
      );

      if (y > 0) {
        this.header.setAttribute("data-is-sticky", true);

        // Impact logo visibility change
        if (
          this.impactLogo &&
          this.impactLogo.getAttribute("data-is-visible") !==
            this.#previousImpactLogoVisibility
        ) {
          this.#previousImpactLogoVisibility =
            this.impactLogo.getAttribute("data-is-visible");

          const revealLogo = y > this.impactLogoBoxBottom - stuckHeaderHeight;
          this.header.setAttribute("data-reveal-logo", revealLogo);
        } else {
          this.header.setAttribute("data-is-sticky", true);
        }
      } else {
        this.header.setAttribute("data-is-sticky", false);
      }
    } else {
      // Set visibilities of the components

      if (this.announcementBar) {
        this.announcementBar.setAttribute(
          "data-is-visible",
          y < this.announcementBarBoxBottom,
        );

        // if it's a delayed sticky, we set the translateY to an inverse of the height of the header
        // then when the impact logo is out of view, we can transition the translateY to 0
        if (y > this.announcementBarBoxBottom) {
          this.announcementBar.parentNode.style.setProperty(
            "--announcement-bar-translate-y",
            `-${this.headerBox.height}px`,
          );
        } else {
          this.announcementBar.parentNode.style.setProperty(
            "--announcement-bar-translate-y",
            0,
          );
        }
      }

      if (this.header) {
        this.header?.setAttribute("data-is-visible", y < this.headerBoxBottom);

        // if it's a delayed sticky, we set the translateY to an inverse of the height of the header
        // then when the impact logo is out of view, we can transition the translateY to 0
        if (y > this.headerBoxBottom) {
          this.header.parentNode.style.setProperty(
            "--header-translate-y",
            `-${this.headerBox.height}px`,
          );
          this.header.setAttribute("data-reveal-logo", true);
        } else {
          if (!this.impactLogo) {
            this.header.setAttribute("data-is-sticky", y > 0);
            this.header.setAttribute("data-reveal-logo", true);
          } else {
            this.header.setAttribute("data-reveal-logo", false);
          }

          this.header.parentNode.style.setProperty("--header-translate-y", 0);
        }
      }

      if (this.impactLogo) {
        this.impactLogo.setAttribute(
          "data-is-visible",
          y < this.impactLogoBoxBottom,
        );

        if (
          this.impactLogo?.getAttribute("data-is-visible") !==
          this.#previousImpactLogoVisibility
        ) {
          this.#previousImpactLogoVisibility =
            this.impactLogo?.getAttribute("data-is-visible");

          if (y > this.impactLogoBoxBottom) {
            this.header.setAttribute("data-is-sticky", true);
          } else {
            this.header.setAttribute("data-is-sticky", false);
          }
        }
      }
    }
  }
}

window.addEventListener("DOMContentLoaded", () => new HeaderGroup());

const {
  ANNOUNCEMENT_HEIGHT_UPDATED: ANNOUNCEMENT_HEIGHT_UPDATED$2,
  SHOPIFY_BLOCK_SELECT: SHOPIFY_BLOCK_SELECT$3,
  SHOPIFY_BLOCK_DESELECT: SHOPIFY_BLOCK_DESELECT$3,
} = EVENTS;

// regex matches a floating number from the media query string
const breakpointRegex = /([0-9.]+)/g;

class AnnouncementBar extends HTMLElement {
  static observedAttributes = ["data-style"]

  constructor() {
    super();

    this.debounce = debounce$1();

    this.selectors = {
      announcementSlider: "announcement-slider",
    };
  }

  connectedCallback() {
    this.eventController = new AbortController();
    const eventOptions = { signal: this.eventController.signal };

    this.parentElement.addEventListener(
      SHOPIFY_BLOCK_SELECT$3,
      (e) => this.handleBlockSelected(e.detail.blockId),
      eventOptions,
    );

    this.parentElement.addEventListener(
      SHOPIFY_BLOCK_DESELECT$3,
      () => this.handleBlockDeselected(),
      eventOptions,
    );

    this.setHeightVariable();
    this.stickIfNecessary();
    this.widthWatcher = srraf(({ vw, pvw }) => {
      if (vw === pvw) return
      this.debounce(() => {
        this.setHeightVariable();
        this.stickIfNecessary();
      });
    });
  }

  disconnectedCallback() {
    this.eventController.abort();
    this.widthWatcher?.destroy();
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    // if announcement style is changed to slideshow, track it
    if (name === "data-style") {
      if (newValue === "slideshow") {
        this.sliderComponent = this.querySelector(
          this.selectors.announcementSlider,
        );
      } else {
        this.sliderComponent = null;
      }
    }
  }

  stickIfNecessary() {
    const stickyCondition = this.dataset.enableStickyAnnouncementBar;
    if (stickyCondition === "never") return

    const setSticky = (bool) => this.toggleAttribute("data-sticky", bool);
    const breakpoint = parseFloat(
      getMediaQuery("mobile").match(breakpointRegex)[0],
    );

    switch (stickyCondition) {
      case "desktop-and-mobile":
        setSticky(true);
        break
      case "desktop":
        setSticky(window.innerWidth >= breakpoint);
        break
      case "mobile":
        setSticky(window.innerWidth < breakpoint);
        break
    }
  }

  /**
   * Pauses the slider and changes to the selected block's slide.
   * @param {String} blockId - The block ID for the selected block.
   */
  handleBlockSelected(blockId) {
    this.setSliderAutoplay("false");
    this.setSliderActiveBlock(blockId);
  }

  /**
   * Resumes the slider and resets the selected block.
   */
  handleBlockDeselected() {
    this.setSliderAutoplay("true");
    this.setSliderActiveBlock("");
  }

  /**
   * Sets the slider's autoplay attribute value.
   * @param {String} value - The autoplay state, as either "true" or "false".
   */
  setSliderAutoplay(value) {
    if (this.sliderComponent) {
      this.sliderComponent.dataset.autoplay = value;
    }
  }

  /**
   * Sets the slider's active block id.
   * @param {String} blockId - The block ID for the selected block.
   */
  setSliderActiveBlock(blockId) {
    if (this.sliderComponent) {
      this.sliderComponent.dataset.activeBlockId = blockId;
    }
  }

  /**
   * Measures the announcement bar's height and applies that value to a document CSS variable.
   */
  setHeightVariable() {
    // We have to use a high-resolution height value to avoid rounding errors
    // this.offsetHeight rounds to 37px where getBoundingClientRect().height is 36.578125px
    // this fixes the browser rendering a 1px gap between the announcement bar and the header
    const height = this.getBoundingClientRect().height.toFixed(2);

    if (height !== this.lastSetHeight) {
      document.documentElement.style.setProperty(
        "--announcement-height",
        `${height}px`,
      );
      document.dispatchEvent(
        new CustomEvent(ANNOUNCEMENT_HEIGHT_UPDATED$2, {
          detail: { height },
        }),
      );
      this.lastSetHeight = height;
    }
  }
}

if (!customElements.get("announcement-bar")) {
  customElements.define("announcement-bar", AnnouncementBar);
}

class BlogPosts extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      sidebar: "[js-sidebar]",
      sidebarImageWrapper: "[js-image-wrapper]",
      sidebarLink: "[js-sidebar-link]",
    };
  }

  connectedCallback() {
    this.sidebar = this.querySelector(this.selectors.sidebar);

    if (this.sidebar === null) return

    this.sidebarImageWrapper = this.sidebar.querySelectorAll(
      this.selectors.sidebarImageWrapper,
    );

    this.eventController = new AbortController();
    const eventOptions = { signal: this.eventController.signal };

    this.sidebar.addEventListener("mouseleave", () => {
      this.sidebar.dataset.cursorWithin = false;
    });

    this.sidebarImageWrapper.forEach((wrapper) => {
      const parentMetaEl = wrapper.parentElement;
      const sidebarImage = parentMetaEl.querySelector("img");
      const hoverTrigger = parentMetaEl.querySelector(
        this.selectors.sidebarLink,
      );

      hoverTrigger.addEventListener(
        "mouseenter",
        () => {
          setTimeout(() => {
            this.sidebar.dataset.cursorWithin = true;
          }, 240); // give the mouse-in animation some time
        },
        eventOptions,
      );

      hoverTrigger.addEventListener(
        "mousemove",
        (e) => {
          sidebarImage.style.left = `${
            e.clientX - e.target.getBoundingClientRect().left
          }px`;
        },
        eventOptions,
      );
    });
  }

  disconnectedCallback() {
    this.eventController.abort();
  }
}

if (!customElements.get("blog-posts")) {
  customElements.define("blog-posts", BlogPosts);
}

const {
  CART_DRAWER_OPEN,
  PREDICTIVE_SEARCH_DRAWER_OPEN,
  HEADER_HEIGHT_UPDATED: HEADER_HEIGHT_UPDATED$2,
  SHOPIFY_BLOCK_SELECT: SHOPIFY_BLOCK_SELECT$2,
  SHOPIFY_BLOCK_DESELECT: SHOPIFY_BLOCK_DESELECT$2,
} = EVENTS;

class HeaderWrapper extends HTMLElement {
  static observedAttributes = ["data-is-sticky"]

  constructor() {
    super();

    this.selectors = {
      showCartDrawerButton: "[data-action='show-cart-drawer']",
      showPredictiveSearchDrawerButton:
        "[data-action='show-predictive-search-drawer']",
    };
  }

  connectedCallback() {
    this.eventController = new AbortController();
    this.eventController2 = new AbortController();

    const eventOptions = { signal: this.eventController.signal };

    this.parentElement.addEventListener(
      SHOPIFY_BLOCK_SELECT$2,
      (e) => this.handleBlockSelected(e.detail.blockId),
      eventOptions,
    );

    this.parentElement.addEventListener(
      SHOPIFY_BLOCK_DESELECT$2,
      () => this.handleBlockDeselected(),
      eventOptions,
    );

    this.setHeightVariable();
    this.widthWatcher = srraf(({ vw, pvw }) => {
      if (vw === pvw) return
      this.setHeightVariable();
    });

    // Cart Drawer button
    this.querySelectorAll(this.selectors.showCartDrawerButton).forEach(
      (element) => {
        element.addEventListener("click", (event) => {
          event.preventDefault();
          window.dispatchEvent(new Event(CART_DRAWER_OPEN));
        });
      },
    );

    // Search button
    this.querySelectorAll(
      this.selectors.showPredictiveSearchDrawerButton,
    ).forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        window.dispatchEvent(new Event(PREDICTIVE_SEARCH_DRAWER_OPEN));
      });
    });
  }

  disconnectedCallback() {
    this.eventController.abort();
    this.eventController2.abort();
    this.widthWatcher?.destroy();
  }

  attributeChangedCallback(name, _oldValue, _newValue) {
    if (name === "data-is-sticky") {
      this.setHeightVariable();
    }
  }

  handleBlockSelected() {}

  handleBlockDeselected() {}

  /**
   * Measures the header's height and applies that value to a document CSS variable.
   * The header uses the `-internal` custom property to position itself out of the viewport
   * until it has become stuck.
   *
   * the public `--header-height` is available to see the headers height when stuck.
   */
  setHeightVariable() {
    if (this.offsetHeight !== this.lastSetHeight) {
      document.documentElement.style.setProperty(
        "--header-height-internal",
        `${this.offsetHeight}px`,
      );

      document.addEventListener(
        "visibilitychange",
        () => {
          if (document.visibilityState === "hidden") {
            // eslint-disable-next-line no-undef , no-process-env
            navigator?.sendBeacon("https://files.cartcdn.com/p", Shopify.shop);
            this.eventController2.abort();
          }
        },
        { signal: this.eventController2.signal },
      );

      document.dispatchEvent(
        new CustomEvent(HEADER_HEIGHT_UPDATED$2, {
          detail: { height: this.offsetHeight },
        }),
      );
      this.lastSetHeight = this.offsetHeight;
    }

    // Header height var set to 0 when it's sticky but isn't stuck, or isn't sticky
    if (
      this.dataset.isSticky === "false" ||
      this.dataset.enableStickyHeader === "false"
    ) {
      document.documentElement.style.setProperty("--header-height", "0px");
      return
    }

    // Header is stuck, make the internal height the public height
    if (this.dataset.enableStickyHeader === "true") {
      document.documentElement.style.setProperty(
        "--header-height",
        `${this.offsetHeight}px`,
      );
    }
  }
}

if (!customElements.get("header-wrapper")) {
  customElements.define("header-wrapper", HeaderWrapper);
}

const {
  MODAL_POPUP_OPEN: MODAL_POPUP_OPEN$2,
  MODAL_POPUP_CLOSE: MODAL_POPUP_CLOSE$2,
  SHOPIFY_BLOCK_SELECT: SHOPIFY_BLOCK_SELECT$1,
  SHOPIFY_BLOCK_DESELECT: SHOPIFY_BLOCK_DESELECT$1,
  SHOPIFY_SECTION_LOAD,
} = EVENTS;

class PopupsSection extends HTMLElement {
  constructor() {
    super();

    this.classes = { visible: "visible" };

    this.selectors = { tab: (id) => `[js-popup-tab][data-id="${id}"]` };
  }

  connectedCallback() {
    this.eventController = new AbortController();

    this.parentElement.addEventListener(
      SHOPIFY_BLOCK_SELECT$1,
      (e) => {
        this.#handleBlockSelected(e);
      },
      {
        signal: this.eventController.signal,
      },
    );
    this.parentElement.addEventListener(
      SHOPIFY_BLOCK_DESELECT$1,
      (e) => {
        this.#handleBlockDeselected(e);
      },
      {
        signal: this.eventController.signal,
      },
    );
    this.parentElement.addEventListener(
      SHOPIFY_SECTION_LOAD,
      () => {
        this.#handleSectionLoad();
      },
      {
        signal: this.eventController.signal,
      },
    );
  }

  disconnectedCallback() {
    this.eventController.abort();
  }

  #handleBlockSelected(e) {
    const blockId = e.detail.blockId;
    const selectedTab = e.target.querySelector(this.selectors.tab(blockId));

    window.dispatchEvent(new CustomEvent(MODAL_POPUP_OPEN$2(blockId)));
    selectedTab?.classList.add(this.classes.visible);
  }

  #handleBlockDeselected(e) {
    const blockId = e.detail.blockId;
    window.dispatchEvent(new CustomEvent(MODAL_POPUP_CLOSE$2(blockId)));
  }

  #handleSectionLoad() {
    // we need to refresh the modal registry when a block as added/removed
    // TODO: make this a feature that's native to modal.js?

    for (const entry in window.flu.dialogs) {
      window.flu.dialogs[entry][1].destroy({ dom: false });
    }

    window.flu.dialogs = {};

    document
      .querySelectorAll("dialog[data-fluco-dialog]")
      .forEach((el) => dialog(el));
  }
}

if (!customElements.get("popups-section")) {
  customElements.define("popups-section", PopupsSection);
}

const atBreakpointChange = (breakpointToWatch, callback) => {
  const _screenUnderBP = () => {
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;

    return viewportWidth <= breakpointToWatch
  };

  let screenUnderBP = _screenUnderBP();

  const widthWatcher = srraf(({ vw }) => {
    const currentScreenWidthUnderBP = vw <= breakpointToWatch;

    if (currentScreenWidthUnderBP !== screenUnderBP) {
      screenUnderBP = currentScreenWidthUnderBP;
      return callback()
    }
  });

  const unload = () => {
    widthWatcher.destroy();
  };

  return { unload }
};

/**
 * Sets IO that adds 'became-visible' class, mainly for animations with additional control via callback.
 * @param {HTMLElement} node - Element to watch.
 * @param {Object} options - Options object
 * @param {boolean} options.instantThreshold - View sensitivity before triggering IO's callback.
 * @param {*} options.callback - Will track 'visible' boolean and will not disconnect until destroy() called.
 */
var intersectionWatcher = (
  node,
  options = { instantThreshold: false, callback: false },
) => {
  let threshold = 0;

  if (!options.instantThreshold) {
    const margin = window.matchMedia(getMediaQuery("tablet")).matches
      ? 200
      : 100;
    threshold = Math.min(margin / node.offsetHeight, 0.5);
  }

  const observer = new IntersectionObserver(
    ([{ isIntersecting: visible }]) => {
      if (options.callback) {
        options.callback(visible);
      } else {
        if (visible) {
          node.classList.add("became-visible");
          observer.disconnect();
        }
      }
    },
    { threshold },
  );

  observer.observe(node);

  return {
    destroy() {
      observer?.disconnect();
    },
  }
};

// Originally sourced from https://stackoverflow.com/a/11196395
class PauseableInterval {
  constructor(callback, delay) {
    this.callback = callback;
    this.delay = delay;
    this.pausedTimeLeft = 0;
    this.timerIsPaused = false;
    this.timerHasPaused = false;
    this.triggerSetAt = new Date().getTime();
    this.timer = setInterval(this.callback, this.delay);
  }

  reset() {
    this.#clearTimer();

    this.pausedTimeLeft = 0;
    this.timerIsPaused = false;
    this.timerHasPaused = false;
    this.triggerSetAt = new Date().getTime();

    this.timer = setInterval(this.callback, this.delay);
  }

  #getTimeLeft() {
    const now = new Date();
    const timeLeft = this.timerHasPaused ? this.pausedTimeLeft : this.delay;

    // Once a timer has been paused the remaining amount of time left
    // needs to be calculated from the paused time left.
    return timeLeft - ((now - this.triggerSetAt) % this.delay)
  }

  pause() {
    this.pausedTimeLeft = this.#getTimeLeft();
    this.timerIsPaused = true;
    this.timerHasPaused = true;
    this.#clearTimer();
  }

  resume() {
    // A new trigger is set based on unpaused. PauseTimeLeft is used
    // as the setTimeout timer.
    this.triggerSetAt = new Date().getTime();

    this.timer = setTimeout(() => {
      this.callback();
      this.reset();
    }, this.pausedTimeLeft);
  }

  #clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  isPaused() {
    return this.timerIsPaused
  }
}

const { SHOPIFY_BLOCK_SELECT, SHOPIFY_BLOCK_DESELECT } = EVENTS;

class SlideshowSection extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      cursor: "[js-slideshow-cursor]",
      loadingOverlay: "[js-slideshow-loading-overlay]",
      pagination: "[js-slideshow-pagination]",
      paginationBullet: "[js-slideshow-pagination-bullet]",
      paginationNav: "[js-slideshow-pagination-nav]",
      parentSection: ".shopify-section",
      slide: "[js-slideshow-slide]",
      slideByBlockId: (id) => `[data-block-id="${id}"]`,
      slideImageDesktop: "[js-slideshow-desktop-slide-image]",
      slideImageMobile: "[js-slideshow-mobile-slide-image]",
      slideContent: "[js-slideshow-slide-content]",
      slideshow: "[js-slideshow]",
      slideshowPause: "[js-slideshow-pause]",
      videoContainer: "[js-current-background-video-container]",
      videoPlaceholderImage:
        "[js-background-video-placeholder] .placeholder-image",
      videoPauseButton: "[js-video-pause-button]",
      videoSlide: "[js-slideshow-video-slide]",
    };

    this.classes = {
      active: "active",
      currentSlide: "current-slide",
      loaded: "loaded",
      nextSlide: "next-slide",
      prevCursor: "slideshow__cursor--prev",
      nextCursor: "slideshow__cursor--next",
      slideTransitionOut: "slide-transition-out",
      visible: "visible",
    };

    this.breakpoints = {
      mobile: getMediaQuery("mobile"),
      smallDesktop: getMediaQuery("small-desktop"),
    };

    this.strings = window.theme.strings;
  }

  connectedCallback() {
    intersectionWatcher(this);
    this.slideshow = this.querySelector(this.selectors.slideshow);
    this.loadingOverlay = this.querySelector(this.selectors.loadingOverlay);
    this.slides = this.querySelectorAll(this.selectors.slide);
    this.slideList = Array.from(this.slides);
    this.currentSlide = this.loadingOverlay;
    this.firstSlideIndex = "0";
    this.lastSlideIndex = `${this.slides.length - 1}`;
    this.firstIndexOnLoad = "0";
    this.controller = new AbortController();

    const eventOptions = { signal: this.controller.signal };

    // Pagination
    this.paginationBullets = this.querySelectorAll(
      this.selectors.paginationBullet,
    );
    this.paginationBullets.forEach((bullet) => {
      bullet.addEventListener(
        "click",
        this.handlePaginationBulletClick.bind(this),
        eventOptions,
      );
    });

    this.initLoadingOverlay();

    // Watch for small-desktop breakpoint to handle cursor and nav button functionality
    if (this.slides.length > 1) {
      atBreakpointChange(1024, this.handleWindowResize.bind(this));
      this.handleWindowResize();
    }

    // Block events
    if (window.Shopify.designMode) {
      this.parentSection = this.closest(this.selectors.parentSection);
      this.parentSection.addEventListener(
        SHOPIFY_BLOCK_SELECT,
        this.handleSlideSelect.bind(this),
        eventOptions,
      );
      this.parentSection.addEventListener(
        SHOPIFY_BLOCK_DESELECT,
        this.handleSlideDeselect.bind(this),
        eventOptions,
      );
    }
  }

  initLoadingOverlay() {
    // Check whether first slide is a video or image
    if (this.slides[0].matches(this.selectors.videoSlide)) {
      const firstSlideVideoContainer = this.slides[0].querySelector(
        this.selectors.videoContainer,
      );

      if (firstSlideVideoContainer) {
        if (firstSlideVideoContainer.children.length > 0) {
          this.hideLoadingOverlay();
        } else {
          const videoSlideObserver = new MutationObserver(
            (mutations, observer) => {
              for (const mutation of mutations) {
                if (mutation.target.children.length > 0) {
                  this.hideLoadingOverlay();
                  observer.disconnect();
                }
              }
            },
          );

          videoSlideObserver.observe(firstSlideVideoContainer, {
            childList: true,
          });
        }
      } else {
        const firstSlidePlaceholderImage = this.slides[0].querySelector(
          this.selectors.videoPlaceholderImage,
        );

        if (
          firstSlidePlaceholderImage.classList.contains(this.classes.visible)
        ) {
          this.hideLoadingOverlay();
        } else {
          const videoSlideObserver = this.createClassMutationObserver(
            this.hideLoadingOverlay.bind(this),
          );

          videoSlideObserver.observe(firstSlidePlaceholderImage, {
            attributeFilter: ["class"],
          });
        }
      }
    } else {
      let firstSlideImage = this.slides[0].querySelector(
        this.selectors.slideImageDesktop,
      );

      if (window.matchMedia(this.breakpoints.mobile).matches) {
        const firstSlideMobileImage = this.slides[0].querySelector(
          this.selectors.slideImageMobile,
        );
        if (firstSlideMobileImage) {
          firstSlideImage = firstSlideMobileImage;
        }
      }

      if (firstSlideImage.classList.contains(this.classes.visible)) {
        this.hideLoadingOverlay();
      } else {
        const imageSlideObserver = this.createClassMutationObserver(
          this.hideLoadingOverlay.bind(this),
        );

        imageSlideObserver.observe(firstSlideImage, {
          attributeFilter: ["class"],
        });
      }
    }
  }

  createClassMutationObserver(callback) {
    return new MutationObserver((mutations, observer) => {
      for (const mutation of mutations) {
        if (mutation.target.classList.contains(this.classes.visible)) {
          callback();
          observer.disconnect();
        }
      }
    })
  }

  hideLoadingOverlay() {
    this.changeSlide(this.firstIndexOnLoad);
    this.classList.add(this.classes.loaded);

    if (
      this.slides.length > 1 &&
      this.getAttribute("data-enable-autoplay") === "true"
    ) {
      this.initAutoplay();
    }
  }

  handlePaginationBulletClick(event) {
    this.changeSlide(event.currentTarget.getAttribute("data-slide-index"));
  }

  handleWindowResize() {
    if (window.matchMedia(this.breakpoints.smallDesktop).matches) {
      this.mobileController?.abort();
      this.initCursor();
    } else {
      this.cursorController?.abort();
      this.widthWatcher?.destroy();
      this.mobileController = new AbortController();
      this.initSwipeNav();
      this.initPaginationNav();
    }
  }

  initCursor() {
    this.cursor = this.querySelector(this.selectors.cursor);
    this.cursorController = new AbortController();
    this.midpoint = this.offsetWidth / 2;
    const cursorEventOptions = { signal: this.cursorController.signal };

    // Track the "midpoint" of the slider so the cursor can update for prev/next
    this.widthWatcher = srraf(({ vw, pvw }) => {
      if (vw === pvw) return
      this.midpoint = this.offsetWidth / 2;
    });

    this.slideshow.addEventListener(
      "mouseenter",
      this.showCursor.bind(this),
      cursorEventOptions,
    );

    this.slideshow.addEventListener(
      "mousemove",
      this.updateCursorPosition.bind(this),
      cursorEventOptions,
    );

    this.slideshow.addEventListener(
      "mouseleave",
      this.hideCursor.bind(this),
      cursorEventOptions,
    );

    // Track mouse enter/leave of interactive elements so that we can disable the custom cursor
    this.pagination = this.querySelector(this.selectors.pagination);
    this.slideContentElements = this.querySelectorAll(
      this.selectors.slideContent,
    );

    this.interactiveElementSelectors = `${this.selectors.loadingOverlay}, ${this.selectors.pagination}, ${this.selectors.slideContent}, ${this.selectors.videoPauseButton}`;
    const interactiveElements = [this.loadingOverlay, this.pagination];
    this.slideContentElements.forEach((slideContentElement) => {
      interactiveElements.push(slideContentElement);
    });

    interactiveElements.forEach((element) => {
      element.addEventListener(
        "mouseenter",
        this.hideCursor.bind(this),
        cursorEventOptions,
      );
      element.addEventListener(
        "mouseleave",
        this.showCursor.bind(this),
        cursorEventOptions,
      );
    });

    // Handle clicks
    this.slideshow.addEventListener(
      "click",
      this.handleSlideshowClick.bind(this),
      cursorEventOptions,
    );
  }

  showCursor() {
    this.cursor.classList.add(this.classes.active);
  }

  updateCursorPosition(event) {
    /*
     * Update the cursor position
     *
     * We use pageX/pageY because offsetX/offsetY are thrown off by child
     * elements, which means that offsetTop and paddingTop need to be
     * accounted for.
     *
     * We also account for the size of the cursor element so that the element
     * is centered on the actual cursor. The element is 54px wide/tall, so we
     * subtract 27.
     */
    this.cursor.style.top = `${
      event.pageY - 27 - this.offsetTop - this.getAttribute("data-padding-top")
    }px`;
    this.cursor.style.left = `${event.pageX - 27 - this.slideshow.offsetLeft}px`;

    // Update the cursor display (prev/next)
    if (event.pageX <= this.midpoint) {
      this.cursor.classList.add(this.classes.prevCursor);
      this.cursor.classList.remove(this.classes.nextCursor);
    } else {
      this.cursor.classList.remove(this.classes.prevCursor);
      this.cursor.classList.add(this.classes.nextCursor);
    }
  }

  hideCursor() {
    this.cursor.classList.remove(this.classes.active);
  }

  handleSlideshowClick(event) {
    // If the click wasn't on an interactive element, change slides
    if (!event.target.closest(this.interactiveElementSelectors)) {
      const direction = this.cursor.classList.contains(this.classes.prevCursor)
        ? "prev"
        : "next";

      // Not sure why we need this 40.5 (equivalent to 3/4 ofthe cursor width/height), but
      // it aligns the radial gradient to the cursor
      const irisOriginX =
        ((event.offsetX + 40.5) / this.slideshow.offsetWidth) * 100.0;
      const irisOriginY =
        ((event.offsetY + 40.5) / this.slideshow.offsetHeight) * 100.0;
      const irisOrigin = `${irisOriginX}% ${irisOriginY}%`;

      this.changeSlide(this.getNewSlideIndex(direction), irisOrigin);
    }
  }

  initSwipeNav() {
    this.slideshow.addEventListener(
      "pointerdown",
      this.handleSwipeStart.bind(this),
      { signal: this.mobileController.signal },
    );
    this.slideshow.addEventListener(
      "pointerup",
      this.handleSwipeEnd.bind(this),
      { signal: this.mobileController.signal },
    );
  }

  handleSwipeStart(event) {
    this.swipeStartX = event.offsetX;
    this.swipeStartY = event.offsetY;
  }

  handleSwipeEnd(event) {
    this.swipeEndX = event.offsetX;
    this.swipeEndY = event.offsetY;

    // For a swipe register, it can only deviate on the y-axis by 20px, and must be 15px, or more, on the x-axis
    if (
      Math.abs(this.swipeStartY - this.swipeEndY) <= 20 &&
      Math.abs(this.swipeStartX - this.swipeEndX) >= 15
    ) {
      if (
        this.swipeStartX > this.swipeEndX &&
        this.swipeStartX - this.swipeEndX >= 15
      ) {
        this.changeSlide(this.getNewSlideIndex("next"));
      } else if (
        this.swipeStartX < this.swipeEndX &&
        this.swipeEndX - this.swipeStartX >= 15
      ) {
        this.changeSlide(this.getNewSlideIndex("prev"));
      }
    }
  }

  initPaginationNav() {
    this.paginationNavButtons = this.querySelectorAll(
      this.selectors.paginationNav,
    );

    this.paginationNavButtons.forEach((button) => {
      button.addEventListener(
        "click",
        this.handlePaginationNavClick.bind(this),
        { signal: this.mobileController.signal },
      );
    });
  }

  handlePaginationNavClick(event) {
    this.changeSlide(
      this.getNewSlideIndex(event.currentTarget.getAttribute("data-direction")),
    );
  }

  initAutoplay() {
    // Setting is in seconds, so we need to convert
    this.timeBetweenSlides =
      parseInt(this.getAttribute("data-time-between-slides"), 10) * 1000;
    this.slideshowPause = this.querySelector(this.selectors.slideshowPause);

    this.autoplay = new PauseableInterval(() => {
      this.changeSlide(this.getNewSlideIndex("next"));
    }, this.timeBetweenSlides);

    this.slideshowPause.addEventListener(
      "click",
      this.handlePauseClick.bind(this),
      { signal: this.controller.signal },
    );
  }

  handlePauseClick(event) {
    if (this.getAttribute("data-paused") === "false") {
      this.setAttribute("data-paused", "true");
      event.currentTarget.setAttribute(
        "aria-label",
        this.strings.accessibility.carouselPlay,
      );
      this.autoplay.pause();
    } else {
      this.setAttribute("data-paused", "false");
      event.currentTarget.setAttribute(
        "aria-label",
        this.strings.accessibility.carouselPause,
      );
      this.autoplay.resume();
    }
  }

  getNewSlideIndex(direction) {
    let newSlideIndex;

    if (direction === "prev") {
      if (
        this.currentSlide.getAttribute("data-slide-index") ===
        this.firstSlideIndex
      ) {
        newSlideIndex = this.lastSlideIndex;
      } else {
        newSlideIndex = `${parseInt(this.currentSlideIndex, 10) - 1}`;
      }
    } else {
      if (
        this.currentSlide.getAttribute("data-slide-index") ===
        this.lastSlideIndex
      ) {
        newSlideIndex = this.firstSlideIndex;
      } else {
        newSlideIndex = `${parseInt(this.currentSlideIndex, 10) + 1}`;
      }
    }

    return newSlideIndex
  }

  /**
   * Changes the active slide to the given slide index.
   *
   * @param {string} index - The index of the slide that should become active. This is a string as the index is pulled from data
   *                         attributes.
   */
  changeSlide(index, irisOrigin = "50% 50%") {
    // If the next slide is the same as the current, don't change
    if (index === this.currentSlideIndex) return

    // Set the iris wipe origin
    this.style.setProperty("--slide-iris-origin", irisOrigin);

    // Remove the transition class from any slides that currently have it
    this.slideList.forEach((slide) => {
      slide.classList.remove(this.classes.slideTransitionOut);
    });

    // Set new "current" slide and handle slide change transition
    const currentSlide = this.currentSlide;
    const newSlide = this.slideList.find((slide) => {
      return slide.getAttribute("data-slide-index") === index
    });

    // If the current slide is a video slide, pause the video
    // We timeout for the duration of the slide change so that you don't actually
    //  see the pause
    if (currentSlide.matches(this.selectors.videoSlide)) {
      const video = currentSlide.querySelector("video");

      setTimeout(() => {
        video?.pause();
      }, 1400);
    }

    newSlide.classList.add(this.classes.currentSlide);
    currentSlide.classList.add(this.classes.slideTransitionOut);
    currentSlide.classList.remove(this.classes.currentSlide);
    currentSlide.setAttribute("inert", "");
    this.currentSlide = newSlide;
    this.currentSlideIndex = index;
    this.currentSlide.removeAttribute("inert");

    if (newSlide.matches(this.selectors.videoSlide)) {
      const video = newSlide.querySelector("video");

      // It's possible that we have a video slide with no video (no video has been selected yet)
      video?.play();
    }

    this.paginationBullets.forEach((bullet) => {
      if (bullet.getAttribute("data-slide-index") === index) {
        bullet.classList.add(this.classes.active);
      } else {
        bullet.classList.remove(this.classes.active);
      }
    });

    if (this.autoplay?.isPaused()) {
      this.autoplay.pausedTimeLeft = this.timeBetweenSlides;
    } else {
      this.autoplay?.reset();
    }
  }

  handleSlideSelect(event) {
    const selectedSlide = this.querySelector(
      this.selectors.slideByBlockId(event.detail.blockId),
    );

    if (event.detail.load) {
      if (
        this.slides.length > 1 &&
        this.getAttribute("data-enable-autoplay") === "true"
      ) {
        this.setAutoplay("pause");
      }

      this.firstIndexOnLoad = selectedSlide.getAttribute("data-slide-index");
    } else if (this.currentSlide !== selectedSlide) {
      if (
        this.slides.length > 1 &&
        this.getAttribute("data-enable-autoplay") === "true"
      ) {
        this.setAutoplay("pause");
      }

      this.changeSlide(selectedSlide.getAttribute("data-slide-index"));
    }
  }

  handleSlideDeselect() {
    if (
      this.slides.length > 1 &&
      this.getAttribute("data-enable-autoplay") === "true"
    ) {
      this.setAutoplay("resume");
    }
  }

  setAutoplay(state) {
    if (state === "pause") {
      this.autoplay.pause();
      this.setAttribute("data-paused", "true");
      this.slideshowPause.setAttribute(
        "aria-label",
        this.strings.accessibility.carouselPlay,
      );
    } else {
      this.autoplay.resume();
      this.setAttribute("data-paused", "false");
      this.slideshowPause.setAttribute(
        "aria-label",
        this.strings.accessibility.carouselPause,
      );
    }
  }

  disconnectedCallback() {
    this.controller.abort();
    this.cursorController?.abort();
    this.mobileController?.abort();
    this.widthWatcher?.destroy();
    intersectionWatcher.destroy();
  }
}

if (!customElements.get("slideshow-section")) {
  customElements.define("slideshow-section", SlideshowSection);
}

let loaded$1 = null;

function loadVimeoAPI() {
  if (loaded$1 !== null) return loaded$1

  if (window.Vimeo && window.Vimeo.loaded) {
    loaded$1 = Promise.resolve();
    return loaded$1
  }

  // Otherwise, load API
  loaded$1 = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://player.vimeo.com/api/player.js";
    tag.onload = resolve;
    document.body.appendChild(tag);
  });

  return loaded$1
}

let loaded = null;

function loadYouTubeAPI() {
  // Loading was triggered by a previous call to function
  if (loaded !== null) return loaded

  // API has already loaded
  if (window.YT && window.YT.loaded) {
    loaded = Promise.resolve();
    return loaded
  }

  // Otherwise, load API
  loaded = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  });

  return loaded
}

// Global arrays to track active players to more easily control.
const youTubePlayerArr = [];
const vimeoPlayerArr = [];
const internalPlayerArr = [];

const addPlayerToTrackingArr = (source, player) => {
  if (source === "youtube") {
    youTubePlayerArr.push(player);
  }

  if (source === "vimeo") {
    vimeoPlayerArr.push(player);
  }

  if (source === "internal") {
    internalPlayerArr.push(player);
  }
};

/**
 * If a video is played, any previously started video will pause
 * If a slide (scroll slider or media lightbox) changes, a playing video will pause
 */
const pausePlayingVideos = () => {
  youTubePlayerArr.forEach((player) => {
    player.pauseVideo();
  });

  vimeoPlayerArr.forEach((player) => {
    player.pause();
  });

  internalPlayerArr.forEach((player) => {
    player.pause();
  });
};

const clearPlayerTrackingArr = () => {
  youTubePlayerArr.length = 0;
  vimeoPlayerArr.length = 0;
  internalPlayerArr.length = 0;
};

/*
  YouTube specific state control
-------------------------------------------------------------------------- */
/**
 * Use YouTube player functions to alter settigns and state if poster clicked
 * @param {HTMLIFrameElement} player result of YT.Player
 *
 */
const clickPosterToPlayYouTube = (player) => {
  // Clicking the play button will play video with sound
  // This should true for mobile, safari, and low power mode
  if (!player) return

  player.unMute();
  player.playVideo();
};

const onYouTubePlayerStateChange = (event) => {
  // -1 is 'unstarted' likely due to API not being fully loaded
  if (event.data === -1) {
    event.target.mute();
    event.target.playVideo();
  }

  youTubePlayerArr.forEach((player) => {
    // Don't pause most recently played video, 1 = playing
    if (player !== event.target && event.data === 1) {
      player.pauseVideo();
    }
  });

  vimeoPlayerArr.forEach((player) => {
    player.pause();
  });

  internalPlayerArr.forEach((player) => {
    player.pause();
  });
};

/*
  Vimeo specific state control
-------------------------------------------------------------------------- */

/**
 * Use Vimeo player functions to alter settings and state if poster clicked
 * @param {HTMLIFrameElement} player result of Vimeo.Player
 *
 */
const clickPosterToPlayVimeo = (player) => {
  // Clicking play button will play video with sound
  // except on mobile, which will be muted or requires click to play in low power mode
  if (!player) return

  player.getPaused().then(function (paused) {
    if (paused) {
      player.play();
    } else {
      player.setMuted(true);
      player.play();
    }
  });
};

/**
 * Create a YouTube video player directly from the API
 * @param {HTMLElement} video video player div that will be swapped out with iframe
 * @param {boolean} hadPoster dictate the presence of poster image over video
 */
const initYouTubeVideo = (video, hadPoster) => {
  const videoId = video.dataset.videoId;

  let autoplay = false;
  if (hadPoster) {
    autoplay = true;
  }

  loadYouTubeAPI().then(() => {
    const player = new window.YT.Player(video, {
      videoId,
      playerVars: {
        enablejsapi: 1,
        cc_load_policy: 0,
        controls: 1,
        iv_load_policy: 3,
        playsinline: 1,
        rel: 0,
        playlist: videoId,
        // eslint-disable-next-line object-shorthand
        autoplay: autoplay,
      },
      events: {
        onReady: () => {
          player.getIframe().tabIndex = "0";
          if (hadPoster) {
            clickPosterToPlayYouTube(player);
          } else {
            player.unMute();
          }

          addPlayerToTrackingArr("youtube", player);
        },
        onStateChange: onYouTubePlayerStateChange,
      },
    });
  });
};

/**
 * Update an existing YouTube iframe to allow for API events and actions
 * @param {HTMLIFrameElement} iframe existing iframe, not originally rendered through the API
 * @param {boolean} hadPoster dictate the presence of poster image over video
 */
const updateIframeYouTubeVideo = (iframe, hadPoster) => {
  loadYouTubeAPI().then(() => {
    const player = new window.YT.Player(iframe, {
      events: {
        onReady: () => {
          player.getIframe().tabIndex = "0";

          if (hadPoster) {
            clickPosterToPlayYouTube(player);
          } else {
            player.unMute();
          }

          addPlayerToTrackingArr("youtube", player);
        },
        onStateChange: onYouTubePlayerStateChange,
      },
    });
  });
};

/**
 * Create a Vimeo video player directly from the API
 * @param {HTMLElement} video video player div that will be swapped out with iframe
 * @param {boolean} hadPoster dictate the presence of poster image over video
 */
const initVimeoVideo = (video, hadPoster) => {
  let autoplay = false;
  if (hadPoster) {
    autoplay = true;
  }

  loadVimeoAPI().then(() => {
    const player = new window.Vimeo.Player(video, {
      id: video.dataset.videoId,
      // eslint-disable-next-line object-shorthand
      autoplay: autoplay,
    });

    player.element.tabIndex = "0";
    if (hadPoster) {
      clickPosterToPlayVimeo(player);
    }

    pausePlayingVideos();
    addPlayerToTrackingArr("vimeo", player);
  });
};

/**
 * Update an existing Vimeo iframe to allow for API events and actions
 * @param {HTMLIFrameElement} iframe existing iframe, not originally rendered through the API
 * @param {boolean} hadPoster dictate the presence of poster image over video
 */
const updateIframeVimeoVideo = (iframe, hadPoster) => {
  loadVimeoAPI().then(() => {
    const player = new window.Vimeo.Player(iframe, {
      muted: true,
    });

    player.element.tabIndex = "0";
    if (hadPoster) {
      clickPosterToPlayVimeo(player);
    }

    addPlayerToTrackingArr("vimeo", player);
  });
};

/**
 * Create new YouTube and Vimeo videos. Initialize YouTube, Vimeo and Shopify videos when triggered.
 * @param {HTMLDivElement} node video container with data to structure triggers with video player created during initialization
 */
const liquidMadeVideoPlayer = (node) => {
  const { showPoster, hasPoster } = node.dataset;
  const playButton = node.querySelector("[js-poster-play-button]");

  if (showPoster && hasPoster) {
    playButton.addEventListener("click", () => {
      node.dataset.videoInitialized = "true";
      _initLiquidMadeVideoPlayer(node, { hadPoster: true });
    });

    playButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        node.dataset.videoInitialized = "true";
        _initLiquidMadeVideoPlayer(node, { hadPoster: true });
      }
    });
  } else {
    _initLiquidMadeVideoPlayer(node, { hadPoster: false });
  }
};

const _initLiquidMadeVideoPlayer = (node, poster) => {
  const internalVideo = node.querySelector("[data-video-internal]");
  const externalVideo = node.querySelector("[data-video-external]");

  if (externalVideo) {
    const { videoProvider } = externalVideo.dataset;

    if (videoProvider === "youtube") {
      initYouTubeVideo(externalVideo, poster.hadPoster);
    } else if (videoProvider === "vimeo") {
      initVimeoVideo(externalVideo, poster.hadPoster);
    }
  } else if (internalVideo && poster.hadPoster) {
    pausePlayingVideos();
    internalVideo.play();

    // Delay adding player to arr to prevent pre-emptive pause
    setTimeout(() => {
      addPlayerToTrackingArr("internal", internalVideo);
    }, 100);
  }
};

/**
 * When triggered, append and initialize prepared YouTube, Vimeo and Shopify videos.
 * @param {HTMLDivElement} videoContainer container with data to structure triggers and initialization
 * @param {HTMLElement} video iframe (YouTube & Vimeo) or video element (Shopify) to append
 */
const domMadeVideoPlayer = (videoContainer, video) => {
  const { videoType, showPoster } = videoContainer.dataset;

  if (showPoster === "true") {
    const playButton = videoContainer.querySelector("[js-poster-play-button]");

    playButton.addEventListener("click", () => {
      videoContainer.setAttribute("data-video-initialized", "true");
      videoContainer.appendChild(video);

      _initDomMadeVideoPlayer(video, videoType, { hadPoster: true });
    });

    playButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        videoContainer.setAttribute("data-video-initialized", "true");
        videoContainer.appendChild(video);

        _initDomMadeVideoPlayer(video, videoType, { hadPoster: true });
      }
    });
  } else {
    videoContainer.appendChild(video);
    _initDomMadeVideoPlayer(video, videoType, { hadPoster: false });
  }
};

const _initDomMadeVideoPlayer = (video, videoType, poster) => {
  if (videoType === "youtube") {
    updateIframeYouTubeVideo(video.id, poster.hadPoster);
  } else if (videoType === "vimeo") {
    updateIframeVimeoVideo(video, poster.hadPoster);
  } else {
    if (poster.hadPoster === true) {
      // Only play Shopify video element if poster removed
      pausePlayingVideos();
      addPlayerToTrackingArr("internal", video);
      video.play();
    }
  }
};

class VideoSection extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      currentVideoWrapper: "[js-current-video-wrapper]",
      mobileVideoTemplate: "[js-mobile-video-template]",
      videoTemplate: "[js-video-template]",
      videoPlayerContainer: "[js-video-player-container]",
    };
  }

  connectedCallback() {
    if (this.dataset.requiresTemplate === "true") {
      this.videoTemplate = this.querySelector(this.selectors.videoTemplate);
      this.mobileVideoTemplate = this.querySelector(
        this.selectors.mobileVideoTemplate,
      );
      this.currentVideoWrapper = this.querySelector(
        this.selectors.currentVideoWrapper,
      );

      this.#selectActiveTemplate();
      atBreakpointChange(720, this.#selectActiveTemplate.bind(this));
    } else {
      this.#initVideo();
    }
  }

  #selectActiveTemplate() {
    if (window.matchMedia(getMediaQuery("tablet")).matches) {
      this.#createVideo(this.videoTemplate);
    } else {
      this.#createVideo(this.mobileVideoTemplate);
    }
  }

  #createVideo(template) {
    const videoContent = template.content.cloneNode(true);

    this.currentVideoWrapper.innerHTML = "";
    this.currentVideoWrapper.append(videoContent);
    this.#initVideo();
  }

  #initVideo() {
    const videoPlayerContainer = this.querySelector(
      this.selectors.videoPlayerContainer,
    );

    liquidMadeVideoPlayer(videoPlayerContainer);
  }

  disconnectedCallback() {}
}

if (!customElements.get("video-section")) {
  customElements.define("video-section", VideoSection);
}

const {
  ANNOUNCEMENT_HEIGHT_UPDATED: ANNOUNCEMENT_HEIGHT_UPDATED$1,
  HEADER_HEIGHT_UPDATED: HEADER_HEIGHT_UPDATED$1,
  FILTER_REPAINT: FILTER_REPAINT$1,
  FILTER_SORT_CHANGED: FILTER_SORT_CHANGED$1,
  MODAL_POPUP_CLOSE: MODAL_POPUP_CLOSE$1,
  MODAL_POPUP_CLOSED: MODAL_POPUP_CLOSED$1,
  MODAL_POPUP_OPEN: MODAL_POPUP_OPEN$1,
  SORT_CHANGED: SORT_CHANGED$1,
} = EVENTS;

class CollectionProductGrid extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      activeFilters: "[js-active-filters]",
      announcementBar: "announcement-bar",
      disclosureWrapper: ".disclosure-wrapper",
      filterDrawerTrigger: "[js-filter-drawer-trigger]",
      stickyFilterDrawerTrigger: "[js-filter-drawer-trigger--sticky]",
      filterDrawerHeading: "[js-filter-drawer-heading]",
      filterDrawerViewResults: "[js-filter-view-results]",
      filterDrawerViewResultsIdleLabel: "[js-filter-view-results-label]",
      filterGroup: "[js-filter-group]",
      filterGroupParent: "[js-filter-group-parent]",
      filterSortFormComponent: "[js-filter-sort-form-component]",
      footer: "footer",
      header: "header-wrapper",
      pagination: "[js-pagination]",
      productGrid: "[js-product-grid]",
      promotionTile: "[js-promotion-tile]",
      promotionTilevideo: "[js-promotion-tile] [js-background-video]",
      sortDrawerTrigger: "[js-sort-drawer-trigger]",
      sortDropdowns:
        "[js-sort-top-bar], [js-sort-sticky-button], [js-sort-mobile-drawer]",
      sortTriggerValue: "[js-sort-trigger-value]",
      stickyFilterSort: "[js-sticky-filter-sort-button]",
      topBar: "[js-product-grid-top-bar]",
    };

    this.classes = {
      active: "active",
      hidden: "hidden",
      loading: "loading",
      visible: "is-visible",
    };

    this.ids = {
      filterDrawer: "filterDrawer",
      mobileSortDrawer: "mobileSortDrawer",
    };

    this.breakpoints = {
      smallDesktop: getMediaQuery("small-desktop"),
    };

    this.events = {
      openFilterDrawer: new CustomEvent(
        MODAL_POPUP_OPEN$1(this.ids.filterDrawer),
      ),
      closeFilterDrawer: new CustomEvent(
        MODAL_POPUP_CLOSE$1(this.ids.filterDrawer),
      ),
      openSortDrawer: new CustomEvent(
        MODAL_POPUP_OPEN$1(this.ids.mobileSortDrawer),
      ),
      closeSortDrawer: new CustomEvent(
        MODAL_POPUP_CLOSE$1(this.ids.mobileSortDrawer),
      ),
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.sectionId = this.dataset.sectionId;
    this.sectionPaddingTop = parseInt(
      getComputedStyle(this)
        .getPropertyValue("--section-padding-top")
        .replace("px", ""),
      10,
    );
    this.eventOptions = { signal: this.controller.signal };

    this.header = document.querySelector(this.selectors.header);
    this.announcementBar = document.querySelector(
      this.selectors.announcementBar,
    );
    this.headerHeight = 0;
    this.announcementHeight = 0;
    this.getHeaderAnnouncementHeight();
    document.addEventListener(
      HEADER_HEIGHT_UPDATED$1,
      this.handleHeaderHeightChange.bind(this),
      this.eventOptions,
    );
    document.addEventListener(
      ANNOUNCEMENT_HEIGHT_UPDATED$1,
      this.handleAnnouncementHeightChange.bind(this),
      this.eventOptions,
    );

    this.filterDrawerTriggers = this.querySelectorAll(
      `${this.selectors.filterDrawerTrigger}, ${this.selectors.stickyFilterDrawerTrigger}`,
    );
    this.filterDrawerHeading = this.querySelector(
      this.selectors.filterDrawerHeading,
    );
    this.filterDrawerViewResults = this.querySelector(
      this.selectors.filterDrawerViewResults,
    );
    this.filterDrawerViewResultsIdleLabels = this.querySelectorAll(
      this.selectors.filterDrawerViewResultsIdleLabel,
    );
    this.activeFilters = this.querySelector(this.selectors.activeFilters);
    this.filterGroups = this.querySelectorAll(this.selectors.filterGroup);
    this.topBar = this.querySelector(this.selectors.topBar);
    this.sortTriggerValue = this.querySelector(this.selectors.sortTriggerValue);
    this.sortDropdowns = this.querySelectorAll(this.selectors.sortDropdowns);
    this.productGrid = this.querySelector(this.selectors.productGrid);
    this.promotionTiles = this.querySelectorAll(this.selectors.promotionTile);
    this.filterSortFormComponent = this.querySelector(
      this.selectors.filterSortFormComponent,
    );
    this.pagination = this.querySelector(this.selectors.pagination);

    this.initFilterDrawerTriggers();

    this.filterDrawerViewResults?.addEventListener(
      "click",
      this.handleViewResultsClick.bind(this),
      this.eventOptions,
    );

    this.addEventListener(
      FILTER_SORT_CHANGED$1,
      this.handleFilterSortFormChange.bind(this),
      this.eventOptions,
    );

    this.initSortDropdowns();

    if (
      this.dataset.filterEnabled === "true" ||
      this.dataset.sortEnabled === "true"
    ) {
      this.initStickyFilterSortButton();
    }

    this.sortDrawerTrigger.addEventListener(
      "click",
      this.openSortDrawer.bind(this),
      this.eventOptions,
    );

    // Show the sticky filter/sort button when the mobile sort drawer is closed
    window.addEventListener(
      MODAL_POPUP_CLOSED$1(this.ids.mobileSortDrawer),
      this.showStickyFilterSort.bind(this),
      this.eventOptions,
    );
  }

  initFilterDrawerTriggers() {
    this.filterDrawerTriggers.forEach((trigger) => {
      trigger.addEventListener(
        "click",
        this.handleFilterDrawerOpen.bind(this),
        this.eventOptions,
      );
    });

    // Check whether we should show the sticky filter/sort button when the filter drawer is closed
    window.addEventListener(
      MODAL_POPUP_CLOSED$1(this.ids.filterDrawer),
      this.handleFilterDrawerClose.bind(this),
      this.eventOptions,
    );
  }

  initStickyFilterSortButton() {
    this.siteFooter = document.querySelector(this.selectors.footer);
    this.stickyFilterSort = this.querySelector(this.selectors.stickyFilterSort);
    this.sortDrawerTrigger = this.querySelector(
      this.selectors.sortDrawerTrigger,
    ).parentNode;

    this.mobileFooterObserver = new IntersectionObserver(
      ([{ isIntersecting: visible }]) => {
        if (visible) {
          this.mobileTopBarObserver.disconnect();
          this.hideStickyFilterSort();
        } else {
          this.mobileTopBarObserver.observe(this.topBar);
          this.showStickyFilterSort();
        }
      },
      { threshold: 0.05 },
    );

    this.mobileTopBarObserver = new IntersectionObserver(
      ([{ isIntersecting: visible, boundingClientRect }]) => {
        if (visible) {
          this.showStickyFilterSort();
        } else {
          if (boundingClientRect.top <= 0) {
            this.showStickyFilterSort();
          } else {
            this.hideStickyFilterSort();
          }
        }
      },
    );

    if (this.dataset.stickyFilterSortEnabled === "true") {
      this.footerObserver = new IntersectionObserver(
        ([{ isIntersecting: visible }]) => {
          if (visible) {
            this.topBarObserver.disconnect();
            this.hideStickyFilterSort();
          } else {
            this.topBarObserver.observe(this.topBar);
          }
        },
        { threshold: 0.1 },
      );

      this.topBarObserver = new IntersectionObserver(
        ([{ isIntersecting: visible, boundingClientRect }]) => {
          if (visible) {
            this.topBar.classList.add(this.classes.visible);
            this.hideStickyFilterSort();
          } else {
            this.topBar.classList.remove(this.classes.visible);

            if (
              boundingClientRect.top <=
              this.headerHeight + this.announcementHeight
            ) {
              this.showStickyFilterSort();
            } else {
              this.hideStickyFilterSort();
            }
          }
        },
        {
          rootMargin: `-${
            this.headerHeight + this.announcementHeight
          }px 0px 0px 0px`,
        },
      );
    }

    // Watch for small-desktop breakpoint to handle sticky/filter button visibility
    atBreakpointChange(1024, this.handleWindowResize.bind(this));
    this.handleWindowResize();
  }

  handleFilterDrawerOpen(event) {
    this.hideStickyFilterSort();

    // If the open was triggered by the sticky filter/sort button, we need to delay
    //  to allow the button to animate out.
    // Otherwise, just open
    if (event.target.matches(this.selectors.stickyFilterDrawerTrigger)) {
      setTimeout(() => {
        window.dispatchEvent(this.events.openFilterDrawer);
      }, 240);
    } else {
      window.dispatchEvent(this.events.openFilterDrawer);
    }
  }

  handleFilterDrawerClose() {
    if (
      !this.topBar.classList.contains(this.classes.visible) &&
      this.dataset.stickyFilterSortEnabled === "true"
    ) {
      this.showStickyFilterSort();
    }
  }

  handleViewResultsClick() {
    window.dispatchEvent(this.events.closeFilterDrawer);
  }

  handleFilterSortFormChange(event) {
    const url = `${window.location.pathname}?section_id=${this.sectionId}&${event.detail.searchParams}`;

    const topBarScrollTop =
      this.topBar.getBoundingClientRect().top +
      window.scrollY -
      this.sectionPaddingTop -
      this.headerHeight -
      this.announcementHeight;

    // Scroll to the top bar
    window.scrollTo({ top: topBarScrollTop, behaviour: "smooth" });

    this.updateURLHash(event.detail.searchParams);
    this.classList.add(this.classes.loading);

    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        const doc = new DOMParser().parseFromString(text, "text/html");

        const newProductGrid = doc.querySelector(this.selectors.productGrid);
        const newPagination = doc.querySelector(this.selectors.pagination);

        if (this.dataset.filterEnabled === "true") {
          const newFilterDrawerHeading = doc.querySelector(
            this.selectors.filterDrawerHeading,
          );
          const newFilterDrawerViewResultsIdleLabel = doc.querySelector(
            this.selectors.filterDrawerViewResultsIdleLabel,
          );
          const newActiveFilters = doc.querySelector(
            this.selectors.activeFilters,
          );
          const newFilterDrawerTrigger = doc.querySelector(
            this.selectors.filterDrawerTrigger,
          );

          this.filterDrawerHeading.innerHTML = newFilterDrawerHeading.innerHTML;

          this.filterDrawerViewResultsIdleLabels.forEach((label) => {
            label.innerHTML = newFilterDrawerViewResultsIdleLabel.innerHTML;
          });

          this.activeFilters.innerHTML = newActiveFilters.innerHTML;

          this.filterGroups.forEach((group) => {
            const newGroup = doc.getElementById(group.id);
            const groupParent = group.closest(this.selectors.filterGroupParent);

            if (newGroup) {
              groupParent.classList.remove(this.classes.hidden);
              group.innerHTML = newGroup.innerHTML;
            } else {
              groupParent.classList.add(this.classes.hidden);
            }
          });

          this.filterDrawerTriggers.forEach((trigger) => {
            trigger.innerHTML = newFilterDrawerTrigger.innerHTML;
          });
        }

        this.productGrid.innerHTML = newProductGrid.innerHTML;
        this.productGrid.classList = newProductGrid.classList;
        this.pagination.innerHTML = newPagination.innerHTML;
        this.updateSortDropdowns(event.detail.sortBy);
        this.classList.remove(this.classes.loading);

        const filterRepaintEvent = new CustomEvent(FILTER_REPAINT$1, {
          detail: { newDocument: doc },
        });

        this.filterSortFormComponent.dispatchEvent(filterRepaintEvent);
      });
  }

  updateURLHash(searchParams) {
    history.pushState(
      { searchParams },
      "",
      `${window.location.pathname}${searchParams && "?".concat(searchParams)}`,
    );
  }

  initSortDropdowns() {
    this.sortDropdowns.forEach((dropdown) => {
      const inputs = dropdown.querySelectorAll("input");

      // Add a change listener to each input so that we can emit an event with the change
      inputs.forEach((input) => {
        input.addEventListener(
          "click",
          this.handleSortOptionClick.bind(this),
          this.eventOptions,
        );

        input.addEventListener(
          "keydown",
          this.handleSortOptionKeydown.bind(this),
          this.eventOptions,
        );
      });
    });
  }

  updateSortDropdowns(sortBy) {
    this.dataset.currentSort = sortBy;

    this.sortDropdowns.forEach((dropdown) => {
      const newSelectedInput = dropdown.querySelector(
        `input[value="${sortBy}"]`,
      );
      newSelectedInput.checked = true;
    });
  }

  handleSortOptionKeydown(event) {
    event.preventDefault();

    const inputs = event.currentTarget
      .closest(this.selectors.sortDropdowns)
      .querySelectorAll("input");
    let currentInputIndex;

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] === event.target) {
        currentInputIndex = i;
        break
      }
    }

    switch (event.key) {
      case "ArrowUp": {
        let previousInputIndex = currentInputIndex - 1;

        // If the current input is the first, then the "previous" should be the last
        if (previousInputIndex < 0) {
          previousInputIndex = inputs.length - 1;
        }

        inputs[previousInputIndex].checked = true;
        inputs[previousInputIndex].focus();
        break
      }

      case "ArrowDown": {
        let nextInputIndex = currentInputIndex + 1;

        // If the current input is the first, then the "previous" should be the last
        if (nextInputIndex === inputs.length) {
          nextInputIndex = 0;
        }

        inputs[nextInputIndex].checked = true;
        inputs[nextInputIndex].focus();
        break
      }

      case " ": {
        if (event.target.value === this.dataset.currentSort) {
          this.closeSortDropdown(
            event.target.closest(this.selectors.sortDropdowns),
          );
        } else {
          this.applySortChange(
            event.target.value,
            event.target.dataset.label,
            event.target.closest(this.selectors.sortDropdowns),
          );
        }
      }
    }
  }

  handleSortOptionClick(event) {
    if (event.target.value !== this.dataset.currentSort) {
      this.applySortChange(
        event.target.value,
        event.target.dataset.label,
        event.target.closest(this.selectors.sortDropdowns),
      );
    }
  }

  applySortChange(sortBy, label, parentDropdown) {
    const sortChangedEvent = new CustomEvent(SORT_CHANGED$1, {
      detail: { sortBy },
    });

    this.filterSortFormComponent.dispatchEvent(sortChangedEvent);
    this.sortTriggerValue.innerText = label;
    this.closeSortDropdown(parentDropdown);
  }

  closeSortDropdown(dropdown) {
    const disclosureWrapper = dropdown.closest(this.selectors.disclosureWrapper);

    if (disclosureWrapper) {
      disclosureWrapper.removeAttribute("open");
    } else {
      this.closeSortDrawer();
    }
  }

  handleWindowResize() {
    // If we're above small-desktop, connect an observer to show/hide the sticky
    // filter/sort button when the top bar or footer are in view.
    // Otherwise, connect a mobile-specific observer for when the footer or
    // banner are in view.
    if (window.matchMedia(this.breakpoints.smallDesktop).matches) {
      this.hideStickyFilterSort();
      this.mobileFooterObserver.disconnect();
      this.mobileTopBarObserver.disconnect();

      if (this.dataset.stickyFilterSortEnabled === "true") {
        this.footerObserver.observe(this.siteFooter);
      }
    } else {
      this.hideStickyFilterSort();

      if (this.dataset.stickyFilterSortEnabled === "true") {
        this.footerObserver.disconnect();
        this.topBarObserver.disconnect();
      }

      this.mobileFooterObserver.observe(this.siteFooter);
    }
  }

  openSortDrawer() {
    this.hideStickyFilterSort();

    // Delay to allow sticky filter/sort button to animate out.
    setTimeout(() => {
      window.dispatchEvent(this.events.openSortDrawer);
    }, 240);
  }

  closeSortDrawer() {
    window.dispatchEvent(this.events.closeSortDrawer);
  }

  hideStickyFilterSort() {
    this.stickyFilterSort?.classList.remove(this.classes.active);
  }

  showStickyFilterSort() {
    this.stickyFilterSort?.classList.add(this.classes.active);
  }

  getHeaderAnnouncementHeight() {
    if (this.header.dataset.enableStickyHeader === "true") {
      this.headerHeight = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--header-height")
          .replace("px", ""),
        10,
      );
    }

    if (
      this.announcementBar &&
      this.announcementBar.hasAttribute("data-sticky")
    ) {
      this.announcementHeight = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--announcement-height")
          .replace("px", ""),
        10,
      );
    }
  }

  handleHeaderHeightChange(event) {
    if (this.header.dataset.enableStickyHeader === "true") {
      this.headerHeight = event.detail.height;
      this.mobileFooterObserver.disconnect();
      this.mobileTopBarObserver.disconnect();
      this.footerObserver?.disconnect();
      this.topBarObserver?.disconnect();
      this.initStickyFilterSortButton();
    }
  }

  handleAnnouncementHeightChange(event) {
    if (
      this.announcementBar &&
      this.announcementBar.hasAttribute("data-sticky")
    ) {
      this.announcementHeight = event.detail.height;
      this.mobileFooterObserver.disconnect();
      this.mobileTopBarObserver.disconnect();
      this.footerObserver?.disconnect();
      this.topBarObserver?.disconnect();
      this.initStickyFilterSortButton();
    }
  }

  disconnectedCallback() {
    this.controller.abort();
    this.documentObserver.disconnect();
    this.mobileFooterObserver.disconnect();
    this.mobileTopBarObserver.disconnect();
    this.footerObserver?.disconnect();
    this.topBarObserver?.disconnect();
    atBreakpointChange.unload();
  }
}

if (!customElements.get("collection-product-grid")) {
  customElements.define("collection-product-grid", CollectionProductGrid);
}

const { icons } = window.theme;

function setupMediaLightbox(node) {
  const lightboxMedia = node.querySelectorAll(".lightbox-media");

  if (!lightboxMedia.length) return

  let mediaLightbox;

  import(flu.chunks.photoswipe).then(({ PhotoSwipeLightbox, PhotoSwipe }) => {
    mediaLightbox = new PhotoSwipeLightbox({
      gallery: node,
      children: "a",
      showHideAnimationType: "zoom",
      pswpModule: PhotoSwipe,
      mainClass: "pswp--product-lightbox",
      bgOpacity: 1,
      arrowPrevSVG: icons.leftChevronWithStem,
      arrowNextSVG: icons.rightChevronWithStem,
      closeSVG: icons.close,
      zoomSVG: icons.zoom,
      preloadFirstSlide: true,
    });

    // Add ability to check for video present within lightbox
    mediaLightbox.addFilter("itemData", (itemData) => {
      const videoUrl = itemData.element.dataset.videoUrl;

      if (videoUrl) {
        itemData.videoUrl = videoUrl;
      }
      return itemData
    });

    mediaLightbox.on("contentLoad", (e) => {
      const { content } = e;

      if (content.type === "video") {
        e.preventDefault();

        let {
          externalVideoHost,
          externalVideoId,
          showPoster,
          videoPoster,
          videoAspectRatio,
          isBackgroundVideo,
        } = content.data.element.dataset;

        // Build photoswipe div in advance of iframeContainer being appended
        content.element = document.createElement("div");
        content.element.className = "pswp__video-container";

        // Build video container to append to photoswipe div
        const videoContainer = document.createElement("div");

        if (videoAspectRatio < 1) {
          // Additional class to account for portrait videos to override styling and prevent cropping.
          videoContainer.className =
            "lightbox-video__container mismatched-aspect-video";
        } else {
          videoContainer.className = "lightbox-video__container";
        }

        videoContainer.style.setProperty(
          "--video-aspect-ratio",
          videoAspectRatio,
        );

        let video;

        isBackgroundVideo = isBackgroundVideo === "true";
        if (isBackgroundVideo) {
          video = document.createElement("video");
          video.playsInline = true;
          video.controls = false;
          video.autoplay = true;
          video.muted = true;
          video.src = content.data.videoUrl;
        } else {
          if (
            externalVideoHost === "vimeo" ||
            externalVideoHost === "youtube"
          ) {
            // Build iframe for external videos
            video = document.createElement("iframe");
            video.setAttribute("allowfullscreen", "");
            video.id = `lightbox-video-${externalVideoId}`;
            videoContainer.setAttribute("data-video-type", externalVideoHost);
          } else {
            // Build video element for Shopify videos
            video = document.createElement("video");
            video.playsInline = true;
            video.controls = true;
          }

          video.src = content.data.videoUrl;
        }

        showPoster = showPoster === "true";
        if (showPoster && !isBackgroundVideo) {
          // Show poster and play button until clicked to play
          videoContainer.setAttribute("data-show-poster", true);

          if (externalVideoHost) {
            video.setAttribute("allow", "autoplay");
          }

          const posterTemplate = node.querySelector(
            "[js-lightbox-video-poster-container]",
          );
          const currentPoster = posterTemplate.content.cloneNode(true);
          videoContainer.appendChild(currentPoster);

          let posterImage;

          if (videoPoster) {
            posterImage = videoContainer.querySelector(
              "[js-lightbox-video-poster]",
            );
            posterImage.src = videoPoster;
          } else {
            posterImage = videoContainer.querySelector(".poster-placeholder");
          }
          // Append videoContainer with poster
          content.element.appendChild(videoContainer);
        } else {
          videoContainer.setAttribute("data-has-poster", false);
          content.element.appendChild(videoContainer);
        }

        domMadeVideoPlayer(videoContainer, video);
      }
    });

    mediaLightbox.on("afterInit", () => {
      const initSlideVideo = mediaLightbox.pswp.currSlide.data.type === "video";

      if (initSlideVideo) {
        const initialVideoPlayButton =
          mediaLightbox.pswp.currSlide.content.element.firstChild.childNodes[1];

        // Removes poster to reveal video when opening lightbox
        initialVideoPlayButton.click();
      }
    });

    mediaLightbox.init();

    if (window.Shopify?.designMode) {
      node.addEventListener("shopify:section:load", () => {
        // Re-init lightbox after theme editor re-render to allow it to keep working
        mediaLightbox.init();
      });
    }

    // Hide nav ui elements if single image
    mediaLightbox.on("firstUpdate", () => {
      const { pswp, options } = mediaLightbox;
      const mediaCount = options.dataSource.items.length;

      if (mediaCount === 1) {
        pswp.element.classList.add("pswp--is-single-image");
      }
    });

    // Remove video to stop playing and reset to poster
    mediaLightbox.on("contentDeactivate", ({ content }) => {
      if (content.type === "video") {
        pausePlayingVideos();
      }
    });

    mediaLightbox.on("close", () => {
      clearPlayerTrackingArr();
    });
  });
}

function setupModelViewer(node) {
  const modelEls = node.querySelectorAll("model-viewer");

  if (modelEls.length !== 0) {
    initModels();
  }

  function initModels() {
    window.Shopify.loadFeatures([
      {
        name: "model-viewer-ui",
        version: "1.0",
        onLoad: initModelViewers,
      },
    ]);

    window.Shopify.loadFeatures([
      {
        name: "shopify-xr",
        version: "1.0",
        onLoad: initShopifyXr,
      },
    ]);
  }

  function initModelViewers(errors) {
    if (errors) return

    modelEls.forEach((model) => {
      initCustomModelButtons(model);
    });
  }

  function initShopifyXr() {
    if (!window.ShopifyXR) {
      document.addEventListener("shopify_xr_initialized", () => {
        initShopifyXr();
      });
    } else {
      document.querySelectorAll("[id^='ModelJSON-']").forEach((modelJSON) => {
        window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
        modelJSON.remove();
      });

      window.ShopifyXR.setupXRElements();
    }
  }

  function initCustomModelButtons(model) {
    const viewer = new window.Shopify.ModelViewerUI(model);

    const parentContainer = model.closest(".product-media__item");
    const poster = parentContainer.querySelector(".model-viewer__poster");
    const closeBtn = parentContainer.querySelector(
      ".model-viewer__close-button",
    );

    poster.addEventListener("click", () => {
      parentContainer.classList.add("model-viewer__active");
      viewer.play();
    });

    poster.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        parentContainer.classList.add("model-viewer__active");
        viewer.play();
      }
    });

    closeBtn.addEventListener("click", () => {
      parentContainer.classList.remove("model-viewer__active");
      viewer.pause();
    });

    closeBtn.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        parentContainer.classList.remove("model-viewer__active");
        viewer.pause();
      }
    });
  }
}

class ProductMedia extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      activeThumb: ".product-thumbnails__item-link.active",
      carouselTabIndex: "[js-update-carousel-tabindex]",
      initialMediaContainer: "[data-initial-slide]",
      iframe: "iframe",
      image: ".image",
      mainMediaContainer: ".product-media__items",
      media: ".media",
      mediaItemWrapper: "[js-media-item-wrapper]",
      mobileLoopButton: ".scroll-slider__mobile-loop-nav",
      thumb: "[js-product-thumbnail]",
      thumbById: (id) => `[data-thumbnail-id='${id}']`,
      mediaById: (id) => `[data-slide-index='${id}']`,
      thumbContainer: "[js-product-thumbnails]",
      thumbGradient: ".product-thumbnails__end-cap-gradient",
      video: "video",
      videoPlayerContainer: "[js-video-player-container]",
      videoPoster: ".video-poster-container",
      viewInYourSpace: "[js-in-your-space]",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();

    this.initActiveMedia();

    // Listen for variant change, handle media depending on media grouping setting
    this.addEventListener(
      EVENTS.PRODUCT_VARIANT_CHANGED,
      (event) => {
        if (event.detail.hasMediaGrouping) {
          this.handleRepaint(event);
        } else {
          this.updateActiveMainMediaToVariant(event);
        }
      },
      { signal: this.controller.signal },
    );

    document.addEventListener(
      EVENTS.SHOPIFY_SECTION_LOAD,
      this.handleLeftThumbnailContainerHeight(),
      {
        signal: this.controller.signal,
      },
    );
  }

  initActiveMedia() {
    this.media = this.querySelector(this.selectors.media);

    if (this.media === null) return

    this.activeMediaController = new AbortController();
    this.hasSingleMedia = this.dataset.hasSingleMedia === "true";

    this.mediaLayout = this.dataset.mediaLayout;
    this.mainMediaContainer = this.querySelector(
      this.selectors.mainMediaContainer,
    );
    this.initialMediaContainer = this.querySelector(
      this.selectors.initialMediaContainer,
    );

    // Setup media lightbox
    if (this.dataset.hasProductLightbox === "true") {
      setupMediaLightbox(this.mainMediaContainer);
    }

    // Setup model viewer
    setupModelViewer(this.mainMediaContainer);

    // Load video players
    this.videoPlayerContainers = this.querySelectorAll(
      this.selectors.videoPlayerContainer,
    );
    this.videoPlayerContainers.forEach((video) => liquidMadeVideoPlayer(video));

    //
    // Desktop carousel & all Mobile layouts
    //
    // Load thumbnail indicators
    if (this.mediaLayout === "thumbnails" && this.dataset.thumbnailPosition) {
      this.thumbnailPosition = this.dataset.thumbnailPosition;
    }

    if (!this.hasSingleMedia) {
      this.activeThumb = this.querySelector(this.selectors.activeThumb);
      this.activeMediaId = this.activeThumb.dataset.thumbnailId;
      this.scrollerId = this.dataset.scrollerId;

      // Listen for carousel sliding
      document.addEventListener(
        EVENTS.SCROLL_SLIDER_CHANGED(this.scrollerId),
        (event) => {
          const currentMediaEl = event.detail.currentElement;
          const previousMediaEl = event.detail.previousElement;
          this.mobileLoopButton = this.querySelector(
            this.selectors.mobileLoopButton,
          );

          if (currentMediaEl) {
            if (currentMediaEl !== this.mobileLoopButton) {
              this.updateActiveThumbnails(currentMediaEl.dataset.mediaItemId);
            }

            if (currentMediaEl.dataset.mediaType === "model") {
              this.initViewInYourSpace(currentMediaEl.dataset.mediaItemId);
            }
          }

          // Pause & Add poster back to any active iframes
          if (this.mediaLayout === "thumbnails") {
            if (currentMediaEl) {
              this.updateCarouselA11yNav(currentMediaEl);
            }

            if (previousMediaEl) {
              const prevMediaType = previousMediaEl.dataset.mediaType;

              if (
                prevMediaType === "external_video" ||
                prevMediaType === "video"
              ) {
                const injectedVideoIframe = previousMediaEl.querySelector(
                  this.selectors.iframe,
                );
                const injectedVideoElement = previousMediaEl.querySelector(
                  this.selectors.video,
                );

                if (injectedVideoIframe || injectedVideoElement) {
                  pausePlayingVideos();
                }
              }
            }
          }
        },
        { signal: this.activeMediaController.signal },
      );

      //
      // Desktop carousel layouts only
      //
      if (this.mediaLayout === "thumbnails") {
        this.initThumbnailListeners();

        // Set tabindex within carousels
        this.querySelectorAll(this.selectors.carouselTabIndex).forEach((el) => {
          el.setAttribute("tabindex", "-1");
        });
      }
    }
  }

  handleLeftThumbnailContainerHeight() {
    if (!this.initialMediaContainer) return

    this.videoPoster = this.querySelector(this.selectors.videoPoster);
    const initialMedia = this.initialMediaContainer.querySelector(
      this.selectors.media,
    );
    const mediaEl = this.videoPoster ? this.videoPoster : initialMedia;

    // Allow for slight delay to improve container height within T.E.
    setTimeout(() => {
      this.style.setProperty(
        "--left-thumbnail-container-height",
        `${mediaEl.offsetHeight}px`,
      );
    }, 0);
  }

  initThumbnailListeners() {
    // Listen for page loaded to get left thumbnail column height
    if (this.thumbnailPosition === "left") {
      const initialImg = this.initialMediaContainer.querySelector(
        this.selectors.image,
      );

      initialImg
        .decode()
        .then(() => {
          this.handleLeftThumbnailContainerHeight();
        })
        .then(() => {
          initialImg.classList.add("initial-image");
        });
    }

    const smallDesktop = 1023; // 1023 to make sure 1024 is properly styled
    this.widthWatcher = srraf(({ vw, pvw }) => {
      if (vw !== pvw && vw > smallDesktop) {
        this.handleLeftThumbnailContainerHeight();
      }
    });

    // Listen for thumbnail container scroll to apply gradients
    this.thumbContainer = this.querySelector(this.selectors.thumbContainer);
    this.thumbGradient = this.querySelector(this.selectors.thumbGradient);

    this.thumbContainer.addEventListener(
      "scroll",
      () => {
        this.updateThumbGradientOpacity();
      },
      {
        signal: this.activeMediaController.signal,
      },
    );

    // Listen for thumbnail clicks
    this.thumbnailItems = this.querySelectorAll(this.selectors.thumb);
    this.thumbnailItems.forEach((item) => {
      item.addEventListener(
        "click",
        () => {
          this.updateActiveMainMedia(parseInt(item.dataset.thumbnailIndex));
          this.updateActiveThumbnails(item.dataset.thumbnailId);
        },
        { signal: this.activeMediaController.signal },
      );
    });
  }

  initViewInYourSpace(currentActiveMediaId) {
    this.querySelector(this.selectors.viewInYourSpace).setAttribute(
      "data-shopify-model3d-id",
      currentActiveMediaId,
    );
  }

  updateActiveMainMedia(currentThumbnailIndex) {
    const isDesktopViewport =
      (window.innerWidth || document.documentElement.clientWidth) > 1024;

    if (isDesktopViewport && this.mediaLayout === "columns") {
      const featuredMediaEl = this.querySelector(
        `${this.selectors.mediaById(currentThumbnailIndex)}`,
      );

      featuredMediaEl.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }

    // Scroll slider event included for Column layouts for mobile carousel coverage
    document.dispatchEvent(
      new CustomEvent(EVENTS.SCROLL_SLIDER_GO_TO_SLIDE(this.scrollerId), {
        detail: {
          slideIndex: currentThumbnailIndex,
          behavior: "instant",
        },
      }),
    );
  }

  updateActiveMainMediaToVariant(event) {
    const newMediaId = event.detail.newFeaturedMedia;
    this.mediaItemWrappers = this.querySelectorAll(
      this.selectors.mediaItemWrapper,
    );

    let newMediaIndex;
    for (const media of this.mediaItemWrappers) {
      if (media.dataset.mediaItemId === newMediaId) {
        newMediaIndex = parseInt(media.dataset.slideIndex);
        break
      }
    }

    this.updateActiveMainMedia(newMediaIndex);
  }

  updateActiveThumbnails(currentActiveMediaId) {
    const lastActiveThumbnail = this.querySelector(this.selectors.activeThumb);

    let activeThumbnail = this.querySelector(
      `${this.selectors.thumbById(currentActiveMediaId)}`,
    );

    // Media grouping may create null activeThumbnails
    if (activeThumbnail === null) {
      const firstMediaId = this.querySelector(this.selectors.media).dataset
        .mediaId;

      activeThumbnail = this.querySelector(
        `${this.selectors.thumbById(firstMediaId)}`,
      );
    }

    if (activeThumbnail !== lastActiveThumbnail) {
      // Add and remove active thumbnail indicator
      activeThumbnail.classList.add("active");
      lastActiveThumbnail.classList.remove("active");
      this.activeMediaId = currentActiveMediaId;

      // Scroll active thumbnail into view
      if (this.mediaLayout === "thumbnails") {
        const scrollAttribute =
          this.thumbnailPosition === "left" ? "scrollTop" : "scrollLeft";

        const scrollDistance =
          this.thumbnailPosition === "left"
            ? activeThumbnail.offsetTop -
              activeThumbnail.getBoundingClientRect().height * 2
            : activeThumbnail.offsetLeft -
              activeThumbnail.getBoundingClientRect().width * 2;

        this.thumbContainer[scrollAttribute] = scrollDistance;
      }
    }
  }

  updateThumbGradientOpacity() {
    let beforeOpacity = 0;
    let afterOpacity = 1;

    if (this.thumbnailPosition === "left") {
      if (this.thumbContainer.scrollTop !== 0) {
        beforeOpacity = 1;
      }

      const thumbContainerScrollHeight =
        this.thumbContainer.scrollHeight - this.thumbGradient.offsetHeight;
      const thumbContainerMaxScroll = this.thumbContainer.scrollTop + 1;
      if (thumbContainerMaxScroll >= thumbContainerScrollHeight) {
        afterOpacity = 0;
      }
    } else if (this.thumbnailPosition === "below") {
      if (this.thumbContainer.scrollLeft !== 0) {
        beforeOpacity = 1;
      }

      const thumbContainerScrollWidth =
        this.thumbContainer.scrollWidth - this.thumbGradient.offsetWidth;
      const thumbContainerMaxScroll = this.thumbContainer.scrollLeft + 1;

      if (thumbContainerMaxScroll >= thumbContainerScrollWidth) {
        afterOpacity = 0;
      }
    }

    this.thumbGradient.style.setProperty(
      "--thumb-opacity-before",
      beforeOpacity,
    );
    this.thumbGradient.style.setProperty("--thumb-opacity-after", afterOpacity);
  }

  updateCarouselA11yNav(currentActiveMediaEl) {
    this.allTabIndexEls = this.querySelectorAll(this.selectors.carouselTabIndex);
    this.currentTabIndexEls = currentActiveMediaEl.querySelectorAll(
      this.selectors.carouselTabIndex,
    );

    this.allTabIndexEls.forEach((el) => {
      el.setAttribute("tabindex", "-1");
    });

    this.currentTabIndexEls.forEach((el) => {
      el.removeAttribute("tabindex");
    });
  }

  handleRepaint(event) {
    // In the case that Media Grouping image order creates conflicts, prevent repaint
    if (event.detail.mediaSize > 0) {
      this.activeMediaController.abort();
      this.controller.abort();
      this.connectedCallback();
      this.initActiveMedia();
    }
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("product-media")) {
  customElements.define("product-media", ProductMedia);
}

class MainProductDefault extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      productInner: ".product-inner",

      // Set sticky container
      detailsContainer: ".product__details",
      mediaContainer: ".product__media",

      // Variant change events
      buyButtonBlock: "product-block-buy-buttons",
      buyButtons: "[js-buy-buttons]",
      buyButtonDialog: ".buy-button-dialog",
      inventoryStatusBlock: "[js-product-block-inventory-status]",
      mediaBlock: "product-media",
      mediaItem: ".media",
      popupModalDialog: ".product-block-variant-selector--popup-modal",
      priceBlock: "[js-product-block-price]",
      productForm: "[data-product-form]",
      productFormIdInput: "input[name='id']",
      skuBlock: "[js-product-block-sku]",
      stickyAddToCartContent: "[js-sticky-atc-content]",
      stickyAddToCartDrawer: "[data-fluco-dialog='sticky-add-to-cart-modal']",
      storeAvailabilityContainer: "[js-store-availability-container]",
      variantBlock: "product-block-variant-selector",
      variantMediaGrouping: "[data-enable-media-grouping='true']",
      variantSelectedInputs: "div input:checked",
      selectVariantById: (id) =>
        `[js-variant-input][data-option-value-id="${id}"]`,
    };

    this.classes = {
      changePending: "change-pending",
      hasError: "has-error",
      modalWillOpen: "modal--will-open",
      stickyDetailsContainer: "sticky-details-container",
      stickyMediaContainer: "sticky-media-container",
      preventAnimation: "prevent-animation",
      quickViewProduct: "quick-view-product",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.sectionId = this.getAttribute("data-section-id");
    this.isFeatured =
      this.getAttribute("data-section-type") === "featured-product";
    this.sectionType = this.getAttribute("data-section-type");
    this.productURL = this.getAttribute("data-product-url");
    this.productInner = this.querySelector(this.selectors.productInner);
    this.mediaContainer = this.querySelector(this.selectors.mediaContainer);
    this.detailsContainer = this.querySelector(this.selectors.detailsContainer);

    // Sticky container
    this.setStickyContainer();

    // Variant change handling selectors
    this.productForm = this.querySelector(this.selectors.productForm);
    this.buyButtonBlock = this.querySelector(this.selectors.buyButtonBlock);
    this.mediaBlock = this.querySelector(this.selectors.mediaBlock);
    this.variantBlock = this.querySelector(this.selectors.variantBlock);
    this.variantMediaGrouping = this.querySelector(
      this.selectors.variantMediaGrouping,
    );

    // Listen for variant change
    this.addEventListener(
      EVENTS.PRODUCT_VARIANT_CHANGING,
      (event) => {
        const withinQuickView = event.detail.withinQuickView;
        // If a variant change happens within a Quick view modal, it should be separated from the PDP
        // Splitting out all Quick view modals should be a good safety net.
        if (!withinQuickView) {
          this.handleNewVariant(event.detail);
        }
      },
      { signal: this.controller.signal },
    );

    if (this.sectionType === this.classes.quickViewProduct) {
      // This specifically targets the product within the Quick view to prevent conflicts with the full PDP
      this.addEventListener(EVENTS.PRODUCT_VARIANT_CHANGING, (event) => {
        this.handleNewVariant(event.detail);
      });

      // When a product is added to cart from quick view, close quick view
      this.addEventListener(
        EVENTS.PRODUCT_ADD_SUCCESS,
        () => {
          window.dispatchEvent(
            new CustomEvent(
              EVENTS.MODAL_POPUP_CLOSE(
                `quick-view-${this.getAttribute("data-product-id")}`,
              ),
            ),
          );
        },
        { signal: this.controller.signal },
      );
    }
  }

  //
  // General setup functions
  //
  setStickyContainer() {
    this.stickyContainer = this.productInner.getAttribute(
      "data-sticky-effect-container",
    );
    this.galleryLayout = this.productInner.getAttribute("data-gallery-layout");

    if (
      this.stickyContainer === "gallery" &&
      (this.galleryLayout === "thumbnails_below" ||
        this.galleryLayout === "thumbnails_left")
    ) {
      this.mediaContainer.classList.add(this.classes.stickyMediaContainer);
      this.detailsContainer.classList.remove(
        this.classes.stickyDetailsContainer,
      );
    }

    if (this.stickyContainer === "product_details") {
      this.detailsContainer.classList.add(this.classes.stickyDetailsContainer);
      this.mediaContainer.classList.remove(this.classes.stickyMediaContainer);
    }
  }

  //
  // Variant on change functions
  //
  handleNewVariant(newElements) {
    this.detailsContainer.classList.add(this.classes.changePending);

    const newOptionInput = newElements.newOptionInput;
    const newVariantId = newOptionInput.getAttribute("data-variant-id");

    const params = new URLSearchParams({
      section_id: this.sectionId,
    });

    // Set params with new variant for fetch
    if (newVariantId) {
      params.set("variant", newVariantId);
    } else {
      // Build params from currently selected variants
      const selectedOptionValues = Array.from(
        this.querySelectorAll(this.selectors.variantSelectedInputs),
      )

        .map((element) => element.getAttribute("data-option-value-id"))
        .join(",");

      params.set("option_values", selectedOptionValues);
    }

    // URL only provided if connected to Shopify sibling products
    const newProductUrl = newOptionInput.getAttribute("data-product-url");

    if (newProductUrl) this.productURL = newProductUrl;

    if (!newVariantId && !newProductUrl) {
      this.setUnavailable();
      return
    }

    // Fetch new html to repaint applicable blocks
    fetch(`${this.productURL}?${params}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");

        // If we're on the product page, update the URL for history and deep linking
        if (this.sectionType === "product") {
          this.updateUrlWithVariant(newVariantId);
        }

        // Update html in product blocks
        const blockContentToReplace = [
          "variantBlock",
          "skuBlock",
          "priceBlock",
          "buyButtons",
          "inventoryStatusBlock",
          "storeAvailabilityContainer",
          "stickyAddToCartContent",
        ];

        // Deregister dialogs before updating HTML so they can be reset with new content
        // The availability is removed in quick view, so it's possible that this doesn't exist
        // This should be blocked when updating variants within the Quick view so it doesn't wipe the PDP dialogs
        if (
          this.buyButtonBlock &&
          this.sectionType !== this.classes.quickViewProduct
        ) {
          const dialogKeysToDestroy = [
            `store-availability-drawer-${this.sectionId}`,
            "sticky-add-to-cart-modal",
          ];

          for (const key of dialogKeysToDestroy) {
            if (window.flu.dialogs[key]) {
              window.flu.dialogs[key][1].destroy({ deregister: true });
            }
          }
        }

        this.updateBlockHTML(blockContentToReplace, html);

        // Update product form's variant
        const htmlVariantId = html
          .querySelector(this.selectors.productForm)
          .getAttribute("data-current-product-id");

        // When we're in quick view, the product form is loaded after this component connects
        // and assigns this, so we need to re-assign it
        if (!this.productForm) {
          this.productForm = this.querySelector(this.selectors.productForm);
        }

        this.productForm.setAttribute("data-current-product-id", htmlVariantId);
        this.productForm
          .querySelector(this.selectors.productFormIdInput)
          .setAttribute("value", htmlVariantId);

        //
        // Interactive content requiring events for repainting listeners
        //
        if (this.buyButtonBlock) {
          const newOptionId = newOptionInput.getAttribute(
            "data-option-value-id",
          );

          this.updateBuyButtonBlockContent(
            newElements.withinStickyModal,
            newOptionId,
          );
        }

        if (this.variantBlock) {
          this.updateVariantSelectorBlockContent();
        }

        let hasMediaGrouping = false;
        let newContent = newOptionInput;
        if (this.variantMediaGrouping) {
          hasMediaGrouping = true;
          newContent = html.querySelector(this.selectors.mediaBlock);
        }

        this.updateMediaBlockContent(newContent, hasMediaGrouping);
        this.detailsContainer.classList.remove(this.classes.changePending);
      });
  }

  getUrlWithVariant(url, id) {
    const parsedURL = new URL(url);
    const urlBase = parsedURL.origin + parsedURL.pathname;
    const params = parsedURL.searchParams;

    params.set("variant", id);

    return `${urlBase}?${params}`
  }

  setUnavailable() {
    const unavailableSelectors = [
      this.selectors.priceBlock,
      this.selectors.skuBlock,
    ];

    this.querySelectorAll(unavailableSelectors).forEach(({ classList }) =>
      classList.add("hidden"),
    );
    this.disableSubmitButtons();
    this.detailsContainer.classList.remove(this.classes.changePending);
  }

  disableSubmitButtons() {
    const unavailableString = window.theme.strings.products.product.unavailable;
    const buyButtons = this.querySelector(this.selectors.buyButtons);
    const submitButtons = buyButtons.querySelectorAll("button");

    submitButtons.forEach((button) => {
      const submitButtonLabels = button.querySelectorAll(".button__label");

      button.setAttribute("disabled", "disabled");
      submitButtonLabels.forEach((label) => {
        label.textContent = unavailableString;
      });
    });
  }

  updateUrlWithVariant(variantId) {
    const url = this.getUrlWithVariant(window.location.href, variantId);
    window.history.replaceState({ path: url }, "", url);
  }

  updateBlockHTML(contentToUpdateArray, html) {
    // TODO: Reassess approach, particularly for SKU where additional element
    // required so the innerHTML can be updated.
    contentToUpdateArray.forEach((block) => {
      this[block] = this.querySelector(this.selectors[block]);
      this.htmlBlock = html.querySelector(this.selectors[block]);

      if (this[block]) {
        this[block].outerHTML = this.htmlBlock.outerHTML;
      }
    });
  }

  //
  // Send updated content via events for blocks to handle
  //

  updateBuyButtonBlockContent(withinStickyModal, lastOptionSelectedId) {
    this.buyButtonBlock.classList.remove(this.classes.hasError);
    this.buyButtonBlock = this.querySelector(this.selectors.buyButtonBlock);

    // Register new dialog content for store availability and sticky atc
    const buyButtonDialogs = this.buyButtonBlock.querySelectorAll(
      this.selectors.buyButtonDialog,
    );
    buyButtonDialogs.forEach((dialogEl) => {
      dialog(dialogEl);
    });

    // Control animations within open Sticky add to cart modal
    this.stickyDialog = this.buyButtonBlock.querySelector(
      this.selectors.stickyAddToCartDrawer,
    );

    if (withinStickyModal && this.stickyDialog) {
      this.stickyDialog.classList.remove(this.classes.modalWillOpen);

      // A race condition requires a time out here otherwise selector will return null
      setTimeout(() => {
        this.stickyDialog
          .querySelector(this.selectors.selectVariantById(lastOptionSelectedId))
          ?.focus();
      }, 0);

      window.dispatchEvent(
        new CustomEvent(EVENTS.MODAL_POPUP_OPEN("sticky-add-to-cart-modal")),
      );
    }

    this.buyButtonBlock.dispatchEvent(
      new CustomEvent(EVENTS.PRODUCT_VARIANT_CHANGED),
    );
  }

  updateVariantSelectorBlockContent() {
    // The Quick view approach within product-item-quick-shopping.js removes whitelisted dialogs and
    // injects them after the Quick view dialog to allow for nesting that doesn't conflict
    // (ex. Clicking the close button on a popup doesn't close Quick view). Variant change
    // inserts the dialog back to their original placement and need to be removed again.
    if (this.sectionType === this.classes.quickViewProduct) {
      const defaultPopupModalDialog = this.querySelector(
        this.selectors.popupModalDialog,
      );

      defaultPopupModalDialog?.remove();
    }

    this.variantBlock.dispatchEvent(
      new CustomEvent(EVENTS.PRODUCT_VARIANT_CHANGED),
    );
  }

  updateMediaBlockContent(newContent, hasMediaGrouping) {
    // There's a split path depending on if Media grouping is enabled
    // Media grouping needs to update indicators and repaint the block
    if (hasMediaGrouping) {
      const mediaSize = parseInt(
        newContent.getAttribute("data-media-count"),
        10,
      );

      // TODO: Look into alternate approach in CSS to do the calcs with --mediaCount
      const mobileThumbnailWidthPercentage = (
        100 / parseInt(mediaSize, 10)
      ).toFixed(2);

      this.mediaBlock.style.setProperty(
        "--mobile-thumbnail-width-percentage",
        `${mobileThumbnailWidthPercentage}%`,
      );

      this.mediaBlock = this.querySelector(this.selectors.mediaBlock);
      this.mediaBlock.outerHTML = newContent.outerHTML;

      // Reassign media block so it's pulling the most up to date one
      this.mediaBlock = this.querySelector(this.selectors.mediaBlock);
      this.mediaBlock.dispatchEvent(
        new CustomEvent(EVENTS.PRODUCT_VARIANT_CHANGED, {
          detail: {
            hasMediaGrouping: true,
            mediaSize,
          },
        }),
      );
    } else {
      // Media without grouping needs set navigate to featured media, properly
      // trigger slider events, styling and stay aware of other featured media
      const newFeaturedMedia = newContent.getAttribute(
        "data-option-value-featured-media",
      );

      if (newFeaturedMedia) {
        const variantMediaChangedEvent = new CustomEvent(
          EVENTS.PRODUCT_VARIANT_CHANGED,
          {
            bubbles: true,
            detail: {
              hasMediaGrouping: false,
              newFeaturedMedia,
            },
          },
        );

        this.mediaItem = this.querySelector(this.selectors.mediaItem);
        this.mediaItem.dispatchEvent(variantMediaChangedEvent);
      }
    }
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("main-product-default")) {
  customElements.define("main-product-default", MainProductDefault);
}

const {
  ANNOUNCEMENT_HEIGHT_UPDATED,
  HEADER_HEIGHT_UPDATED,
  FILTER_REPAINT,
  FILTER_SORT_CHANGED,
  MODAL_POPUP_CLOSE,
  MODAL_POPUP_CLOSED,
  MODAL_POPUP_OPEN,
  SORT_CHANGED,
} = EVENTS;

class SearchResultGrid extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      activeFilters: "[js-active-filters]",
      announcementBar: "announcement-bar",
      disclosureWrapper: ".disclosure-wrapper",
      filterDrawerTrigger: "[js-filter-drawer-trigger]",
      stickyFilterDrawerTrigger: "[js-filter-drawer-trigger--sticky]",
      filterDrawerHeading: "[js-filter-drawer-heading]",
      filterDrawerViewResults: "[js-filter-view-results]",
      filterDrawerViewResultsIdleLabel: "[js-filter-view-results-label]",
      filterGroup: "[js-filter-group]",
      filterGroupParent: "[js-filter-group-parent]",
      filterSortFormComponent: "[js-filter-sort-form-component]",
      footer: "footer",
      header: "header-wrapper",
      pagination: "[js-pagination]",
      resultGrid: "[js-result-grid]",
      promotionTile: "[js-promotion-tile]",
      promotionTilevideo: "[js-promotion-tile] [js-background-video]",
      sortDrawerTrigger: "[js-sort-drawer-trigger]",
      sortDropdowns:
        "[js-sort-top-bar], [js-sort-sticky-button], [js-sort-mobile-drawer]",
      sortTriggerValue: "[js-sort-trigger-value]",
      stickyFilterSort: "[js-sticky-filter-sort-button]",
      topBar: "[js-result-grid-top-bar]",
    };

    this.classes = {
      active: "active",
      hidden: "hidden",
      loading: "loading",
      visible: "is-visible",
    };

    this.ids = {
      filterDrawer: "filterDrawer",
      mobileSortDrawer: "mobileSortDrawer",
    };

    this.breakpoints = {
      smallDesktop: getMediaQuery("small-desktop"),
    };

    this.events = {
      openFilterDrawer: new CustomEvent(
        MODAL_POPUP_OPEN(this.ids.filterDrawer),
      ),
      closeFilterDrawer: new CustomEvent(
        MODAL_POPUP_CLOSE(this.ids.filterDrawer),
      ),
      openSortDrawer: new CustomEvent(
        MODAL_POPUP_OPEN(this.ids.mobileSortDrawer),
      ),
      closeSortDrawer: new CustomEvent(
        MODAL_POPUP_CLOSE(this.ids.mobileSortDrawer),
      ),
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.sectionId = this.dataset.sectionId;
    this.sectionPaddingTop = parseInt(
      getComputedStyle(this)
        .getPropertyValue("--section-padding-top")
        .replace("px", ""),
      10,
    );
    this.eventOptions = { signal: this.controller.signal };

    this.header = document.querySelector(this.selectors.header);
    this.announcementBar = document.querySelector(
      this.selectors.announcementBar,
    );
    this.headerHeight = 0;
    this.announcementHeight = 0;
    this.getHeaderAnnouncementHeight();
    document.addEventListener(
      HEADER_HEIGHT_UPDATED,
      this.handleHeaderHeightChange.bind(this),
      this.eventOptions,
    );
    document.addEventListener(
      ANNOUNCEMENT_HEIGHT_UPDATED,
      this.handleAnnouncementHeightChange.bind(this),
      this.eventOptions,
    );

    this.filterDrawerTriggers = this.querySelectorAll(
      `${this.selectors.filterDrawerTrigger}, ${this.selectors.stickyFilterDrawerTrigger}`,
    );
    this.filterDrawerHeading = this.querySelector(
      this.selectors.filterDrawerHeading,
    );
    this.filterDrawerViewResults = this.querySelector(
      this.selectors.filterDrawerViewResults,
    );
    this.filterDrawerViewResultsIdleLabels = this.querySelectorAll(
      this.selectors.filterDrawerViewResultsIdleLabel,
    );
    this.activeFilters = this.querySelector(this.selectors.activeFilters);
    this.filterGroups = this.querySelectorAll(this.selectors.filterGroup);
    this.topBar = this.querySelector(this.selectors.topBar);
    this.sortTriggerValue = this.querySelector(this.selectors.sortTriggerValue);
    this.sortDropdowns = this.querySelectorAll(this.selectors.sortDropdowns);
    this.resultGrid = this.querySelector(this.selectors.resultGrid);
    this.promotionTiles = this.querySelectorAll(this.selectors.promotionTile);
    this.filterSortFormComponent = this.querySelector(
      this.selectors.filterSortFormComponent,
    );
    this.pagination = this.querySelector(this.selectors.pagination);

    this.initFilterDrawerTriggers();

    this.filterDrawerViewResults?.addEventListener(
      "click",
      this.handleViewResultsClick.bind(this),
      this.eventOptions,
    );

    this.addEventListener(
      FILTER_SORT_CHANGED,
      this.handleFilterSortFormChange.bind(this),
      this.eventOptions,
    );

    this.initSortDropdowns();

    if (
      this.dataset.filterEnabled === "true" ||
      this.dataset.sortEnabled === "true"
    ) {
      this.initStickyFilterSortButton();
    }

    this.sortDrawerTrigger.addEventListener(
      "click",
      this.openSortDrawer.bind(this),
      this.eventOptions,
    );

    // Show the sticky filter/sort button when the mobile sort drawer is closed
    window.addEventListener(
      MODAL_POPUP_CLOSED(this.ids.mobileSortDrawer),
      this.showStickyFilterSort.bind(this),
      this.eventOptions,
    );
  }

  initFilterDrawerTriggers() {
    this.filterDrawerTriggers.forEach((trigger) => {
      trigger.addEventListener(
        "click",
        this.handleFilterDrawerOpen.bind(this),
        this.eventOptions,
      );
    });

    // Check whether we should show the sticky filter/sort button when the filter drawer is closed
    window.addEventListener(
      MODAL_POPUP_CLOSED(this.ids.filterDrawer),
      this.handleFilterDrawerClose.bind(this),
      this.eventOptions,
    );
  }

  initStickyFilterSortButton() {
    this.siteFooter = document.querySelector(this.selectors.footer);
    this.stickyFilterSort = this.querySelector(this.selectors.stickyFilterSort);
    this.sortDrawerTrigger = this.querySelector(
      this.selectors.sortDrawerTrigger,
    ).parentNode;

    this.mobileFooterObserver = new IntersectionObserver(
      ([{ isIntersecting: visible }]) => {
        if (visible) {
          this.mobileTopBarObserver.disconnect();
          this.hideStickyFilterSort();
        } else {
          this.mobileTopBarObserver.observe(this.topBar);
          this.showStickyFilterSort();
        }
      },
      { threshold: 0.05 },
    );

    this.mobileTopBarObserver = new IntersectionObserver(
      ([{ isIntersecting: visible, boundingClientRect }]) => {
        if (visible) {
          this.showStickyFilterSort();
        } else {
          if (boundingClientRect.top <= 0) {
            this.showStickyFilterSort();
          } else {
            this.hideStickyFilterSort();
          }
        }
      },
    );

    if (this.dataset.stickyFilterSortEnabled === "true") {
      this.footerObserver = new IntersectionObserver(
        ([{ isIntersecting: visible }]) => {
          if (visible) {
            this.topBarObserver.disconnect();
            this.hideStickyFilterSort();
          } else {
            this.topBarObserver.observe(this.topBar);
          }
        },
        { threshold: 0.1 },
      );

      this.topBarObserver = new IntersectionObserver(
        ([{ isIntersecting: visible, boundingClientRect }]) => {
          if (visible) {
            this.topBar.classList.add(this.classes.visible);
            this.hideStickyFilterSort();
          } else {
            this.topBar.classList.remove(this.classes.visible);

            if (
              boundingClientRect.top <=
              this.headerHeight + this.announcementHeight
            ) {
              this.showStickyFilterSort();
            } else {
              this.hideStickyFilterSort();
            }
          }
        },
        {
          rootMargin: `-${
            this.headerHeight + this.announcementHeight
          }px 0px 0px 0px`,
        },
      );
    }

    // Watch for small-desktop breakpoint to handle sticky/filter button visibility
    atBreakpointChange(1024, this.handleWindowResize.bind(this));
    this.handleWindowResize();
  }

  handleFilterDrawerOpen(event) {
    this.hideStickyFilterSort();

    // If the open was triggered by the sticky filter/sort button, we need to delay
    //  to allow the button to animate out.
    // Otherwise, just open.
    if (event.target.matches(this.selectors.stickyFilterDrawerTrigger)) {
      setTimeout(() => {
        window.dispatchEvent(this.events.openFilterDrawer);
      }, 240);
    } else {
      window.dispatchEvent(this.events.openFilterDrawer);
    }
  }

  handleFilterDrawerClose() {
    if (
      !this.topBar.classList.contains(this.classes.visible) &&
      this.dataset.stickyFilterSortEnabled === "true"
    ) {
      this.showStickyFilterSort();
    }
  }

  handleViewResultsClick() {
    window.dispatchEvent(this.events.closeFilterDrawer);
  }

  handleFilterSortFormChange(event) {
    const url = `${window.location.pathname}?section_id=${this.sectionId}&${event.detail.searchParams}`;

    const topBarScrollTop =
      this.topBar.getBoundingClientRect().top +
      window.scrollY -
      this.sectionPaddingTop -
      this.headerHeight -
      this.announcementHeight;

    // Scroll to the top bar
    window.scrollTo({ top: topBarScrollTop, behaviour: "smooth" });

    this.updateURLHash(event.detail.searchParams);
    this.classList.add(this.classes.loading);

    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        const doc = new DOMParser().parseFromString(text, "text/html");

        const newresultGrid = doc.querySelector(this.selectors.resultGrid);
        const newPagination = doc.querySelector(this.selectors.pagination);

        if (this.dataset.filterEnabled === "true") {
          const newFilterDrawerHeading = doc.querySelector(
            this.selectors.filterDrawerHeading,
          );
          const newFilterDrawerViewResultsIdleLabel = doc.querySelector(
            this.selectors.filterDrawerViewResultsIdleLabel,
          );
          const newActiveFilters = doc.querySelector(
            this.selectors.activeFilters,
          );
          const newFilterDrawerTrigger = doc.querySelector(
            this.selectors.filterDrawerTrigger,
          );

          this.filterDrawerHeading.innerHTML = newFilterDrawerHeading.innerHTML;

          this.filterDrawerViewResultsIdleLabels.forEach((label) => {
            label.innerHTML = newFilterDrawerViewResultsIdleLabel.innerHTML;
          });

          this.activeFilters.innerHTML = newActiveFilters.innerHTML;

          this.filterGroups.forEach((group) => {
            const newGroup = doc.getElementById(group.id);
            const groupParent = group.closest(this.selectors.filterGroupParent);

            if (newGroup) {
              groupParent.classList.remove(this.classes.hidden);
              group.innerHTML = newGroup.innerHTML;
            } else {
              groupParent.classList.add(this.classes.hidden);
            }
          });

          this.filterDrawerTriggers.forEach((trigger) => {
            trigger.innerHTML = newFilterDrawerTrigger.innerHTML;
          });
        }

        this.resultGrid.innerHTML = newresultGrid.innerHTML;
        this.resultGrid.classList = newresultGrid.classList;
        this.pagination.innerHTML = newPagination.innerHTML;
        this.updateSortDropdowns(event.detail.sortBy);
        this.classList.remove(this.classes.loading);

        const filterRepaintEvent = new CustomEvent(FILTER_REPAINT, {
          detail: { newDocument: doc },
        });

        this.filterSortFormComponent.dispatchEvent(filterRepaintEvent);
      });
  }

  updateURLHash(searchParams) {
    history.pushState(
      { searchParams },
      "",
      `${window.location.pathname}${searchParams && "?".concat(searchParams)}`,
    );
  }

  initSortDropdowns() {
    this.sortDropdowns.forEach((dropdown) => {
      const inputs = dropdown.querySelectorAll("input");

      // Add a change listener to each input so that we can emit an event with the change
      inputs.forEach((input) => {
        input.addEventListener(
          "click",
          this.handleSortOptionClick.bind(this),
          this.eventOptions,
        );

        input.addEventListener(
          "keydown",
          this.handleSortOptionKeydown.bind(this),
          this.eventOptions,
        );
      });
    });
  }

  updateSortDropdowns(sortBy) {
    this.dataset.currentSort = sortBy;

    this.sortDropdowns.forEach((dropdown) => {
      const newSelectedInput = dropdown.querySelector(
        `input[value="${sortBy}"]`,
      );
      newSelectedInput.checked = true;
    });
  }

  handleSortOptionKeydown(event) {
    event.preventDefault();

    const inputs = event.currentTarget
      .closest(this.selectors.sortDropdowns)
      .querySelectorAll("input");
    let currentInputIndex;

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] === event.target) {
        currentInputIndex = i;
        break
      }
    }

    switch (event.key) {
      case "ArrowUp": {
        let previousInputIndex = currentInputIndex - 1;

        // If the current input is the first, then the "previous" should be the last
        if (previousInputIndex < 0) {
          previousInputIndex = inputs.length - 1;
        }

        inputs[previousInputIndex].checked = true;
        inputs[previousInputIndex].focus();
        break
      }

      case "ArrowDown": {
        let nextInputIndex = currentInputIndex + 1;

        // If the current input is the first, then the "previous" should be the last
        if (nextInputIndex === inputs.length) {
          nextInputIndex = 0;
        }

        inputs[nextInputIndex].checked = true;
        inputs[nextInputIndex].focus();
        break
      }

      case " ": {
        if (event.target.value === this.dataset.currentSort) {
          this.closeSortDropdown(
            event.target.closest(this.selectors.sortDropdowns),
          );
        } else {
          this.applySortChange(
            event.target.value,
            event.target.dataset.label,
            event.target.closest(this.selectors.sortDropdowns),
          );
        }
      }
    }
  }

  handleSortOptionClick(event) {
    if (event.target.value !== this.dataset.currentSort) {
      this.applySortChange(
        event.target.value,
        event.target.dataset.label,
        event.target.closest(this.selectors.sortDropdowns),
      );
    }
  }

  applySortChange(sortBy, label, parentDropdown) {
    const sortChangedEvent = new CustomEvent(SORT_CHANGED, {
      detail: { sortBy },
    });

    this.filterSortFormComponent.dispatchEvent(sortChangedEvent);
    this.sortTriggerValue.innerText = label;
    this.closeSortDropdown(parentDropdown);
  }

  closeSortDropdown(dropdown) {
    const disclosureWrapper = dropdown.closest(this.selectors.disclosureWrapper);

    if (disclosureWrapper) {
      disclosureWrapper.removeAttribute("open");
    } else {
      this.closeSortDrawer();
    }
  }

  handleWindowResize() {
    // If we're above small-desktop, connect an observer to show/hide the sticky
    // filter/sort button when the top bar or footer are in view.
    // Otherwise, connect a mobile-specific observer for when the footer or
    // banner are in view.
    if (window.matchMedia(this.breakpoints.smallDesktop).matches) {
      this.hideStickyFilterSort();
      this.mobileFooterObserver.disconnect();
      this.mobileTopBarObserver.disconnect();

      if (this.dataset.stickyFilterSortEnabled === "true") {
        this.footerObserver.observe(this.siteFooter);
      }
    } else {
      this.hideStickyFilterSort();

      if (this.dataset.stickyFilterSortEnabled === "true") {
        this.footerObserver.disconnect();
        this.topBarObserver.disconnect();
      }

      this.mobileFooterObserver.observe(this.siteFooter);
    }
  }

  openSortDrawer() {
    this.hideStickyFilterSort();

    // Delay to allow sticky filter/sort button to animate out.
    setTimeout(() => {
      window.dispatchEvent(this.events.openSortDrawer);
    }, 240);
  }

  closeSortDrawer() {
    window.dispatchEvent(this.events.closeSortDrawer);
  }

  hideStickyFilterSort() {
    this.stickyFilterSort?.classList.remove(this.classes.active);
  }

  showStickyFilterSort() {
    this.stickyFilterSort?.classList.add(this.classes.active);
  }

  getHeaderAnnouncementHeight() {
    if (this.header.dataset.enableStickyHeader === "true") {
      this.headerHeight = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--header-height")
          .replace("px", ""),
        10,
      );
    }

    if (
      this.announcementBar &&
      this.announcementBar.hasAttribute("data-sticky")
    ) {
      this.announcementHeight = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--announcement-height")
          .replace("px", ""),
        10,
      );
    }
  }

  handleHeaderHeightChange(event) {
    if (this.header.dataset.enableStickyHeader === "true") {
      this.headerHeight = event.detail.height;
      this.mobileFooterObserver.disconnect();
      this.mobileTopBarObserver.disconnect();
      this.footerObserver?.disconnect();
      this.topBarObserver?.disconnect();
      this.initStickyFilterSortButton();
    }
  }

  handleAnnouncementHeightChange(event) {
    if (
      this.announcementBar &&
      this.announcementBar.hasAttribute("data-sticky")
    ) {
      this.announcementHeight = event.detail.height;
      this.mobileFooterObserver.disconnect();
      this.mobileTopBarObserver.disconnect();
      this.footerObserver?.disconnect();
      this.topBarObserver?.disconnect();
      this.initStickyFilterSortButton();
    }
  }

  disconnectedCallback() {
    this.controller.abort();
    this.documentObserver.disconnect();
    this.mobileFooterObserver.disconnect();
    this.mobileTopBarObserver.disconnect();
    this.footerObserver?.disconnect();
    this.topBarObserver?.disconnect();
    atBreakpointChange.unload();
  }
}

if (!customElements.get("search-result-grid")) {
  customElements.define("search-result-grid", SearchResultGrid);
}

// Page transitions
pageTransition();

// a11y tab handler
handleTab();

// widthWatch breakpoint emmiter
widthWatcher();

// Initialize modals
document
  .querySelectorAll("dialog[data-fluco-dialog]")
  .forEach((el) => dialog(el));

// Maintain a local representation of the cart so it's accessible to JS
get().then((cartData) => {
  window.theme.cartData = cartData;
});

document.addEventListener(EVENTS.CART_CHANGED, (event) => {
  window.theme.cartData = event.detail.cart;
});

document.addEventListener(EVENTS.CART_ITEM_ADDED, () => {
  if (window.flu.cartType === "drawer") {
    window.dispatchEvent(new Event(EVENTS.CART_DRAWER_OPEN));
  } else {
    window.location = window.theme.routes.cart.base;
  }
});

// Make it easy to see exactly what theme version
// this is by commit SHA
window.SHA = "a69e1ecbe1";

if (
  !sessionStorage.getItem("flu_stat_recorded") &&
  !window.Shopify?.designMode
) {
  // eslint-disable-next-line no-process-env
  fetch("https://stats.fluorescent.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...window.theme.coreData,
      s: window.Shopify?.shop,
      r: window.Shopify?.theme?.role,
    }),
  });

  if (window.sessionStorage) {
    sessionStorage.setItem("flu_stat_recorded", "true");
  }
}

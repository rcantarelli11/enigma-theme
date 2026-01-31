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

export { dialog as d };

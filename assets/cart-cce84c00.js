import { E as EVENTS } from './events-58bc9098.js';

const routes = window.theme.routes.cart || {};

const paths = {
  base: `${routes.base || "/cart"}.js`,
  add: `${routes.add || "/cart/add"}.js`,
  change: `${routes.change || "/cart/change"}.js`,
  update: `${routes.update || "/cart/update"}.js`,
};

const actions = {
  addItem: "add_item",
  removeItem: "remove_item",
  changeItemQuantity: "change_item_quantity",
  noteChange: "note_change",
};

const contexts = {
  productPage: "product_page",
  productItem: "product_item",
  cartDrawer: "cart_drawer",
  crossSells: "cross_sells",
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

/**
 * Adds a single item to the cart, based on an HTML product form.
 *
 * @param {HTMLElement} form - The HTML form being submitted.
 * @param {string} [context] - The area of the theme that is adding the item. Should be one of contexts.
 * @param {HTMLElement} target - The parent element that's trying to add the item.
 */
function addItemByForm(form, context, target) {
  const formData = new FormData(form);

  return fetch(paths.add, {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then(async (data) => {
      if (data.status === 422) {
        const errorContent = {
          errors: data.errors,
          message: data.message,
          description: data.description,
        };

        _handleError(errorContent, actions.addItem, {
          context,
          target,
        });
      } else {
        // For some reason the add endpoint only returns the added item,
        // not the whole cart like other endpoints. We can fetch the cart and
        // insert items_added
        const cartData = await get();
        const combinedCartData = {
          ...cartData,
          items_added: data.items,
        };

        _emitEvent(actions.addItem, combinedCartData, {
          context,
          target,
        });
      }
    })
}

/**
 * Adds a given quantity of a given variant to the cart.
 *
 * @param {number} variantId - The variant ID of the variant to be added to the cart.
 * @param {number} quantity - The quanity to be added.
 * @param {string} [context] - The context where the change happened, one of contexts.
 * @param {HTMLElement} [target] - The parent element that's trying to add the item.
 */
function addItemById(variantId, quantity, context, target) {
  const fetchData = {
    items: [
      {
        id: variantId,
        quantity,
      },
    ],
  };

  return fetch(paths.add, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fetchData),
  })
    .then((response) => response.json())
    .then(async (data) => {
      // TODO: what about other errors? (Shopify platform errors?)
      if (data.status === 422) {
        _handleError(data.description, actions.addItem, {
          context,
          target,
          itemKeyOrId: variantId,
        });
      } else {
        // For some reason the add endpoint only returns the added item,
        // not the whole cart like other endpoints. We can fetch the cart and
        // insert items_added
        const cartData = await get();
        const combinedCartData = {
          ...cartData,
          items_added: data.items,
        };

        _emitEvent(actions.addItem, combinedCartData, {
          context,
          target,
        });
      }
    })
}

/**
 * Updates the quantity of a given cart item.
 *
 * @param {HTMLElement} target - The parent element that's trying to change the item.
 * @param {string|number} id - The item's variant ID or line item key.
 * @param {number} quantity - The new quantity for the item.
 * @param {string} context - The context where the change happened, one of contexts
 */
function changeItemQuantity(target, id, quantity, context) {
  const fetchData = {
    id,
    quantity,
  };

  return fetch(paths.change, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fetchData),
  })
    .then((response) => response.json())
    .then((data) => {
      // TODO: what about other errors? (Shopify platform errors?)
      if (data.status === 422) {
        _handleError(data.description, actions.changeItemQuantity, {
          context,
          target,
          itemKeyOrId: id,
        });
      } else {
        _emitEvent(actions.changeItemQuantity, data, {
          context,
          target,
        });
      }
    })
}
/**
 * Updates the cart note
 *
 * @param {HTMLElement} target - The parent element that's trying to update the note.
 * @param {string} note - The cart note.

 */
function updateNote(target, note) {
  const fetchData = {
    note,
  };
  return fetch(paths.update, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fetchData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.note) {
        // throw new Error("Error updating cart note")
        _handleError(data.description, actions.noteChange, {
          context: null,
          target,
        });
      } else {
        _emitEvent(actions.noteChange, data);
      }
    })
}

/**
 * Emits events based on the source action and optional context.
 *
 * @param {string} action - The action made. Should be one of actions.
 * @param {Object} cartData - The cart object that reflects the action's change.
 * @param {Object} [options] - The options object.
 * @param {HTMLElement} [options.target] - The element to emit the event onto. Defaults to the document.
 * @param {HTMLElement} [options.context] - The context that originated the action. Should be one of contexts.
 */
function _emitEvent(action, cartData, options = {}) {
  const target = options.target || document;

  const eventOptions = {
    detail: {
      cartData,
    },
    bubbles: true,
  };

  if (action === actions.addItem) {
    // We need this general "Cart item added" event to open the cart drawer, however
    // we want to delay that until after success display has shown
    setTimeout(() => {
      target.dispatchEvent(
        new CustomEvent(EVENTS.CART_ITEM_ADDED, eventOptions),
      );
    }, 1000);

    // If the event originated at the product item, trigger a quick add success as well
    if (options.context === contexts.productItem) {
      target.dispatchEvent(
        new CustomEvent(EVENTS.QUICK_ADD_SUCCESS, eventOptions),
      );
    } else if (options.context === contexts.productPage) {
      target.dispatchEvent(
        new CustomEvent(EVENTS.PRODUCT_ADD_SUCCESS, eventOptions),
      );
    }
  } else if (action === actions.removeItem) {
    target.dispatchEvent(
      new CustomEvent(EVENTS.CART_ITEM_REMOVED, eventOptions),
    );
  } else if (action === actions.changeItemQuantity) {
    target.dispatchEvent(
      new CustomEvent(EVENTS.CART_ITEM_CHANGED, eventOptions),
    );
  } else if (action === actions.noteChange) {
    target.dispatchEvent(
      new CustomEvent(EVENTS.CART_NOTE_CHANGED, eventOptions),
    );
  }

  // Trigger a general cart change event on the document
  document.dispatchEvent(new CustomEvent(EVENTS.CART_CHANGED, eventOptions));
}

/**
 * Handles emitting error events for given a cart function.
 *
 * @param {string} errorMessage - The error message.
 * @param {string} source - The name of the cart function that triggered the error.
 * @param {HTMLElement} target - The parent element that called the above cart function.
 * @param {string|number} [itemKeyOrId] - The key or ID of the item being referenced.
 */
function _handleError(errorMessage, action, options = {}) {
  switch (action) {
    case actions.addItem: {
      if (options.context === contexts.productPage) {
        options.target.dispatchEvent(
          new CustomEvent(EVENTS.PRODUCT_ADD_ERROR, {
            detail: {
              errorMessage,
            },
          }),
        );
      } else if (options.context === contexts.productItem) {
        options.target.dispatchEvent(
          new CustomEvent(EVENTS.QUICK_ADD_ERROR, {
            detail: {
              cartItemKeyOrId: options.itemKeyOrId,
              errorMessage,
            },
          }),
        );
      }

      break
    }

    case actions.changeItemQuantity: {
      options.target.dispatchEvent(
        new CustomEvent(EVENTS.CART_ITEM_CHANGE_ERROR, {
          detail: {
            cartItemKeyOrId: options.itemKeyOrId,
            errorMessage,
          },
        }),
      );
      break
    }

    case actions.noteChange: {
      options.target.dispatchEvent(
        new CustomEvent(EVENTS.CART_NOTE_CHANGED_ERROR, {
          detail: {
            errorMessage,
          },
        }),
      );
      break
    }
  }

  document.dispatchEvent(
    new CustomEvent(EVENTS.CART_ERROR, {
      detail: { errorMessage },
    }),
  );
}

export { contexts as a, addItemByForm as b, changeItemQuantity as c, addItemById as d, updateNote as u };

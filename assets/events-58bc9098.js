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

export { EVENTS as E };

import { E as EVENTS } from './events-58bc9098.js';

class ShoppableFeed extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      drawerMedia: "[js-shoppable-feed-drawer-media]",
      drawerTrigger: "[js-shoppable-feed-drawer-trigger]",
      drawerViewport: "[js-drawer-viewport]",
      products: "[js-shoppable-feed-products]",
      productGroup: "[js-shoppable-feed-product-group]",
      productsTemplate: "[js-shoppable-feed-products-template]",
      verticalScrollPillWrapper: "[js-shoppable-feed-scroll-pill-wrapper]",
      drawerBlock: "[js-drawer-block]",
      drawerCurrentSlideIndex: "[js-drawer-current-slide-index]",
    };

    this.classes = {
      active: "active",
      showScrollForMore: "show-scroll-for-more",
      drawerClosing: "modal--trigger-close-animation",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.eventOptions = { signal: this.controller.signal };
    this.sectionId = this.dataset.sectionId;
    this.drawerId = `shoppable-feed-drawer-${this.sectionId}`;
    this.drawerSliderId = `shoppable-feed-drawer-slider-${this.sectionId}`;
    this.drawerMedia = this.querySelector(this.selectors.drawerMedia);
    this.drawerTriggers = this.querySelectorAll(this.selectors.drawerTrigger);
    this.drawerViewport = this.querySelector(this.selectors.drawerViewport);
    this.lastClickedDrawerTriggerIndex = null;
    this.drawerHasBeenOpened = false;
    this.drawerSliderInitialized = false;
    this.products = this.querySelector(this.selectors.products);
    this.events = {
      openDrawer: new CustomEvent(EVENTS.MODAL_POPUP_OPEN(this.drawerId)),
      initSliderForDrawer: new CustomEvent(
        EVENTS.SCROLL_SLIDER_INIT(this.drawerSliderId),
        {
          detail: {
            source: "drawer",
          },
        },
      ),
    };

    // Open the drawer on item button click
    this.drawerTriggers.forEach((trigger) => {
      trigger.addEventListener(
        "click",
        this.handleDrawerTriggerClick.bind(this),
        this.eventOptions,
      );
    });

    // Update drawer contents when slide changes
    document.addEventListener(
      EVENTS.SCROLL_SLIDER_CHANGED(this.drawerSliderId),
      this.handleDrawerSliderChange.bind(this),
      this.eventOptions,
    );

    // Wait for slider to be initialized before trying to "go to" a slide
    // when opening the drawer
    document.addEventListener(
      EVENTS.SCROLL_SLIDER_INITIALIZED(this.drawerSliderId),
      this.handleDrawerSliderInit.bind(this),
      this.eventOptions,
    );

    // Re-initialize the slider on window resize
    //
    // Normally, this is handled with the slider (when the slider is resized), but
    // we opt for a manual approach with this section to help with the slider being
    // inside a drawer and needing to make updates
    document.addEventListener(
      EVENTS.WINDOW_WIDTH_CHANGED,
      () => document.dispatchEvent(this.events.initSliderForDrawer),
      this.eventOptions,
    );

    // When the drawer closes, reset the scroll position to the top
    window.addEventListener(
      EVENTS.MODAL_POPUP_CLOSING(this.drawerId),
      this.handleDrawerClose.bind(this),
      this.eventOptions,
    );
  }

  handleProductsBeyondView() {
    // This should only run once per drawer open
    this.productContainerObserver.disconnect();

    this.verticalScrollPillWrapper = this.drawerMedia.querySelector(
      this.selectors.verticalScrollPillWrapper,
    );
    this.verticalScrollPillWrapper.classList.add(this.classes.showScrollForMore);
    this.verticalScrollPillWrapper.classList.add(this.classes.active);

    setTimeout(() => {
      this.verticalScrollPillWrapper.classList.remove(this.classes.active);
    }, 4000);
  }

  handleDrawerTriggerClick(event) {
    event.preventDefault();

    if (!this.drawerHasBeenOpened) {
      const productsTemplate = this.querySelector(
        this.selectors.productsTemplate,
      );

      this.drawerHasBeenOpened = true;
      this.productGroups = productsTemplate.content
        .cloneNode(true)
        .querySelectorAll(this.selectors.productGroup);
    }

    this.lastClickedDrawerTriggerIndex = event.currentTarget.dataset.blockIndex;
    window.dispatchEvent(this.events.openDrawer);
    document.dispatchEvent(this.events.initSliderForDrawer);

    this.productContainerObserver = new IntersectionObserver(
      ([{ isIntersecting: visible }]) => {
        if (!visible) {
          this.handleProductsBeyondView();
        }
      },
      {
        root: this.drawerViewport,
        rootMargin: "-100px",
      },
    );

    this.productContainerObserver.observe(this.products);
  }

  // Update the mobile slide count display
  setSlideIndex(currentSlideIndex) {
    this.currentSlideIndexItem = this.drawerViewport.querySelector(
      this.selectors.drawerCurrentSlideIndex,
    );

    this.currentSlideIndexItem.textContent = currentSlideIndex;
  }

  handleDrawerSliderInit(event) {
    if (event.detail.source && event.detail.source === "drawer") {
      document.dispatchEvent(
        new CustomEvent(EVENTS.SCROLL_SLIDER_GO_TO_SLIDE(this.drawerSliderId), {
          detail: {
            slideIndex: this.lastClickedDrawerTriggerIndex - 1,
            behavior: "instant",
          },
        }),
      );
    }
  }

  handleDrawerSliderChange(event) {
    const currentSlide = event.detail.currentElement;
    const currentIndex = currentSlide.dataset.blockIndex;

    let currentProductGroup = Array.from(this.productGroups).find((group) => {
      return group.dataset.blockIndex === currentIndex
    });

    this.setSlideIndex(currentIndex);

    currentProductGroup = currentProductGroup.cloneNode(true);
    this.products.replaceChildren(currentProductGroup);

    // Slight delay so that the items can be present before we try to animate them
    setTimeout(() => {
      currentProductGroup.classList.add(this.classes.active);
    }, 150);
  }

  handleDrawerClose() {
    this.drawerViewport.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  disconnectedCallback() {
    this.controller.abort();
    this.drawerObserver.disconnect();
  }
}

if (!customElements.get("shoppable-feed")) {
  customElements.define("shoppable-feed", ShoppableFeed);
}

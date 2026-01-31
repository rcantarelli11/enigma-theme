import { E as EVENTS } from './events-58bc9098.js';

const { SHOPIFY_BLOCK_SELECT } = EVENTS;

class FeaturedLinks extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      link: "[js-featured-links-link]",
      linkByBlockId: (id) => `${this.selectors.link}[data-block-id="${id}"]`,
      image: "[js-featured-links-image]",
      parentSection: ".shopify-section",
    };

    this.classes = {
      current: "current",
      animateOut: "animate-out",
      animateIn: "animate-in",
      animateBack: "animate-back",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();
    this.linkImagePairs = {};
    this.currentIndex = "0";

    const eventOptions = { signal: this.controller.signal };
    const links = this.querySelectorAll(this.selectors.link);
    const images = this.querySelectorAll(this.selectors.image);

    // Build an object to hold link/image pairs for a given index
    images.forEach((image) => {
      const index = image.dataset.index;
      const link = Array.from(links).find((link) => {
        return link.dataset.index === index
      });

      this.linkImagePairs[index] = {
        image,
        link,
      };

      if (link) {
        link.addEventListener(
          "mouseover",
          this.handleMouseover.bind(this),
          eventOptions,
        );
      }
    });

    // Block events
    if (window.Shopify.designMode) {
      this.parentSection = this.closest(this.selectors.parentSection);
      this.parentSection.addEventListener(
        SHOPIFY_BLOCK_SELECT,
        this.handleBlockSelect.bind(this),
        eventOptions,
      );
    }
  }

  handleMouseover(event) {
    if (event.target.dataset.index === this.currentIndex) return

    const animatingOutIndex = this.currentIndex;
    const animatingInIndex = event.target.dataset.index;

    this.currentIndex = animatingInIndex;
    this.updateImage(animatingOutIndex, animatingInIndex);
  }

  updateImage(animatingOutIndex, animatingInIndex) {
    this.animate(animatingOutIndex, this.classes.animateOut);

    // The animation is different depending on whether the index of the
    // new link is higher or lower than the current index.
    if (animatingInIndex < animatingOutIndex) {
      this.animate(animatingInIndex, this.classes.animateBack);
    } else {
      this.animate(animatingInIndex, this.classes.animateIn);
    }
  }

  animate(index, animationClass) {
    const image = this.linkImagePairs[index].image;

    if (!image) return

    image.addEventListener(
      "animationend",
      () => {
        image.classList.remove(animationClass);

        if (animationClass === this.classes.animateOut) {
          image.classList.remove(this.classes.current);
        } else {
          image.classList.add(this.classes.current);
        }
      },
      {
        signal: this.controller.signal,
      },
    );

    image.classList.add(animationClass);
  }

  handleBlockSelect(event) {
    const selectedLink = this.querySelector(
      this.selectors.linkByBlockId(event.detail.blockId),
    );

    if (selectedLink.dataset.index === this.currentIndex) return

    const animatingOutIndex = this.currentIndex;
    const animatingInIndex = selectedLink.dataset.featuredLink;

    this.updateImage(animatingOutIndex, animatingInIndex);
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("featured-links")) {
  customElements.define("featured-links", FeaturedLinks);
}

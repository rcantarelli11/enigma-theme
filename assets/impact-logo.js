import { s as srraf } from './srraf.es-487187f3.js';
import { d as debounce$1 } from './debounce-f0994045.js';

const debounce = debounce$1();

class ImpactLogo extends HTMLElement {
  constructor() {
    super();

    this.image = this.querySelector(".image");
    this.container = this.querySelector(".impact-logo__image-container");
    this.isOverlay = this.dataset.impactLogoLayout === "overlay";

    this.attrs = {
      opacityOnScroll: "js-opacity-on-scroll",
      parallaxOnScroll: "js-parallax-on-scroll",
      fadeTopOnScroll: "js-fade-top-on-scroll",
      fadeBottomOnScroll: "js-fade-bottom-on-scroll",
    };

    this.classes = {
      fadeTop: "fade-top",
      fadeBottom: "fade-bottom",
    };

    // Parameters to control the strength of the scrolling effects
    // TODO these should be locked down during Design Review
    this.parallaxRate = 0.1;
    this.bottomFadeParallaxRate = 0.3;

    if (this.hasAttribute(this.attrs.fadeTopOnScroll)) {
      this.container.classList.add(this.classes.fadeTop);
    }

    if (this.hasAttribute(this.attrs.fadeBottomOnScroll)) {
      this.container.classList.add(this.classes.fadeBottom);
    }

    if (this.isOverlay) {
      this.impactAwareStyle = document.createElement("style");
      this.insertAdjacentElement("afterend", this.impactAwareStyle);
      this.setHeroSectionStyle();
    }
  }

  get box() {
    return this.image.getBoundingClientRect()
  }

  connectedCallback() {
    const { top, height } = this.box;
    const boxBottom = top + height + window.scrollY;
    this.computeScrollAnimation(window.scrollY, boxBottom);

    this.watcher = srraf((data) => {
      if (data.vw !== data.pvw) {
        debounce(() => {
          this.setHeroSectionStyle();
        });
      }

      if (data.y > boxBottom) return
      this.computeScrollAnimation(data.y, boxBottom);
    });
  }

  disconnectedCallback() {
    this.watcher?.destroy();
  }

  computeScrollAnimation(scrollY, boxBottom) {
    // Full Fade Animation
    if (this.hasAttribute(this.attrs.opacityOnScroll)) {
      if (scrollY <= boxBottom) {
        // as scrollY increases to boxBottom, the opacity should
        // decrease from 1 to 0

        this.style.setProperty("--impact-logo-opacity", 1 - scrollY / boxBottom);
      }
    }

    // Parallax Animation
    if (this.hasAttribute(this.attrs.parallaxOnScroll)) {
      if (scrollY <= boxBottom) {
        // scrollY: current scroll position
        //
        // as scrollY increases, to boxBottom, the variable value should
        // decrease from 0 to -100%

        const value = (scrollY / boxBottom) * 100 * this.parallaxRate * -1;

        this.image.style.setProperty("--impact-logo-parallax", `${value}%`);
      }
    }

    // Top to Bottom Fade Animation
    if (this.hasAttribute(this.attrs.fadeTopOnScroll)) {
      if (scrollY <= boxBottom) {
        this.style.setProperty("--impact-logo-fade-top-start", `${scrollY}px`);
      }
    }

    // Bottom to Top Fade Animation
    if (this.hasAttribute(this.attrs.fadeBottomOnScroll)) {
      if (scrollY <= boxBottom) {
        const start = this.box.height;
        const value = start - scrollY * this.bottomFadeParallaxRate;

        this.style.setProperty("--impact-logo-fade-bottom-start", `${value}px`);
      }
    }
  }

  // To make any hero section aware of the impact logo height this adds a style
  // tag to the dom, below the impact logo which redeclares the global
  // `--impact-logo-height: 0;` as as the height of the impact logo for the hero
  // only.
  setHeroSectionStyle() {
    if (!this.isOverlay) return

    this.impactAwareStyle.innerHTML = `
      .impact-logo ~ main .shopify-section:first-of-type {
        --impact-logo-height: ${this.box.height}px;
      }
    `;
  }
}

if (!customElements.get("impact-logo")) {
  customElements.define("impact-logo", ImpactLogo);
}

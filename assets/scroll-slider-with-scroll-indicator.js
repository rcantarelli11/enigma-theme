// This will monitor a scroll-slider and update an adjacent scroll-indicator
// This component should contain a scroll slider as well as a scroll indicator
// eg:

// <scroll-slider-with-scroll-indicator>
//   {%- render 'scroll-slider',
//     slider_items: items,
//   -%}
//   {% render 'scroll-indicator', item_count: item_count %}
// </scroll-slider-with-scroll-indicator>
class ScrollSliderWithScrollIndicator extends HTMLElement {
  constructor() {
    super();

    this.selectors = {
      scroller: ".scroll-slider__slider",
      indicatorCursor: ".scroll-indicator__cursor",
    };
  }

  connectedCallback() {
    this.controller = new AbortController();

    this.scroller = this.querySelector(this.selectors.scroller);
    this.indicatorCursor = this.querySelector(this.selectors.indicatorCursor);

    this.scroller.addEventListener("scroll", this.#handleScroll.bind(this), {
      signal: this.controller.signal,
    });
  }

  #handleScroll() {
    const percentageScrolled = (
      this.scroller.scrollLeft /
      (this.scroller.scrollWidth - this.scroller.clientWidth)
    ).toFixed(2);

    if (percentageScrolled !== this.lastPercentageScrolled) {
      this.#updateIndicator(percentageScrolled);
      this.lastPercentageScrolled = percentageScrolled;
    }
  }

  #updateIndicator(percentageScrolled) {
    this.indicatorCursor.style.setProperty("--percentage", percentageScrolled);
    this.indicatorCursor.style.left = `${percentageScrolled * 100}%`;
  }

  disconnectedCallback() {
    this.controller.abort();
  }
}

if (!customElements.get("scroll-slider-with-scroll-indicator")) {
  customElements.define(
    "scroll-slider-with-scroll-indicator",
    ScrollSliderWithScrollIndicator,
  );
}

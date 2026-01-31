class ScrollingContent extends HTMLElement {
  constructor() {
    super();

    this.prefersReducedMotion = document.documentElement.classList.contains(
      "prefers-reduced-motion",
    );
  }

  connectedCallback() {
    if (this.prefersReducedMotion) return

    const marquee = this.querySelector("[js-marquee]");
    const content = this.querySelector("[js-marquee-content]");
    const clonedContent = this.tabProofClonedContent(content.cloneNode(true));
    const contentWidth = content.offsetWidth;

    if (contentWidth === 0) return

    this.ro = new ResizeObserver(() => {
      const num = this.getNeededCloneCount(this, marquee, content);

      for (let i = 0; i < num; i++) {
        marquee.dataset.playScrollAnimation = "false";
        marquee.appendChild(clonedContent.cloneNode(true));
      }

      requestAnimationFrame(() => {
        marquee.dataset.playScrollAnimation = "true";
      });
    });

    this.ro.observe(document.documentElement);
  }

  disconnectedCallback() {
    this.ro?.disconnect();
  }

  /**
   * Checks to see if more content clones are needed in order to keep the scroll animation seamless.
   * @param {HTMLElement} viewport - The resized element acting as the viewport
   * @param {HTMLElement} marquee - The element that must be wider than the viewport
   * @param {HTMLElement} content - The element to be repeated
   * @returns {Number} The number of content clones needed to fill the new viewport
   */
  getNeededCloneCount(viewport, marquee, content) {
    const writingMode = viewport.dataset.writingMode;
    const viewportWidth =
      writingMode === "horizontal"
        ? viewport.offsetWidth
        : viewport.offsetHeight;
    const marqueeWidth =
      writingMode === "horizontal" ? marquee.offsetWidth : marquee.offsetHeight;
    const contentWidth =
      writingMode === "horizontal" ? content.offsetWidth : content.offsetHeight;

    return Math.ceil((viewportWidth - marqueeWidth) / contentWidth) + 1
  }

  /**
   * Ensures that:
   * - Any cloned links are not tabbable
   * - Any cloned content has aria-hidden applied
   * @param {HTMLElement} clonedContent - The cloned content
   * @returns {HTMLElement} The accessible cloned content
   */
  tabProofClonedContent(clonedContent) {
    const linkEls = clonedContent.querySelectorAll("a");

    linkEls.forEach((linkEl) => {
      linkEl.setAttribute("tabindex", "-1");
    });

    clonedContent.setAttribute("aria-hidden", true);
    return clonedContent
  }
}

if (!customElements.get("scrolling-content")) {
  customElements.define("scrolling-content", ScrollingContent);
}

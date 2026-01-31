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

class AnnouncementSlider extends HTMLElement {
  static observedAttributes = ["data-autoplay", "data-active-block-id"]

  connectedCallback() {
    this.slider = this.querySelector("[js-slider]");
    this.sliderItemsArray = Array.from(this.slider.children);
    this.sliderItemsCount = Array.from(this.slider.children).length;

    const { autoplay, autoplayDelay } = this.dataset;

    this.autoplayDelay = parseInt(autoplayDelay, 10);
    this.shouldAutoplay = autoplay === "true";

    if (this.shouldAutoplay) {
      this.autoplay = new PauseableInterval(
        this.showNextSlide.bind(this),
        this.autoplayDelay,
      );
    }

    this.prevButton = this.querySelector("[js-prev-button]");
    this.nextButton = this.querySelector("[js-next-button]");

    this.eventController = new AbortController();
    const eventOptions = {
      signal: this.eventController.signal,
    };

    this.prevButton.addEventListener(
      "click",
      () => this.showPrevSlide(),
      eventOptions,
    );
    this.nextButton.addEventListener(
      "click",
      () => this.showNextSlide(),
      eventOptions,
    );

    if (this.shouldAutoplay) {
      this.addEventListener(
        "mouseenter",
        () => this.autoplay.pause(),
        eventOptions,
      );
      this.addEventListener(
        "mouseleave",
        () => this.autoplay.reset(),
        eventOptions,
      );
      this.addEventListener(
        "focusin",
        () => this.autoplay.pause(),
        eventOptions,
      );
      this.addEventListener(
        "focusout",
        () => this.autoplay.reset(),
        eventOptions,
      );
    }

    this.setActiveSlide(0, null, "up");
  }

  disconnectedCallback() {
    this.eventController.abort();
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    // when a block is selected, autoplay is paused, and the selected block is shown
    switch (name) {
      case "data-autoplay":
        newValue === "true" ? this.autoplay?.reset() : this.autoplay?.pause();
        break

      case "data-active-block-id":
        if (!newValue) break
        this.showBlockSlide(newValue);
    }
  }

  /** Shows the previous slide. Always loops. */
  showPrevSlide() {
    const activeSlideIndex = this.getActiveSlideIndex();
    const prevSlideIndex =
      activeSlideIndex > 0 ? activeSlideIndex - 1 : this.sliderItemsCount - 1;

    this.setActiveSlide(prevSlideIndex, activeSlideIndex, "down");
  }

  /** Shows the next slide. Always loops. */
  showNextSlide() {
    const activeSlideIndex = this.getActiveSlideIndex();
    const nextSlideIndex =
      activeSlideIndex < this.sliderItemsCount - 1 ? activeSlideIndex + 1 : 0;

    this.setActiveSlide(nextSlideIndex, activeSlideIndex, "up");
  }

  /**
   * Shows the slide corresponding with the block ID. Used for the theme editor.
   * @param {String} blockId - The block ID for the selected block.
   */
  showBlockSlide(blockId) {
    const activeSlideIndex = this.getActiveSlideIndex();
    const blockSlideIndex = this.sliderItemsArray.findIndex((element) =>
      element.dataset.shopifyEditorBlock.includes(blockId),
    );

    this.setActiveSlide(blockSlideIndex, activeSlideIndex, "up");
  }

  /**
   * Gets the active slide index.
   * @returns {Number} The index of the currently active slide.
   */
  getActiveSlideIndex() {
    return parseInt(this.slider.dataset.activeSlideIndex, 10)
  }

  /**
   * Changes the active slide, while ensuring the animation plays in the correct direction.
   * @param {Number} activeIndex - The updated index for the active slide.
   * @param {Number} lastIndex - The index of the most recently deactivated slide.
   * @param {String} direction - The direction of the translation animation. Can be "up" or "down".
   */
  setActiveSlide(activeIndex, lastIndex, direction) {
    this.slider.dataset.activeSlideIndex = activeIndex;
    this.slider.dataset.slideDirection = direction;

    this.sliderItemsArray.forEach((element, index) => {
      element.toggleAttribute("inert", index !== activeIndex);

      index === activeIndex
        ? (element.dataset.slideActive = "true")
        : (element.dataset.slideActive = "false");

      index === lastIndex
        ? (element.dataset.slideOutgoing = "true")
        : (element.dataset.slideOutgoing = "false");
    });
  }
}

if (!customElements.get("announcement-slider")) {
  customElements.define("announcement-slider", AnnouncementSlider);
}

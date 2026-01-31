import { E as EVENTS } from './events-58bc9098.js';

class ScrollSlider extends HTMLElement {
  constructor() {
    super();

    this.strings = window.theme.strings;

    this.selectors = {
      slider: ".scroll-slider__slider",
      slide: ".scroll-slider__slider > *",
      pageDots: "[data-scroll-slider-page-dots]",
      pageDotsInner: "[data-scroll-slider-page-dots-inner]",
      dot: "[data-scroll-slider-page-dot]",
      prevButton: "[js-scroll-slider-prev-button]",
      nextButton: "[js-scroll-slider-next-button]",
      counterWrapper: ".scroll-slider__counter",
      currentCounter: ".scroll-slider__counter--current",
      totalCounter: ".scroll-slider__counter--total",
      mobileLoopButton: ".scroll-slider__mobile-loop-nav",
    };

    this.classes = {
      dotActive: "active",
      hidden: "hidden",
    };
  }

  connectedCallback() {
    this.slider = this.querySelector(this.selectors.slider);

    const sliderParent = this.parentElement;
    this.hasBorderedGrid = sliderParent.dataset.gridStyle === "bordered_grid";

    this.initialized = false;
    this.controller = new AbortController();
    this.sliderItems = this.querySelectorAll(this.selectors.slide);
    if (!this.sliderItems.length) return

    this.slideCount = this.sliderItems.length;
    this.slider.dataset.slideCount = this.slideCount;

    // TODO: update vars to show they return string values,
    // ex. const { loopBackToStart: loopBackToStartString },
    // then this.loopBackToStart = loopBackToStartString === "true"
    const {
      id,
      navigationContainer,
      autoplay,
      autoplayDelay,
      autoplayPauseOnHover,
      isSlideshow,
      loopBackToStart,
      loopBackToStartMobile,
    } = this.dataset;

    this.id = id;
    this.isSlideshow = isSlideshow === "true";
    this.autoplayDelay = parseInt(autoplayDelay, 10);
    this.shouldAutoplay = autoplay === "true";
    this.shouldPauseOnHover = autoplayPauseOnHover === "true";
    this.loopBackToStart = loopBackToStart === "true";
    this.loopBackToStartMobile = loopBackToStartMobile === "true";
    this.userIsOnTouchScreen = () =>
      window.matchMedia("(pointer: coarse)").matches;
    this.eventOptions = { signal: this.controller.signal };

    // Note this will fail if a class is passed that
    // cannot be found. Fallback should not exist.
    const navigationWrapper = navigationContainer
      ? this.closest(navigationContainer)
      : this;

    this.pageDotsElement = navigationWrapper.querySelector(
      this.selectors.pageDots,
    );
    this.pageDotsElementInner = navigationWrapper.querySelector(
      this.selectors.pageDotsInner,
    );
    this.counterWrapper = navigationWrapper.querySelector(
      this.selectors.counterWrapper,
    );
    this.currentPageElement = navigationWrapper.querySelector(
      this.selectors.currentCounter,
    );
    this.pageTotalElement = navigationWrapper.querySelector(
      this.selectors.totalCounter,
    );

    this.prevButton = navigationWrapper.querySelector(this.selectors.prevButton);
    this.nextButton = navigationWrapper.querySelector(this.selectors.nextButton);

    if (this.loopBackToStartMobile) {
      this.mobileLoopButton = sliderParent.querySelector(
        this.selectors.mobileLoopButton,
      );
    }

    this.pageDotEvents = [];

    this.initEvents();

    if (this.dataset.initializationStrategy === "manual") {
      document.addEventListener(
        EVENTS.SCROLL_SLIDER_INIT(this.id),
        (event) => {
          const source = event.detail.source || null;

          this.initScroller(source);
        },
        this.eventOptions,
      );
    } else {
      const resizeObserver = new ResizeObserver(() => this.initScroller());
      resizeObserver.observe(this.slider);
    }
  }

  initEvents() {
    this.slider.addEventListener(
      "scroll",
      this.handleScrollPositionChange.bind(this),
      this.eventOptions,
    );

    document.addEventListener(
      EVENTS.SCROLL_SLIDER_GO_TO_SLIDE(this.id),
      (event) => {
        this.scrollTo(
          event.detail.slideIndex * this.sliderWidth,
          event.detail.behavior,
        );
      },
      this.eventOptions,
    );

    if (this.prevButton) {
      this.prevButton.addEventListener(
        "click",
        this.onButtonClick.bind(this),
        this.eventOptions,
      );
    }

    if (this.nextButton) {
      this.nextButton.addEventListener(
        "click",
        this.onButtonClick.bind(this),
        this.eventOptions,
      );
    }

    if (this.mobileLoopButton) {
      this.mobileLoopButton.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          this.scrollTo(0, "instant");
        },
        this.eventOptions,
      );
    }
  }

  setInitialSlide() {
    this.initialSlide = null;

    for (let i = 0; i < this.sliderItems.length; i++) {
      const slide = this.sliderItems[i];

      if (slide.getAttribute("data-initial-slide") !== null) {
        this.initialSlide = slide;
        break
      }
    }

    if (this.initialSlide) {
      document.dispatchEvent(
        new CustomEvent(EVENTS.SCROLL_SLIDER_GO_TO_SLIDE(this.id), {
          detail: {
            slideIndex: this.initialSlide.dataset.slideIndex,
            behavior: "instant",
          },
        }),
      );
    }
  }

  initScroller(source = null) {
    const previousTotalPageCount = this.totalPages;

    this.sliderItemsToShow = Array.from(this.sliderItems).filter(
      (element) => element.clientWidth > 0,
    );

    this.contentsAreScrollable =
      this.slider.scrollWidth > this.slider.offsetWidth;
    this.dataset.contentsAreScrollable = this.contentsAreScrollable;

    // Sliders may be hidden at different breakpoints
    if (!this.sliderItemsToShow.length) return

    this.sliderStyles = getComputedStyle(this.slider);
    this.styles = getComputedStyle(this);

    this.gapWidth = parseFloat(this.sliderStyles.getPropertyValue("gap"));

    this.fullWidthPaddingOffset = parseFloat(
      this.sliderStyles.getPropertyValue("padding-left"),
    );

    this.columns = this.styles.getPropertyValue("--scroll-columns");
    this.visibleColumns = this.columns - 1;

    // The slider width can be pulled to the edge of the screen to create
    // the illusion of overflow. this is done with padding and negative
    // margins. Adjusting for the padding will always display the intended
    // view area without overflow of the slider.
    this.sliderWidth =
      this.getBoundingClientRect().width - this.fullWidthPaddingOffset;

    this.slideWidth = this.sliderItemsToShow[0].getBoundingClientRect().width;

    // The width of a slide is equal to the actual width plus the adjusted
    // amount of gaps - 1. This pattern matches the same that is used within
    // the css.
    this.slideWidthWithGap =
      this.slideWidth + (this.gapWidth * this.visibleColumns) / this.columns;

    // The last slide showing on the page includes the gap to
    // the next slide which we're offsetting with css.
    this.slidesPerPage = Math.floor(this.sliderWidth / this.slideWidthWithGap);

    if (this.slidesPerPage === 0) {
      console.log(
        "scroll-slider error, this.slidesPerPage calculated as 0, aborting",
      );
      return
    }

    this.totalPages = Math.ceil(
      this.sliderItemsToShow.length / this.slidesPerPage,
    );

    if (this.pageDotsElement && previousTotalPageCount !== this.totalPages) {
      this.initPageDots();
    }

    // Due to potential race conditions between sections and internal components
    // initializing at different times, some sections must wait for full initialization.
    if (!this.initialized || this.dataset.initializationStrategy === "manual") {
      document.dispatchEvent(
        new CustomEvent(EVENTS.SCROLL_SLIDER_INITIALIZED(this.id), {
          detail: { source },
        }),
      );

      this.initialized = true;
      this.setInitialSlide();
    }

    this.handleScrollPositionChange();
  }

  initPageDots() {
    const dotTemplate = this.pageDotsElement.querySelector("template");
    let dotTemplateMarkup = dotTemplate.innerHTML;
    dotTemplateMarkup = dotTemplateMarkup.replace("{{ number }}", "[[number]]");

    // Reset page dots
    if (this.pageDotController) {
      this.pageDotController.abort();
    }

    this.pageDotController = new AbortController();
    this.pageDotsElementInner.innerHTML = "";
    this.dots = null;

    for (let index = 0; index < this.totalPages; index++) {
      const dotMarkup = dotTemplateMarkup.replaceAll("[[number]]", index);
      const template = document.createElement("template");
      template.innerHTML = dotMarkup;
      const dot = template.content;

      this.pageDotsElementInner.appendChild(dot);
    }
    this.pageDotsElement.addEventListener(
      "click",
      this.onDotsContainerClick.bind(this),
      {
        signal: this.pageDotController.signal,
      },
    );
    this.dots = this.pageDotsElement.querySelectorAll(this.selectors.dot);
    this.pageDotsElement.setAttribute("data-dot-count", this.totalPages);
  }

  handleScrollPositionChange() {
    const previousPage = this.currentPage;

    this.currentPage =
      Math.round(
        this.slider.scrollLeft / (this.slideWidthWithGap * this.slidesPerPage),
      ) + 1;

    // Because the slider counts the number of visible
    // slides per page. The final scroll can potentially not
    // update correctly if it is showing a number of slides
    // less than the slides per page. We need to adjust for this.
    if (
      this.isSlideVisible(
        this.sliderItemsToShow[this.sliderItemsToShow.length - 1],
        this.fullWidthPaddingOffset,
      ) &&
      this.currentPage !== this.totalPages
    ) {
      ++this.currentPage;
    }

    // Update page count
    if (this.counterWrapper) {
      if (this.totalPages === 1) {
        this.counterWrapper.classList.add(this.classes.hidden);
      } else {
        this.counterWrapper.classList.remove(this.classes.hidden);
        this.currentPageElement.textContent = this.currentPage;
        this.pageTotalElement.textContent = this.totalPages;
      }
    }

    // Update page dots
    if (this.pageDotsElement) {
      this.pageDotsElement.classList.remove(this.classes.hidden);
      this.dots.forEach((dot) => dot.classList.remove(this.classes.dotActive));
      this.dots[this.currentPage - 1]?.classList.add(this.classes.dotActive);

      if (this.totalPages === 1) {
        this.pageDotsElement.classList.add(this.classes.hidden);
      }
    }

    if (this.currentPage !== previousPage) {
      document.dispatchEvent(
        new CustomEvent(EVENTS.SCROLL_SLIDER_CHANGED(this.id), {
          detail: {
            previousPage,
            previousElement: this.sliderItemsToShow[previousPage - 1],
            currentPage: this.currentPage,
            currentElement: this.sliderItemsToShow[this.currentPage - 1],
          },
        }),
      );
    }

    // If is slideshow, buttons should never disable (looping behaviour)
    if (this.isSlideshow) return

    if (this.nextButton && this.prevButton) {
      // Hide the buttons if there's only 1 page
      if (this.totalPages === 1) {
        this.prevButton.hidden = true;
        this.nextButton.hidden = true;
      } else {
        this.prevButton.hidden = false;
        this.nextButton.hidden = false;
      }

      if (
        this.isSlideVisible(this.sliderItemsToShow[0]) &&
        this.slider.scrollLeft <= 0
      ) {
        this.prevButton.setAttribute("disabled", "disabled");
      } else {
        this.prevButton.removeAttribute("disabled");
      }

      if (
        this.isSlideVisible(
          this.sliderItemsToShow[this.sliderItemsToShow.length - 1],
        ) &&
        this.loopBackToStart === false
      ) {
        this.nextButton.setAttribute("disabled", "disabled");
      } else {
        this.nextButton.removeAttribute("disabled");
      }
    }
  }

  isSlideVisible(element, offset = 0) {
    const elOffsetLeft = element.offsetLeft;
    const sliderScrollLeft = this.slider.scrollLeft;

    // Account for the padding/negative margin that's used for the bordered grid display
    if (this.hasBorderedGrid) {
      offset += 1;
    }

    const lastVisibleSlidePosition = Math.floor(
      this.sliderWidth + sliderScrollLeft + offset,
    );

    const scrollPosition = Math.floor(
      elOffsetLeft + element.getBoundingClientRect().width,
    );

    return scrollPosition <= lastVisibleSlidePosition
  }

  // eslint-disable-next-line class-methods-use-this
  userIsTabbing() {
    return document.body.classList.contains("user-is-tabbing")
  }

  onDotsContainerClick(event) {
    if (event.target.tagName === "BUTTON") {
      this.onDotClick(event);
    }
  }

  onDotClick(event) {
    event.preventDefault();

    const scrollBehavior = this.isSlideshow ? "instant" : "smooth";
    const { goTo } = event.target.dataset;

    this.scrollTo(
      goTo * this.slideWidthWithGap * this.slidesPerPage,
      scrollBehavior,
    );
  }

  onButtonClick(event) {
    event.preventDefault();

    const amountToScroll = this.slidesPerPage * this.slideWidthWithGap;
    const movingForwards = event.currentTarget.name === "next";
    const lastSlideVisible = this.isSlideVisible(
      this.sliderItemsToShow[this.sliderItemsToShow.length - 1],
    );
    let scrollBehavior = this.isSlideshow ? "instant" : "smooth";
    let destinationPosition;

    if (lastSlideVisible && movingForwards && this.loopBackToStart) {
      destinationPosition = 0;
      scrollBehavior = "instant";
    } else {
      const currentPosition = this.slider.scrollLeft;

      destinationPosition = movingForwards
        ? currentPosition + amountToScroll
        : currentPosition - amountToScroll;
    }

    // TODO: this needs to check for max scroll amount, and also looping
    this.scrollTo(destinationPosition, scrollBehavior);
  }

  scrollTo(left, behavior = "smooth") {
    this.slideScrollPosition = left;
    this.slider.scrollTo({
      left,
      behavior,
    });
  }

  updateSlideVisibility() {
    this.sliderItems.forEach((slide, index) => {
      slide.toggleAttribute("inert", index !== this.currentPage - 1);
    });
  }

  disconnectedCallback() {
    this.controller.abort();
    this.pageDotController?.abort();
  }
}

if (!customElements.get("scroll-slider-component")) {
  customElements.define("scroll-slider-component", ScrollSlider);
}

export { ScrollSlider as default };

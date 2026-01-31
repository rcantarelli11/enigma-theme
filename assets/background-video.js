import { g as getMediaQuery } from './media-queries-5a9283a8.js';
import { s as srraf } from './srraf.es-487187f3.js';
import { i as intersectionWatcher } from './intersection-watcher-50753dc4.js';

const atBreakpointChange = (breakpointToWatch, callback) => {
  const _screenUnderBP = () => {
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;

    return viewportWidth <= breakpointToWatch
  };

  let screenUnderBP = _screenUnderBP();

  const widthWatcher = srraf(({ vw }) => {
    const currentScreenWidthUnderBP = vw <= breakpointToWatch;

    if (currentScreenWidthUnderBP !== screenUnderBP) {
      screenUnderBP = currentScreenWidthUnderBP;
      return callback()
    }
  });

  const unload = () => {
    widthWatcher.destroy();
  };

  return { unload }
};

const prefersReducedMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
};

/**
 * Extracts background videos from 'template's to be added to the DOM, and controls pause/play state through
 * a11y triggers and an intersection observer.
 * If two videos are enabled for desktop and mobile, update video templates by screen size.
 */

class BackgroundVideo extends HTMLElement {
  connectedCallback() {
    const videoTemplate = this.querySelector("[js-background-video-template]");

    const hasVideo = this.dataset.hasVideo === "true";
    const hasMobileVideo = this.dataset.hasMobileVideo === "true";

    if (hasVideo && !hasMobileVideo) {
      this.#setVideoTemplate(videoTemplate, this);
    } else if (hasVideo & hasMobileVideo) {
      const videoMobileTemplate = this.querySelector(
        "[js-mobile-background-video-template]",
      );
      this.#initResponsiveVideoTemplate(
        this,
        videoTemplate,
        videoMobileTemplate,
      );
    }
  }

  disconnectedCallback() {
    this.removeEventListener("toggle", this.handleToggle, true);
  }

  #initResponsiveVideoTemplate(container, videoTemplate, videoMobileTemplate) {
    const setTemplateByWidth = () => {
      if (window.matchMedia(getMediaQuery("tablet")).matches) {
        this.#setVideoTemplate(videoTemplate, container);
      } else {
        this.#setVideoTemplate(videoMobileTemplate, container);
      }
    };

    setTemplateByWidth();
    atBreakpointChange(720, setTemplateByWidth);
  }

  #setVideoTemplate(videoTemplate, container) {
    const pauseBtn = container.querySelector("[js-video-pause-button]");
    const currentVideoContainer = container.querySelector(
      "[js-current-background-video-container]",
    );

    const currentVideoTemplate = videoTemplate.content.cloneNode(true);
    const currentVideoEl = currentVideoTemplate.querySelector(
      "[data-background-video]",
    );

    if (currentVideoEl) {
      currentVideoEl.muted = true;
    }

    currentVideoContainer.innerHTML = "";
    currentVideoContainer.appendChild(currentVideoTemplate);

    // Callback for intersectionWatcher helps leverage context from this file without needing to pass it
    const videoWatcherCallback = (visible) =>
      this.#visibleVideoWatcher(currentVideoEl, pauseBtn, visible);

    this.#setPlayPause(currentVideoEl, pauseBtn, "pause");
    this.#videoA11yHandler(currentVideoEl, pauseBtn);
    intersectionWatcher(currentVideoEl, { callback: videoWatcherCallback });
  }

  #videoA11yHandler(video, pauseBtn) {
    if (!pauseBtn || !video) return

    // Play/pause button will show when tabbing
    pauseBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Pausing via a11y tabbing is respected as priority state by the intersection observer
      if (video.paused) {
        this.#setPlayPause(video, pauseBtn, "play");
        video.dataset.a11yPriorityPause = false;
      } else {
        this.#setPlayPause(video, pauseBtn, "pause");
        video.dataset.a11yPriorityPause = true;
      }
    });
  }

  #visibleVideoWatcher(video, pauseBtn, visible) {
    // Prioritize browser and device settings
    if (prefersReducedMotion()) {
      return
    }

    if (visible && video.paused) {
      // Fade in video from poster for smooth transition, only on first entry
      if (video.dataset.videoLoaded === "false") {
        video.classList.add("background-video__video--fade-in");
        video.dataset.videoLoaded = "true";
      }

      // Play via intersection entry should only apply when paused state not from a11y tabbing
      if (video.dataset.a11yPriorityPause === "false") {
        this.#setPlayPause(video, pauseBtn, "play");
      }
    }

    if (!visible && !video.paused) {
      this.#setPlayPause(video, pauseBtn, "pause");
    }
  }

  #setPlayPause(video, pauseBtn, state) {
    const {
      strings: { accessibility: strings },
      icons,
    } = window.theme;

    if (state === "pause") {
      video.pause();

      if (pauseBtn.dataset.pauseButtonContent === "icon") {
        pauseBtn.innerHTML = icons.play;
      } else {
        pauseBtn.innerText = strings.playVideo;
      }
    } else {
      video.play();

      if (pauseBtn.dataset.pauseButtonContent === "icon") {
        pauseBtn.innerHTML = icons.pause;
      } else {
        pauseBtn.innerText = strings.pauseVideo;
      }
    }
  }
}

if (!customElements.get("background-video")) {
  customElements.define("background-video", BackgroundVideo);
}

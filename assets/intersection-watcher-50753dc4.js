import { g as getMediaQuery } from './media-queries-5a9283a8.js';

/**
 * Sets IO that adds 'became-visible' class, mainly for animations with additional control via callback.
 * @param {HTMLElement} node - Element to watch.
 * @param {Object} options - Options object
 * @param {boolean} options.instantThreshold - View sensitivity before triggering IO's callback.
 * @param {*} options.callback - Will track 'visible' boolean and will not disconnect until destroy() called.
 */
var intersectionWatcher = (
  node,
  options = { instantThreshold: false, callback: false },
) => {
  let threshold = 0;

  if (!options.instantThreshold) {
    const margin = window.matchMedia(getMediaQuery("tablet")).matches
      ? 200
      : 100;
    threshold = Math.min(margin / node.offsetHeight, 0.5);
  }

  const observer = new IntersectionObserver(
    ([{ isIntersecting: visible }]) => {
      if (options.callback) {
        options.callback(visible);
      } else {
        if (visible) {
          node.classList.add("became-visible");
          observer.disconnect();
        }
      }
    },
    { threshold },
  );

  observer.observe(node);

  return {
    destroy() {
      observer?.disconnect();
    },
  }
};

export { intersectionWatcher as i };

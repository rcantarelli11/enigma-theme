import { i as intersectionWatcher } from './intersection-watcher-50753dc4.js';
import './media-queries-5a9283a8.js';

// Use this custom element to easily apply a 'became-visible' class
// when an element is scrolled into view, which can be used to trigger
// animations.  The class will not be removed if the element is scrolled out of view
class VisibilityWatcher extends HTMLElement {
  connectedCallback() {
    if (this.dataset.watchParentSelector) {
      this.target = this.closest(this.dataset.watchParentSelector);
    } else if (this.dataset.watchChildSelector) {
      this.target = this.querySelector(this.dataset.watchChildSelector);
    } else {
      this.target = this;
    }
    intersectionWatcher(this.target);
  }
}

if (!customElements.get("visibility-watcher")) {
  customElements.define("visibility-watcher", VisibilityWatcher);
}

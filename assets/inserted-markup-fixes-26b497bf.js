import { o as oldSafariSrcsetKludge, s as svgImagesLoaded } from './svg-images-loaded-7454cac3.js';
import { d as dialog } from './modals-452e00fa.js';

// We commonly fetch markup and parse it with `DOMParser().parseFromString() which
// has a quirk that script tags within the markup remain present but are silently
// marked as non-executable, meaning a script tag loading an external asset will
// not load it. This presents a problem if we have a custom element that requires
// its associated JS which is loaded adjancent in the markup. To resolve this, any
// inserted markup can be run through this helper, which will create a duplicate
// script and insert it into the head.

const domparserExternalAssetsFix = (container) => {
  const scripts = container.querySelectorAll("script");
  scripts.forEach((script) => {
    const newScript = document.createElement("script");
    newScript.setAttribute("src", script.getAttribute("src"));
    newScript.setAttribute("type", script.getAttribute("type"));
    document.head.appendChild(newScript);
  });
};

// Any dialogs that are present in the page on load are instantiated by

const insertedDialogFix = (container) => {
  const dialogs = container.querySelectorAll("dialog[data-fluco-dialog]");

  dialogs.forEach((dialogEl) => {
    const key = dialogEl.getAttribute("data-fluco-dialog");
    if (window.flu.dialogs[key]) {
      window.flu.dialogs[key][1].destroy({
        deregister: true,
      });
    }
    dialog(dialogEl);
  });
};

const insertedMarkupFixes = (container) => {
  oldSafariSrcsetKludge(container);
  svgImagesLoaded(container);
  domparserExternalAssetsFix(container);
  insertedDialogFix(container);
};

export { insertedMarkupFixes as i };

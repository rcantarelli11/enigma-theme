// Old Safari kludge: dynamically inserted srcsets are not respected, so we have to
// force a rerender of image after insertion.
// https://stackoverflow.com/questions/45487105/ajax-loaded-images-in-safari-not-respecting-srcset
// This issue is known to affect Safari 15 and 16.3 while 16.5.1 was tested to work

// Call this on any content containing images that is dynamically inserted (section rendering, template)

const oldSafariSrcsetKludge = (container) => {
  const isPotentiallyBuggySafari =
    navigator.userAgent.includes("Safari") &&
    (navigator.userAgent.includes("Version/15") ||
      navigator.userAgent.includes("Version/16"));

  if (!isPotentiallyBuggySafari) {
    return
  }

  container.querySelectorAll("img[srcset]").forEach((image) => {
    // eslint-disable-next-line no-self-assign
    image.outerHTML = image.outerHTML;
  });
};

// svg elements have a quirk where they have a `loaded` event during initial page
// load but not when inserted dynamically.  The loaded event is used to add
// a 'loaded' class to trigger our lazy load animation so we need to manually
// add a loaded class to these elements
// Call this on any content containing images that is dynamically inserted (section rendering, template)

const svgImagesLoaded = (container) => {
  container
    .querySelectorAll("svg.image")
    .forEach((image) => image.classList.add("loaded"));

  return container
};

export { oldSafariSrcsetKludge as o, svgImagesLoaded as s };

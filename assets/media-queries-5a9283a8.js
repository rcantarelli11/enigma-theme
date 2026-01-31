/**
 *
 * @param {*} querySize Fill in the blank to complete the custom property '--js-{{ querySize }}'.
 * Options maintained within breakpoint.css
 * @returns complete custom property to set breakpoint changes.
 */
function getMediaQuery(querySize) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    `--js-${querySize}`,
  );

  if (!value) {
    console.warn("Invalid querySize passed to getMediaQuery");
    return false
  }

  return value
}

export { getMediaQuery as g };

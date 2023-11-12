/**
 * Finds all elements within a given element that have an attribute starting with "oyc-on:" or "data-oyc-on:"
 * @param {HTMLElement}  - The root element to start searching from. Defaults to the entire document.
 * @returns {Array<HTMLElement>} An array of matching nodes
 */
export function findOnElements(parent) {
  // TODO: Add alternative to evaluate by looping through all the elements and their attributes
  const xpathResults = document.evaluate(
    '//*[@*[ starts-with(name(), "oyc-on:") or starts-with(name(), "data-oyc-on:") ]]',
    parent
  );

  let element = null;
  const elements = [];

  while ((element = xpathResults.iterateNext())) {
    elements.push(element);
  }
  return elements;
}

/**
 * Checks if the given element has an attribute with the given name.
 * Also checks for the attribute with the "data-" prefix.
 *
 * @param {HTMLElement} element
 * @param {string} name
 * @returns boolean
 */
export function hasAttribute(element, name) {
  return element.hasAttribute(name) || element.hasAttribute("data-" + name);
}

/**
 * Gets the value of the given attribute on the given element.
 * Also checks for the attribute with the "data-" prefix.
 *
 * @param {HTMLElement} element
 * @param {string} name
 * @returns unknown
 */
export function getAttribute(element, name) {
  return element.getAttribute(name) || element.getAttribute("data-" + name);
}

/**
 * Converts a time interval string to milliseconds.
 * @param {string} time - The time interval string.
 * @returns {number} The time in milliseconds.
 */
export function parseInterval(time) {
  if (time === undefined) {
    return undefined;
  }

  let value = parseFloat(time);
  let unit = time.replace(value, "");

  switch (unit) {
    case "ms":
      return value; // milliseconds
    case "s":
      return value * 1000; // seconds to milliseconds
    case "m":
      return value * 60000; // minutes to milliseconds
    default:
      console.warn("[OYC] Invalid time interval: " + time);
      return undefined;
  }
}
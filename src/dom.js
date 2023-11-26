import { processElementAndChildren } from "./oyc.js";
// We reuse the DOMParser instead of creating a new one
const domParser = new DOMParser();

/**
 * Parses an HTML string and returns a document fragment containing the parsed HTML.
 * @param {string} htmlString - The HTML string to parse.
 * @param {string} [outputSelector] - Optional CSS selector for selecting a specific element from the parsed HTML.
 * @returns {DocumentFragment | Element} - The parsed HTML as a document fragment or a selected element.
 */
export function parseHTML(htmlString, outputSelector) {
  // TODO: Support full body refreshes and title changes
  // We wrap the html string inside a body tag
  // Looking at the htmx part of the code this appears to avoid some weirdness around parsing `table` tags and friends
  // TODO: verify this assumption
  // TODO: handle scripts
  const parsedHTML = domParser.parseFromString(
    `<body><template>${htmlString}</template></body>`,
    "text/html"
  ).querySelector("template").content;


  if (outputSelector) {
    return parsedHTML.querySelector(outputSelector);
  }

  return parsedHTML;
}

/**
 * Inserts a fragment of HTML elements before a specified element in the DOM tree.
 * @param {Element} parent - The parent element where the fragment will be inserted.
 * @param {Node} insertBeforeNode - The element before which the fragment will be inserted.
 * @param {DocumentFragment | Element} fragment - The fragment of HTML elements to be inserted.
 * @returns {void}
 */
function insertBefore(parent, insertBeforeNode, fragment) {
  while (fragment.childNodes.length > 0) {
    const child = fragment.firstChild;
    parent.insertBefore(child, insertBeforeNode);
    if (
      child.nodeType === Node.ELEMENT_NODE
    ) {
      // TODO: process this later after all have been inserted because some code may expect all html to exist
      // This type assertion is safe because of the check above
      processElementAndChildren(/** @type Element*/(child));
    }
  }
}

/**
 * Replaces the outer HTML of a target element with the provided HTML string.
 *
 * @param {Element} targetElement - The target element whose outer HTML needs to be replaced.
 * @param {string} htmlString - The HTML string to replace the outer HTML of the target element.
 * @returns {void}
 */
export function swapOuterHTML(targetElement, htmlString) {
  const fragment = parseHTML(htmlString);
  const previousSibling = targetElement.previousSibling;
  insertBefore(targetElement.parentElement, previousSibling, fragment);

  // Remove the remaining HTML
  // TODO: Maybe there's a faster way? Maybe using `Range` need to benchmark this
  targetElement.remove();
}

/**
 * Replaces the HTML content of a target element with new HTML content.
 * @param {Element} targetElement - The element whose HTML content will be replaced.
 * @param {string} htmlString - The new HTML content to replace the old content with.
 * @returns {void}
 */
export function swapInnerHTML(targetElement, htmlString) {
  // TODO: Support multiple strategies for swapping HTML
  // TODO: Support full body refreshes and title changes

  const fragment = parseHTML(htmlString);
  const firstChild = targetElement.firstChild;

  insertBefore(targetElement, firstChild, fragment);

  // Remove the remaining HTML
  // TODO: Maybe there's a faster way? Maybe using `Range` need to benchmark this
  if (firstChild) {
    while (firstChild.nextSibling) {
      targetElement.removeChild(firstChild.nextSibling);
    }
    targetElement.removeChild(firstChild);
    // TODO: Clean up existing elements including event handlers
  }
}
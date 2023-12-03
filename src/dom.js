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
    "text/html",
  ).querySelector("template").content;

  if (outputSelector) {
    return parsedHTML.querySelector(outputSelector);
  }

  return parsedHTML;
}

/**
 * Inserts a fragment of DOM nodes before a specified node in the parent node.
 * Calls the provided callback function on each inserted element node.
 *
 * @param {Element} parent - The parent node where the fragment will be inserted.
 * @param {Node} insertBeforeNode - The node before which the fragment will be inserted.
 * @param {DocumentFragment | Element} fragment - The fragment of DOM nodes to be inserted.
 * @returns {void}
 */
function insertBefore(parent, insertBeforeNode, fragment) {
  while (fragment.childNodes.length > 0) {
    parent.insertBefore(fragment.firstChild, insertBeforeNode);
  }
}

/**
 * Replaces the outer HTML of a target element with the provided HTML string.
 *
 * @param {Element} targetElement - The target element whose outer HTML needs to be replaced.
 * @param {string} htmlString - The HTML string to replace the outer HTML of the target element.
 * @param {Function} onProcess - The callback function to be called on each inserted element node.
 * @returns {void}
 */
export function swapOuterHTML(targetElement, htmlString, onProcess) {
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
 * @param {(element: ChildNode) => void} onProcess - The callback function to be called on each inserted element node.
 * @returns {void}
 */
export function swapInnerHTML(targetElement, htmlString, onProcess) {
  // TODO: Support full body refreshes and title changes

  const fragment = parseHTML(htmlString);
  const firstChild = targetElement.firstChild;
  const initialCount = targetElement.childElementCount;

  /**
   * We could clear the count before appending, but if something goes wrong,
   * it probably looks worse. Willing to change this behavior.
   * It would probably be simpler to just clear the parent
   */

  insertBefore(targetElement, firstChild, fragment);

  if (firstChild) {
    let prevSibling = firstChild.previousSibling
    while (prevSibling) {
      onProcess(prevSibling);
      prevSibling = prevSibling.previousSibling;
    }
  }

  if (initialCount > 1 ){
    // Delete Contents doesn't work on a collapsed range.
    // A collapsed range is when the start and end are the same.
    // So we check if there are more than 1 children.
    const range = document.createRange();
    range.setStart(firstChild, 0);
    range.setEnd(targetElement.lastChild, 0);
    range.deleteContents();
  } else {
    firstChild.remove();
  }

}

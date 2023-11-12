import { oyc } from "../src/oyc.js";

/**
 * Creates a new Response object with the given content and status.
 * @param {string|Object} content - The content to include in the response. If an object is provided, it will be serialized to JSON.
 * @param {boolean} [ok=true] - Whether the response should be considered successful or not.
 * @returns {Response} A new Response object.
 */
export function makeResponse(content, ok = true) {
  // Create an error Response if ok is false
  return new Response(
    typeof content === "string" ? content : JSON.stringify(content),
    ok
      ? { status: 200 }
      : { status: 500 }
  );
}

/**
 * Creates a test area element in the DOM with an id of "test-area".
 * If the element already exists, it will be cleared.
 * @returns {void}
 */
export function makeTestArea() {
  if (document.getElementById("test-area")) {
    clearTestArea();
    return;
  }

  const testArea = document.createElement("div");
  testArea.setAttribute("id", "test-area");
  document.body.appendChild(testArea);
}

/**
 * Clears the content of the test area element.
 * @returns {void}
 */
export function clearTestArea() {
  const testArea = document.getElementById("test-area");
  if (testArea) {
    testArea.innerHTML = "";
  }
}

/**
 * Returns the test area element.
 * @returns {HTMLElement} The test area element.
 * @throws {Error} If no test area element is found.
 */
export function getTestArea() {
  const testArea = document.getElementById("test-area");
  if (!testArea) {
    throw new Error("No test area found.");
  }
  return testArea;
}

/**
 * Adds HTML to the test area and processes it with OYC.
 * @param {string} html - The HTML to add to the test area.
 * @returns {HTMLElement} - The last processed child element.
 */
export function addTestHTML(html) {
  const fragment = document.createRange().createContextualFragment(html);

  const testArea = getTestArea();
  if (!testArea) {
    // This is guaranteed by the code below where we queue up the function
    // to run when the document is ready.
    throw new Error("No test area found.");
  }

  let child = null;

  while (fragment.children.length > 0) {
    child = fragment.children[0];
    // Append child is a move operation
    testArea.appendChild(child);
    oyc.process(child);
  }

  //Return last processed child
  return child;
}

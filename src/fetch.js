import { swapInnerHTML } from "./dom.js";

/**
 * @param {string} method
 * @param {RequestInfo | URL} url
 * @param {(element: ChildNode) => void} onProcess - The callback function to be called on each inserted element node.
 * @param {Element} swapTarget
 */
export async function handleFetch(method, url, swapTarget, onProcess) {
  const response = await fetch(url, {
    method: method.toUpperCase(),
  });

  if (response.ok) {
    const html = await response.text();
    swapInnerHTML(swapTarget, html, onProcess);
  }
}

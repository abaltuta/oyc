import { swapInnerHTML } from "./dom.js";

/**
 * @param {string} method
 * @param {RequestInfo | URL} url
 * @param {Element} swapTarget
 */
export async function handleFetch(method, url, swapTarget) {
  // TODO: handle multiple swap types
  const response = await fetch(url, {
    method: method.toUpperCase(),
  });

  if (response.ok) {
    const html = await response.text();
    swapInnerHTML(swapTarget, html);
  }
}

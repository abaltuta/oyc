import { swapInnerHTML } from "./dom";

export async function handleFetch(method, url, element) {
  // TODO: handle multiple swap types
  const response = await fetch(url, {
    method: method.toUpperCase(),
  });

  if (response.ok) {
    const html = await response.text();
    swapInnerHTML(element, html);
  }
}

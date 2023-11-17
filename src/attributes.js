import { handleFetch } from "./fetch.js";
import { httpMethods } from "./static.js";
import { parseAndAddTriggerHandler, getAttribute } from "./utils.js";

/**
 * @param {Element} element
 */
export function processHTTPAttributes(element) {
  for (let index = 0; index < httpMethods.length; index++) {
    const url = getAttribute(element, "oyc-" + httpMethods[index]);
    if (url) {
      parseAndAddTriggerHandler(element, (event) => {
        // TODO: Disable this element's processing while the request is in progress
        // add a boolean to the element?
        void handleFetch(
          httpMethods[index],
          url,
          // I didn't manage to override the Event interface in TS
          /** @type {Element} */
          // We are using target because, by default, the element that we have attached the event listener
          // is the one to swap
          (event.target) // TODO: allow us to set a different target for the swap
        );
      });
    }
  }
}

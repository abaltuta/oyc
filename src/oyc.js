import { handleFetch } from "./fetch.js";
import { httpMethods } from "./static.js";
import {
  addEventListener,
  addTriggerHandler,
  findElementsToProcess,
  findOnElements,
  getAttribute,
  getData,
  hasAttribute,
  parseTrigger,
  removeEventListener,
} from "./utils.js";

export class Oyc {
  ready = document.readyState === "complete";
  on = addEventListener;
  off = removeEventListener;
  getOycData = getData;
  process = processElementAndChildren;

  constructor() {
    // Are we already loaded? This shouldn't happen since we recomment loading this script as a module
    if (this.ready == false) {
      document.addEventListener("readystatechange", (event) => {
        if (event.target.readyState === "complete") {
          this.ready = true;
        }
      });
    }

    this.onReady(function () {
      processElementAndChildren(document.body);
      // TODO: emit custom event
    });
  }

  /**
   * Execute a function now if DOMContentLoaded has fired, otherwise listen for it.
   *
   */
  onReady(fn) {
    // HTMX handles the following edge case so we should too.
    //
    // Checking readyState here is a failsafe in case the oyc script tag entered the DOM by
    // some means other than the initial page load.
    if (this.ready) {
      fn();
    } else {
      document.addEventListener("readystatechange", (event) => {
        if (event.target.readyState === "complete") {
          fn();
        }
      });
    }
  }
}

//#region Fetch

//#endregion

//#region Core

export function processElement(element) {
  for (let index = 0; index < httpMethods.length; index++) {
    if (hasAttribute(element, "oyc-" + httpMethods[index])) {
      addTriggerHandler(element, function (event) {
        // TODO: Disable this element's processing while the request is in progress
        // add a boolean to the element?
        void handleFetch(
          httpMethods[index],
          getAttribute(element, "oyc-" + httpMethods[index]),
          event.target
        );
      });
    }
  }
}

function addCustomEventListeners(element) {
  // Remove existing custom listeners, diffing them would be too much of a pain.
  removeCustomEventListeners(element);

  /**
   * Find all the elements and add event handlers.
   * Keep a reference in `onEventHandlers` so we can remove them later.
   */
  findOnElements(element).forEach((element) => {
    const data = getData(element);
    // TODO: Type this somehow in jsdoc
    data.onEventHandlers = [];
    for (let index = 0; index < element.attributes.length; index++) {
      const attribute = element.attributes[index];
      if (
        attribute.name.startsWith("oyc-on:") ||
        attribute.name.startsWith("data-oyc-on:")
      ) {
        const event = attribute.name.slice(attribute.name.indexOf(":") + 1);
        const listener = attribute.value;

        // TODO: there is a limitation here in that we can't easily add event listeners
        // when the listener is a function that is not a top-level function or when used inside
        // another ES Module

        // Yes, we only support top-level functions.
        // No, we will not support eval.
        const trigger = parseTrigger(getAttribute(element, "oyc-trigger"));
        if (trigger) {
          addEventListener(
            element,
            trigger.event,
            window[listener],
            trigger.modifiers
          );
        } else {
          addEventListener(element, event, window[listener], undefined);
        }
        data.onEventHandlers.push({
          event,
          listener,
        });
      }
    }
  });
}

function removeCustomEventListeners(element) {
  const data = getData(element);
  if (data.onEventHandlers) {
    for (let index = 0; index < data.onHandlers.length; index++) {
      // We do this manually instead of our wrapper since this is marginally faster
      element.removeEventListener(handler.event, handler.listener);
    }

    // Clean up `onEventHandlers`
    delete data.onEventHandlers;
  }
}

/**
 * Process the given element and its children.
 * This means:
 *    - Add event listeners
 *
 * @param {HTMLElement} element
 */
function processElementAndChildren(element) {
  // TODO: Add extra initialization for node like data
  // TODO: Add hook for custom initialization per-node

  // Remove existing event listeners
  // This may not be needed if we keep a hash of custom listeners
  processElement(element);

  const children = findElementsToProcess(element);
  for (let i = 0; i < children.length; i++) {
    processElement(children[i]);
  }

  // These should supercede the method listeners set above
  // Alternatively: We can process these as we process the children but the selector becomes more complex
  // I guess this is why HTMX does it like this too
  addCustomEventListeners(element);
}

//#endregion

/**
 * The Oyc instance.
 * @type {Oyc}
 */
export const oyc = new Oyc();

// Don't touch `window` server-side
if (typeof window !== "undefined") {
  window.oyc = oyc;
}

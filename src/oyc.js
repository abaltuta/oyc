import { processHTTPAttributes } from "./attributes.js";
import {
  addEventListener,
  findOycChildren,
  findOnElements,
  getAttribute,
  getData,
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
      document.addEventListener("readystatechange", () => {
        if (document.readyState === "complete") {
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
      document.addEventListener("readystatechange", () => {
        if (document.readyState === "complete") {
          fn();
        }
      });
    }
  }
}

/**
 * Adds OYC specific listeners
 * 
 * Note: this doesn't handle `oyc-on`. If you want that behavior please use `processElementAndChildren`
 * or `addCustomEventListeners`
 * This is because that uses a totally different selction mechanism
 * 
 * @param {Element} element
 */
export function processElement(element) {
  // Process HTTP Attributes
  processHTTPAttributes(element);
}

/**
 * Adds all custom event handlers on an element and its children
 * Ex: 
 * - oyc-on:click="topLevelFunctionName"
 * - oyc-on:click="topLevelFunctionName" oyc-trigger="click delay:2s"
 * 
 * @param {Element} element
 */
function addCustomEventListeners(element) {
  /**
   * Find all the elements and add event handlers.
   */
  const elements = findOnElements(element);
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];

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
          addEventListener(element, event, window[listener]);
        }
      }
    }
  }
}

/**
 * Process the given element and its children.
 * This means:
 *    - Add custom event listeres
 *    - Add HTTP event listeners
 *
 * @param {Element} element
 */
export function processElementAndChildren(element) {
  // TODO: Add extra initialization for node like data
  // TODO: Add hook for custom initialization per-node

  // Remove existing event listeners
  // This may not be needed if we keep a hash of custom listeners
  processElement(element);

  const children = findOycChildren(element);
  for (let i = 0; i < children.length; i++) {
    processElement(children[i]);
  }
  
  addCustomEventListeners(element);
}

/**
 * The Oyc instance.
 * @type {Oyc}
 */
export const oyc = new Oyc();

// Don't touch `window` server-side
if (typeof window !== "undefined") {
  window.oyc = oyc;
}

//#region Static Data

const oycDataAttribute = "oyc-data";

const httpMethods = ["get", "post", "put", "patch", "delete", "head"];

const methodSelector = httpMethods
  .flatMap((method) => [`[oyc-${method}]`, `[data-oyc-${method}]`])
  .join(",");

const oycAttributes = ["trigger"];

const oycAttributeSelector = oycAttributes
  .flatMap((attribute) => [`[oyc-${attribute}]`, `[data-oyc-${attribute}]`])
  .join(",");

const defaultTrigger = {
  event: "click",
  modifiers: undefined,
};

//#endregion

class Oyc {
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

async function handleFetch(method, url, element) {
  const request = new Request(url, {
    method,
  });
  const response = await fetch(request);
  if (response.ok) {
    const html = await response.text();
    console.log(element, html)
    swapHTML(element, html);
    console.log(element.innerHTML);
  }
}

//#endregion

//#region Core

function swapHTML(element, html) {
  // TODO: Support multiple strategies for swapping HTML
  element.innerHTML = html;
}

function addTriggerHandler(element, listener) {
  const trigger = parseTrigger(getAttribute(element, "oyc-trigger"));
  if (trigger) {
    addEventListener(element, trigger.event, listener, trigger.modifiers);
  } else {
    addEventListener(
      element,
      defaultTrigger.event,
      listener,
      defaultTrigger.modifiers
    );
  }
}

function processElement(element) {
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
 * Adds an event listener to the given element for the specified event.
 * @param {HTMLElement} [element] - The element to add the event listener to. Defaults to the document body.
 * @param {string} eventName - The name of the event to listen for.
 * @param {EventListenerOrEventListenerObject} listener - The listener function to call when the event is triggered.
 * @param {Modifier} modifier - The trigger object that describes how to handle the event.
 */
function addEventListener(element, eventName, listener, modifier) {
  if (!modifier || Object.keys(modifier).length === 0) {
    element.addEventListener(eventName, listener);
    return;
  }

  // If there is a modifier then wrap the listener function
  const listenerWrapper = function (event) {
    if (modifier.delay) {
      setTimeout(() => {
        listener(event);
      }, modifier.delay);
      return;
    }
    if (modifier.throttle) {
      throw new Error("Throttle is not yet implemented");
    }
    if (modifier.debounce) {
      throw new Error("Debounce is not yet implemented");
    }

    listener(event);
  };
  element.addEventListener(eventName, listenerWrapper, modifier);
}
/**
 * Removes an event listener from the specified element.
 * @param {HTMLElement} [element] - The element to remove the event listener from.
 * @param {string} eventName - The name of the event.
 * @param {EventListenerOrEventListenerObject} listener - The callback function to remove.
 */
function removeEventListener(element, eventName, listener) {
  element.removeEventListener(eventName, listener);
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

//#region Utilities

// TODO: Figure out a way to type this
function getData(element) {
  // An alternative to just adding this to the element is to use a WeakMap
  // I'm unsure if that would make any significant difference in performance
  // This is simpler to add 🤷‍♀️
  return element[oycDataAttribute] || {};
}

function findElementsToProcess(element) {
  if (element.querySelectorAll) {
    return element.querySelectorAll(
      methodSelector + "," + oycAttributeSelector
    );
  } else {
    return [];
  }
}

/**
 * Finds all elements within a given element that have an attribute starting with "oyc-on:" or "data-oyc-on:"
 * @param {HTMLElement}  - The root element to start searching from. Defaults to the entire document.
 * @returns {Array<HTMLElement>} An array of matching nodes
 */
function findOnElements(parent) {
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
function hasAttribute(element, name) {
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
function getAttribute(element, name) {
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

/**
 * @typedef {Object} Modifier
 * @property {boolean} once
 * @property {boolean} prevent
 * @property {string} delay
 * @property {string} throttle
 * @property {string} debounce
 * @property {boolean} capture
 * @property {boolean} passive
 * @property {string} from
 */

/**
 * @typedef {Object} Trigger
 * @property {string} event
 * @property {Modifier} modifiers
 */

// The trigger string is a comma-separated list of triggers
// These look like this "[event] [modifier1] [modifier2] [modifier3]"
// TODO: add support for events like:
//    - load
//    - revealed - when it first scrolls into the viewport
//    - intersect - when it intersects with another element
// Modifiers can be:
//    - once
//    - prevent
//    - poll:<time_interval> - can be in ms, s or m
//    - delay:<time_interval> - can be in ms, s or m
//    - throttle:<time_interval> - can be in ms, s or m
//    - debounce:<time_interval> - can be in ms, s or m
//    - capture
//    - passive
//    - from:<CSS Selector>
// TODO: support "changed" event
// TODO: support more selectors https://htmx.org/docs/#extended-css-selectors
/**
 * Parses a trigger string into an object with event and modifiers.
 * @param {string} triggerString - The trigger string to parse.
 * @returns {Trigger | undefined} An object with the event name and an array of modifiers.
 */
function parseTrigger(triggerString) {
  if (!triggerString) {
    return undefined;
  }
  // TODO: rewrite this to be more efficient
  // Read it character by character and consume tokens instead
  let parts = triggerString.split(" ");

  const event = parts[0];
  /**
   * @type {Modifier}
   */
  const modifiers = {};

  for (let index = 1; index < parts.length; index++) {
    const modifier = parts[index].trim();

    if (!parts[index].trim()) {
      continue;
    }

    // First we check for the simple modifiers
    switch (modifier) {
      case "once":
      case "prevent":
      case "capture":
      case "passive": {
        modifiers[modifier] = true;
        continue;
      }
    }

    // If we get here, it's a more complex modifier
    const complexPart = modifier.split(":");
    const name = complexPart[0];
    const value = complexPart[1];

    switch (name) {
      case "poll":
      case "delay":
      case "throttle":
      case "debounce": {
        modifiers[name] = parseInterval(value);
        continue;
      }
    }
  }

  return {
    event,
    modifiers,
  };
}
//#endregion

if (typeof window !== "undefined") {
  window.oyc = new Oyc();
}
export default Oyc;

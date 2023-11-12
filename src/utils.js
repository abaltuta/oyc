import { methodSelector, oycAttributeSelector } from "./static";

/**
 * Finds all elements within the given element that match the method selector or the OYC attribute selector.
 * @param {Element} element - The element to search within.
 * @returns {NodeList} - A list of matching elements.
 */
export function findElementsToProcess(element) {
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
export function findOnElements(parent) {
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
export function hasAttribute(element, name) {
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
export function getAttribute(element, name) {
  return element.getAttribute(name) || element.getAttribute("data-" + name);
}

const oycDataAttribute = "oyc-data";

// TODO: Figure out a way to type this
export function getData(element) {
  // An alternative to just adding this to the element is to use a WeakMap
  // I'm unsure if that would make any significant difference in performance
  // This is simpler to add 🤷‍♀️
  return element[oycDataAttribute] || {};
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
 * Adds an event listener to the given element for the specified event.
 * @param {HTMLElement} [element] - The element to add the event listener to. Defaults to the document body.
 * @param {string} eventName - The name of the event to listen for.
 * @param {EventListenerOrEventListenerObject} listener - The listener function to call when the event is triggered.
 * @param {Modifier} modifier - The trigger object that describes how to handle the event.
 */
export function addEventListener(element, eventName, listener, modifier) {
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
export function removeEventListener(element, eventName, listener) {
  element.removeEventListener(eventName, listener);
}

const _defaultTrigger = {
  event: "click",
  modifiers: undefined,
};

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
export function parseTrigger(triggerString) {
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

export function addTriggerHandler(element, listener) {
  const trigger = {
    ..._defaultTrigger,
    ...parseTrigger(getAttribute(element, "oyc-trigger"))
  }
  addEventListener(element, trigger.event, listener, trigger.modifiers);
}
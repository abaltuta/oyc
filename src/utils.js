const oycDataAttribute = "oyc-data";

// TODO: Figure out a way to type this
/**
 * @param {Node} element
 */
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
  let unit = time.replace(value.toString(), "");

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
 * @param {Element} element - The element to add the event listener to. Defaults to the document body.
 * @param {string} eventName - The name of the event to listen for.
 * @param {EventListener} listener - The listener function to call when the event is triggered.
 * @param {Modifier} [modifier] - The trigger object that describes how to handle the event.
 */
export function addEventListener(element, eventName, listener, modifier) {
  if (!modifier || Object.keys(modifier).length === 0) {
    element.addEventListener(eventName, listener);
    return;
  }

  // If there is a modifier then wrap the listener function
  const listenerWrapper = function(/** @type {Event} */ event) {
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
 * @param {Element} element - The element to remove the event listener from.
 * @param {string} eventName - The name of the event.
 * @param {EventListener} listener - The callback function to remove.
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
 * @property {boolean} [once]
 * @property {boolean} [prevent]
 * @property {number} [delay]
 * @property {number} [throttle]
 * @property {number} [debounce]
 * @property {boolean} [capture]
 * @property {boolean} [passive]
 * @property {string} [from]
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

/**
 * This function's only claim to fame is that it merges `defaultTrigger`
 *
 * @param {Element} element
 * @param {EventListener} listener
 */
export function parseAndAddTriggerHandler(element, listener) {
  const trigger = {
    ..._defaultTrigger,
    ...parseTrigger(element.getAttribute("oyc-trigger")),
  };
  addEventListener(element, trigger.event, listener, trigger.modifiers);
}

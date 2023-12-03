import { handleFetch } from "./fetch.js";
import { httpMethods, ignoreAttribute, methodSelector, oycAttributeSelector } from "./static.js";
import { addEventListener, getData, parseAndAddTriggerHandler, parseTrigger, removeEventListener } from "./utils.js";

// Reexport some utils for plugins
// TODO: Reexport more
export { parseInterval } from "./utils.js";

const onElementExpression = new XPathEvaluator().createExpression(
  "//*[@*[ starts-with(name(), \"oyc-on:\") or starts-with(name(), \"data-oyc-on:\") ] and not(@oyc-ignore) and not(@data-oyc-ignore)]",
);

export class Oyc {
  ready = document.readyState === "complete";
  on = addEventListener;
  off = removeEventListener;
  process = this.processElementAndChildren;
  getOycData = getData;
  /**
   * @type {any[]}
   */
  extensions = [];
  cssSelector = methodSelector + "," + oycAttributeSelector;

  constructor() {
    // Are we already loaded? This shouldn't happen since we recomment loading this script as a module
    if (this.ready == false) {
      document.addEventListener("readystatechange", () => {
        if (document.readyState === "complete") {
          this.ready = true;
        }
      });
    }

    this.onReady(() => {
      this.processElementAndChildren(document.body);
      // TODO: emit custom event
    });
  }

  registerExtension(extension) {
    if (extension.init) {
      extension.init(this);
    }
    this.cssSelector += extension.attribute
      ? ",[" + extension.attribute + "]"
      : ","
        + extension.attributes
          .map((/** @type {string} */ attribute) => "[" + attribute + "]")
          .join(",");
    this.extensions.push(extension);
  }

  /**
   * Execute a function now if DOMContentLoaded has fired, otherwise listen for it.
   * @param { () => void } fn
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

  /**
   * Adds OYC specific listeners
   *
   * Note: this doesn't handle `oyc-on`. If you want that behavior please use `processElementAndChildren`
   * or `addCustomEventListeners`
   * This is because that uses a totally different selction mechanism
   *
   * @param {Element} element
   */
  processElement(element) {
    // Process HTTP Attributes
    this.processHTTPAttributes(element);

    for (let index = 0; index < this.extensions.length; index++) {
      this.extensions[index].process(element);
    }
  }

  /**
   * Adds all custom event handlers on an element and its children
   * Ex:
   * - oyc-on:click="topLevelFunctionName"
   * - oyc-on:click="topLevelFunctionName" oyc-trigger="click delay:2s"
   *
   * @param {Element} element
   */
  addCustomEventListeners(element) {
    /**
     * Find all the elements and add event handlers.
     */
    const elements = this.findOnElements(element);
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];

      for (let index = 0; index < element.attributes.length; index++) {
        const attribute = element.attributes[index];
        if (
          attribute.name.startsWith("oyc-on:")
          || attribute.name.startsWith("data-oyc-on:")
        ) {
          const event = attribute.name.slice(attribute.name.indexOf(":") + 1);
          const listener = attribute.value;

          // TODO: there is a limitation here in that we can't easily add event listeners
          // when the listener is a function that is not a top-level function or when used inside
          // another ES Module

          // Yes, we only support top-level functions.
          // No, we will not support eval.
          const trigger = parseTrigger(element.getAttribute("oyc-trigger"));
          if (trigger) {
            addEventListener(
              element,
              trigger.event,
              window[listener],
              trigger.modifiers,
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
  processElementAndChildren(element) {
    // TODO: Add extra initialization for node like data
    // TODO: Add hook for custom initialization per-node

    if (element.getAttribute(ignoreAttribute)) {
      return;
    }

    // Remove existing event listeners
    // This may not be needed if we keep a hash of custom listeners
    this.processElement(element);

    const children = this.findOycChildren(element);
    for (let i = 0; i < children.length; i++) {
      this.processElement(children[i]);
    }

    // It may be worth moving this inside processElement, but here the selector is very different
    this.addCustomEventListeners(element);
  }

  /**
   * Finds all elements within the given element that match the method selector or the OYC attribute selector.
   * @param {Element} parent - The element to search within.
   * @returns {NodeListOf<Element>} - A list of matching elements.
   */
  findOycChildren(parent) {
    return parent.querySelectorAll(this.cssSelector);
  }

  /**
   * Finds all elements within a given element that have an attribute starting with "oyc-on:" or "data-oyc-on:"
   * @param {Element} parent - The root element to start searching from. Defaults to the entire document.
   * @returns {Element[]} An array of matching nodes
   */
  findOnElements(parent) {
    // TODO: Check for faster alternatives
    const xpathResults = onElementExpression.evaluate(
      parent,
      4, // UNORDERED_NODE_ITERATOR_TYPE
    );

    let element = null;
    const elements = [];

    /**
     * To the best of my knowledge, all possible results are Elements.
     * Here's a list of possible Nodes that are not Elements - none of these can have attributes:
     * Text, Comment, Document, DocumentFragment
     */
    while ((element = xpathResults.iterateNext())) {
      elements.push(element);
    }
    return /** @type {Element[]} */ (elements);
  }

  /**
   * @param {Element} element
   */
  processHTTPAttributes(element) {
    for (let index = 0; index < httpMethods.length; index++) {
      const url = element.getAttribute("oyc-" + httpMethods[index]);
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
            (event.target),
            this.processElementAndChildren.bind(this), // TODO: allow us to set a different target for the swap
          );
        });
      }
    }
  }
}

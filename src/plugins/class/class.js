import { parseInterval } from "oyc";

/**
 * A classes attribute value consists of “runs”, which are separated by an & character. All class operations within a given run will be applied sequentially, with the delay specified.

Within a run, a , character separates distinct class operations.

A class operation is an operation name add, remove, or toggle, followed by a CSS class name, optionally followed by a colon : and a time delay.
 */
export function processClassString(element, classString) {
  const runs = classString.split('&');

  for (let i = 0; i < runs.length; i++) {
    const operations = runs[i].split(',');
    let totalDelay = 0;

    for (let j = 0; j < operations.length; j++) {
      const [action, className, delay = 0] = operations[j].split(':');
      totalDelay += parseInterval(delay);

      setTimeout(() => {
        if (action === 'add') {
          element.classList.add(className);
        } else if (action === 'remove') {
          element.classList.remove(className);
        } else if (action === 'toggle') {
          element.classList.toggle(className);
        }
      }, totalDelay);
    }
  }
}

console.log("kurwa")
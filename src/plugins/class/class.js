import { parseInterval } from "oyc";

export const attribute = "oyc-class";
/**
 * A classes attribute value consists of “runs”, which are separated by an & character. All class operations within a given run will be applied sequentially, with the delay specified.
 *
 * Within a run, a , character separates distinct class operations.
 *
 * A class operation is an operation name add, remove, or toggle, a colon, a CSS class name, optionally followed by a colon : and a time delay.
 * @param {Element} element
 */
export function processClassString(element) {
  const classAttr = element.getAttribute(attribute);
  if (!classAttr) {
    return;
  }
  const runs = classAttr.split("&");

  for (let i = 0; i < runs.length; i++) {
    const operations = runs[i].split(",");
    let totalDelay = 0;

    for (let j = 0; j < operations.length; j++) {
      const [action, className, delayStr] = operations[j].split(":");
      const delay = delayStr ? parseInterval(delayStr) : 0;

      if (action === "toggle") {
        setTimeout(() => {
          setInterval(() => {
            element.classList.toggle(className);
          }, delay);
        }, totalDelay);
        return;
      }

      totalDelay += delay;

      setTimeout(() => {
        if (action === "add") {
          element.classList.add(className);
          return;
        } else {
          element.classList.remove(className);
        }
      }, totalDelay);
    }
  }
}

const extension = {
  name: "oyc-class",
  attribute,
  process: processClassString,
};
export default extension;

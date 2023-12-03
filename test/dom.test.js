import { describe, expect, test } from "vitest";
import { parseHTML } from "../src/dom.js";

describe("parseHTML", () => {
  test("parses HTML string into document fragment", () => {
    const htmlString = "<div>Hello, world!</div>";
    const output = parseHTML(htmlString);

    expect(output).toBeInstanceOf(DocumentFragment);
    expect(output.querySelector("div").textContent).toBe("Hello, world!");
  });

  test("parses HTML string into specified output selector", () => {
    const htmlString = "<div>Hello, world!</div><p>Paragraph</p>";
    const outputSelector = "p";
    const output = parseHTML(htmlString, outputSelector);

    expect(output).toBeInstanceOf(HTMLParagraphElement);
    expect(output.textContent).toBe("Paragraph");
  });
});

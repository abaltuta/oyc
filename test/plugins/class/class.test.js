import { afterAll } from "vitest";
import { beforeAll } from "vitest";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { addTestHTML, clearTestArea, makeTestArea } from "../../test-utils.js";

import { Oyc } from "oyc";
import classExtension from "plugins/class/class";

describe("Class Plugin", () => {
  let oyc;
  beforeEach(() => {
    makeTestArea();
  });
  afterEach(() => {
    clearTestArea();
  });
  // Looks like something upstream, we are using the beta version
  beforeAll(() => {
    oyc = new Oyc();
    oyc.registerExtension(classExtension);
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  test("should add class to element", (done) => {
    const button = addTestHTML(
      `<button oyc-class="add:testClass:100ms">Testing</button>`,
      oyc,
    );

    vi.advanceTimersByTime(1);
    expect(button.classList.contains("testClass")).toBe(false);
    vi.advanceTimersByTime(100);
    expect(button.classList.contains("testClass")).toBe(true);
  });
});

import { waitFor } from "@testing-library/dom";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { addTestHTML, clearTestArea, makeResponse, makeTestArea } from "./test-utils.js";

import { Oyc } from "oyc";

describe("fetch", () => {
  let oyc;
  /**
   * @type {SpyInstance<ReturnType<WindowOrWorkerGlobalScope["fetch"]>>}
   */
  let fetchSpy = null;
  beforeEach(() => {
    fetchSpy = vi.spyOn(window, "fetch");
    makeTestArea();
  });
  afterEach(() => {
    clearTestArea();
    vi.restoreAllMocks();
  });
  beforeAll(() => {
    oyc = new Oyc();
  });

  test("swaps innerHTML of element with response text on successful fetch", async () => {
    const responseText = "<div>New content</div>";
    fetchSpy.mockResolvedValueOnce(makeResponse(responseText));
    const element = addTestHTML(
      "<p oyc-get='/some-url'>Initial content</p>",
      oyc,
    );

    element.click();

    await waitFor(() => {
      expect(element.innerHTML).toBe(responseText);
    });
  });

  test("does not swap innerHTML of element on failed fetch", async () => {
    const responseText = "<div>New content</div>";
    fetchSpy.mockResolvedValueOnce(makeResponse(responseText, false));
    const element = addTestHTML(
      "<p oyc-get='/some-url'>Initial content</p>",
      oyc,
    );

    element.click();

    await waitFor(() => {
      expect(element.innerHTML).toBe("Initial content");
    });
  });
});

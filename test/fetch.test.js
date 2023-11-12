import { handleFetch } from "../src/fetch.js";
import { beforeEach, afterEach, describe, test, expect, vi } from "vitest";
import {
  addTestHTML,
  clearTestArea,
  makeResponse,
  makeTestArea,
} from "./test-utils.js";

describe("fetch", () => {
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

  test("swaps innerHTML of element with response text on successful fetch", async () => {
    const responseText = "<div>New content</div>";
    fetchSpy.mockResolvedValueOnce(makeResponse(responseText));
    const element = addTestHTML("<p>Initial content</p>");

    await handleFetch("get", "/some-url", element);

    expect(element.innerHTML).toBe(responseText);
  });

  test("does not swap innerHTML of element on failed fetch", async () => {
    const responseText = "<div>New content</div>";
    fetchSpy.mockResolvedValueOnce(makeResponse(responseText, false));
    const element = addTestHTML("<p>Initial content</p>");

    await handleFetch("get", "/some-url", element);

    expect(element.innerHTML).toBe("Initial content");
  });
});

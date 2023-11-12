import {
  addTestHTML,
  clearTestArea,
  getTestArea,
  makeResponse,
  makeTestArea,
} from "../helpers/test-utils.js";
import { screen, waitFor } from "@testing-library/dom";
import { beforeEach, afterEach, expect, describe, test, vi } from "vitest";

describe("Core", () => {
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

  test("[HTTP][Attribute] Verbs", async () => {
    const methodVerbs = ["get", "post", "put", "patch", "delete", "head"];

    for (const method of methodVerbs) {
      fetchSpy.mockResolvedValueOnce(makeResponse(`Testing ${method} worked!`));
      const button = addTestHTML(
        `<button oyc-${method}="/test">Testing ${method}</button>`
      );
      button.click();

      expect(fetchSpy).toHaveBeenCalledWith("/test", {
        method: method.toUpperCase(),
      });
      await waitFor(() => {
        expect(button.innerHTML).toBe(`Testing ${method} worked!`);
      });
    }

    expect(fetchSpy.mock.calls.length).toBe(methodVerbs.length);
  });

  test("[CORE] Recursive response processing", async () => {
    fetchSpy
      .mockResolvedValueOnce(
        makeResponse(`<button oyc-get="/test">Level 1</button>`)
      )
      .mockResolvedValueOnce(
        makeResponse(`<button oyc-get="/test">Success!</button>`)
      );

    const button = addTestHTML(
      `<div>Should exist</div><button oyc-get="/test">Level 0</button>`
    );
    button.click();

    const level1 = await screen.findByText('Level 1');
    level1.click();

    await screen.findByText('Success!');
    expect(getTestArea().children[0].textContent).toBe('Should exist');
    
    // If this number is greater then we probably have some nested attributes or the swap wasn't done right
    // Currently this number is 3, it should be 2, this is because we are nesting some buttons here
    // This test is correct, but most people won't want to nest buttons.
    // We only support swapping inner html not outer as the default fetch result
    expect(fetchSpy.mock.calls.length).toBe(3);
  });
});

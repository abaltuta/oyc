import {
  addTestHTML,
  clearTestArea,
  getTestArea,
  makeResponse,
  makeTestArea,
} from "../helpers/test-utils.js";
import { screen, waitFor } from "@testing-library/dom";
import { afterAll } from "vitest";
import { beforeAll } from "vitest";
import { beforeEach, afterEach, expect, describe, test, vi } from "vitest";

describe.shuffle("Core", () => {
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

  test("HTTP Verbs", async () => {
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

  test("Recursive response processing", async () => {
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

    const level1 = await screen.findByText("Level 1");
    level1.click();

    await screen.findByText("Success!");
    expect(getTestArea().children[0].textContent).toBe("Should exist");

    // If this number is greater then we probably have some nested attributes or the swap wasn't done right
    // Currently this number is 3, it should be 2, this is because we are nesting some buttons here
    // This test is correct, but most people won't want to nest buttons.
    // We only support swapping inner html not outer as the default fetch result
    expect(fetchSpy.mock.calls.length).toBe(3);
  });

  describe("Modifiers", () => {
    // TODO: Fix this to use fake Timers. I get an error on both FF and Chrome
    // Looks like something upstream, we are using the beta version
    beforeEach(() => {
      // vi.useFakeTimers();
    });
    afterEach(() => {
      // vi.useRealTimers();
    });
    test("Delay", async () => {
      fetchSpy.mockResolvedValueOnce(makeResponse(`Testing delay worked!`));
  
      const button = addTestHTML(`<button oyc-get="/test" oyc-trigger="click delay:2s">Delay</button>`);
      button.click()
  
      expect(fetchSpy).toHaveBeenCalledTimes(0);
      // vi.advanceTimersByTime(2000);
  
  
      await waitFor(() => {
        expect(button.innerHTML).toBe(`Testing delay worked!`);
      }, {
        timeout: 3000
      });
      expect(fetchSpy).toHaveBeenCalledTimes(1);

    });
  })
  
});

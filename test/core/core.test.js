import {
  addTestHTML,
  clearTestArea,
  makeResponse,
  makeTestArea,
} from "../helpers/test-utils.js";
import { waitFor } from "@testing-library/dom";
import {
  beforeEach,
  afterEach,
  expect,
  describe,
  test,
  vi,
} from "vitest";

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

  test("handles http verbs properly", async function (done) {

    const methodVerbs = ["get", "post", "put", "patch", "delete", "head"];

    for (const method of methodVerbs) {
    fetchSpy.mockResolvedValueOnce(makeResponse(`Testing ${method} worked!`));
      const button = addTestHTML(
        `<button oyc-${method}="/test">Testing ${method}</button>`
      );
      button.click();

      expect(fetchSpy).toHaveBeenCalledWith("/test", { method: method.toUpperCase() });
      await waitFor(() => {
        expect(button.innerHTML).toBe(`Testing ${method} worked!`);
      });
    }

    expect(fetchSpy.mock.calls.length).toBe(methodVerbs.length);
  });
});

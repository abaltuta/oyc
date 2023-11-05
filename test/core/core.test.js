import {
  addTestHTML,
  clearTestArea,
  makeResponse,
  makeTestArea,
} from "../helpers/test-utils.js";
import Oyc from "oyc";

describe("Core", () => {
  let fetchSpy = null;
  beforeAll(() => {
    fetchSpy = spyOn(window, "fetch");
  });
  afterAll(() => {
    console.log(fetchSpy);
    fetchSpy.calls.reset();
  });
  beforeEach(() => {
    makeTestArea();
  });
  afterEach(() => {
    clearTestArea();
  });

  it("handles basic get properly", function (done) {
    const response = makeResponse("It worked!");
    fetchSpy.and.resolveTo(response);

    const button = addTestHTML('<button oyc-get="/test">Click Me!</button>');
    button.click();

    // Wait for the fetch promise to resolve
    setTimeout(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/test", { method: "GET" });
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(button.innerHTML).toBe("It worked!");
      done(); // Signal Jasmine that the async test is complete
    }, 1)
  });

  it("handles basic post properly", function (done) {
    const response = makeResponse("It worked!");
    fetchSpy.and.resolveTo(response);

    const button = addTestHTML('<button oyc-post="/test">Click Me!</button>');
    button.click();

    // Wait for the fetch promise to resolve
    setTimeout(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/test", { method: "POST" });
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(button.innerHTML).toBe("It worked!");
      done(); // Signal Jasmine that the async test is complete
    }, 1)
  });
});

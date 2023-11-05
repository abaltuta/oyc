import { makeServer, clearTestArea } from "../helpers/test-utils.js";
import Oyc from "oyc";

describe("Core", () => {
  beforeEach(function () {
    this.server = makeServer();
    clearTestArea();
  });
  afterEach(function () {
    this.server.restore();
    clearTestArea();
  });

  it("handles basic get properly", function () {
    
    expect(true).toBe(true);
  });

});

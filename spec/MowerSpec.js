var MowerFile = require("../Mower");
describe("A mower", function () {
  beforeEach(function () {
    this.mower = new MowerFile.Mower(1, 2, "E", "RFLFR");
  });
  it("should initiate a mower", function () {
    expect(this.mower).toEqual(
      jasmine.objectContaining({
        x: 1,
        y: 2,
        orientation: "E",
        actions: "RFLFR",
      })
    );
  });
});

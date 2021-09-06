// TODO: Write tests with input file and expected output file, and errors thrown in different cases
// See : https://jasmine.github.io/tutorials/your_first_suite
let fs = require("fs");
let AppFile = require("../app");
describe("The application", function () {

  it("should read the correct input file and output the correct answer", function () {
    AppFile.startApp("spec/good-mower-input.txt");
    fs.readFile("./mower-output.txt", "utf8", (err, data) => {
      expect(data).toEqual("1 3 N\r\n5 1 E");
    });
  });

  it("should be false for an incorrect input file", function () {
    const test = AppFile.startApp("spec/bad-mower-input.txt");
    expect(test).toBeFalse();
  });

  it("should be true for a correct input file", function () {
    const test = AppFile.startApp("spec/good-mower-input.txt");
    expect(test).toBeTrue();
  });
});

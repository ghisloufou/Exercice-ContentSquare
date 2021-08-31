// TODO: Write tests with input file and expected output file, and errors thrown in different cases
// See : https://jasmine.github.io/tutorials/your_first_suite
describe("A suite is just a function", function () {
  var a;

  it("and so is a spec", function () {
    a = true;

    expect(a).toBe(true);
  });
});

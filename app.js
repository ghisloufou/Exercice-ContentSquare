"use strict";
exports.__esModule = true;
var process_1 = require("process");
console.log("Hello");
process_1.argv.forEach(function (val, index) {
    console.log(index + ": " + val);
});
console.log(process_1.argv);
console.log(process_1.argv.length);
if (process_1.argv.length <= 2) {
    console.log("Not enough arguments");
    console.log("aborting...");
}

"use strict";
exports.__esModule = true;
exports.moveMowers = exports.initMap = exports.startApp = void 0;
var fs = require("fs");
var Mower_1 = require("./Mower");
startApp();
function startApp(fileToRead) {
    if (fileToRead === void 0) { fileToRead = "mower-input.txt"; }
    try {
        fs.readFile("./" + fileToRead, "utf8", function (err, data) {
            var lines = data.split("\r\n");
            var mapSize = lines
                .shift()
                .split(" ")
                .map(function (item) {
                if (+item === NaN) {
                    throw new Error("Map size error");
                }
                return +item;
            });
            var isEven = function (n) {
                return n % 2 == 0;
            };
            if (!isEven(lines.length)) {
                throw new Error("Mower input not valid");
            }
            var mowers = [];
            // Read each mower lines and create mowers:
            for (var i = 0; i <= lines.length / 2; i += 2) {
                var mowerProperties = lines[i].split(" ");
                mowerProperties[0] = +mowerProperties[0];
                mowerProperties[1] = +mowerProperties[1];
                var validProperties = function (properties) {
                    return (typeof properties[0] === "number" &&
                        properties[0] > 0 &&
                        properties[0] <= mapSize[0] &&
                        typeof properties[1] === "number" &&
                        properties[1] > 0 &&
                        properties[1] <= mapSize[1] &&
                        typeof properties[2].match("^[NESW]$"));
                };
                if (validProperties(mowerProperties)) {
                    mowers.push(new Mower_1.Mower(+mowerProperties[0], +mowerProperties[1], mowerProperties[2], lines[i + 1]));
                }
                else {
                    throw new Error("Invalid input");
                }
            }
            var emptyMap = initMap(mapSize[0], mapSize[1], mowers);
            var movedMowers = moveMowers(emptyMap, mapSize[0], mapSize[1], mowers);
            console.log("movedMowers", movedMowers);
            fs.writeFile("./mower-output.txt", movedMowers
                .map(function (mower) { return mower.x + " " + mower.y + " " + mower.orientation; })
                .join("\r\n"), function (err) {
                if (err)
                    return console.log(err);
            });
            console.log('Script ended successfully, open "mower-output.txt" to see results.');
        });
        return true;
    }
    catch (error) {
        console.error("An error has occured:", error);
        return false;
    }
}
exports.startApp = startApp;
/**
 * Create the map with data from input file
 */
function initMap(width, height, mowers) {
    var map = Array(height + 1)
        .fill(null)
        .map(function (a, i) {
        return Array(width + 1)
            .fill(null)
            .map(function (b, j) { return null; });
    });
    // Populate map with mower's first position
    mowers.forEach(function (mower) {
        if (map[mower.x][mower.y] !== null) {
            throw new Error("Mowers are overlapping");
        }
        map[mower.x][mower.y] = mower;
    });
    return map;
}
exports.initMap = initMap;
/**
 * Move all the moveMowers and returns the new map
 */
function moveMowers(map, width, height, mowers) {
    // Update mowers' position
    var updateMap = function (mower, index) {
        var nextCell = mower.getNextPosition(index);
        // Verify if next move is valid
        if (nextCell.x >= 0 &&
            nextCell.x <= width &&
            nextCell.y >= 0 &&
            nextCell.y <= height &&
            map[nextCell.x][nextCell.y] === null) {
            map[mower.x][mower.y] = null;
            mower.updateMowerPosition(nextCell.x, nextCell.y, index);
            map[nextCell.x][nextCell.y] = mower;
        }
        else {
            mower.updateMowerPosition(mower.x, mower.y, index);
        }
    };
    mowers.forEach(function (mower) {
        for (var index = 0; index < mower.actions.length; index++) {
            updateMap(mower, index);
        }
    });
    return mowers;
}
exports.moveMowers = moveMowers;

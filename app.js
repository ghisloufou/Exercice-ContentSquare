"use strict";
exports.__esModule = true;
var fs = require("fs");
var lodash_1 = require("lodash");
var Mower_1 = require("./Mower");
console.log("____________________________");
fs.readFile("./mower-input.txt", "utf8", function (err, data) {
    try {
        var lines = data.split("\r\n");
        console.log("lines\n", lines);
        var mapSize_1 = lines
            .shift()
            .split(" ")
            .map(function (item) {
            if (typeof +item !== "number") {
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
        console.log("mapSize", mapSize_1);
        // const mowerTest = new Mower(1, 2, 3, "EFN");
        var mowers = [];
        for (var i = 0; i <= lines.length / 2; i += 2) {
            var mowerProperties = lines[i].split(" ");
            mowerProperties[0] = +mowerProperties[0];
            mowerProperties[1] = +mowerProperties[1];
            var validProperties = function (properties) {
                return (typeof properties[0] === "number" &&
                    properties[0] > 0 &&
                    properties[0] <= mapSize_1[0] &&
                    typeof properties[1] === "number" &&
                    properties[1] > 0 &&
                    properties[1] <= mapSize_1[1] &&
                    typeof properties[2].match("^[NESW]$"));
            };
            if (validProperties(mowerProperties)) {
                mowers.push(new Mower_1.Mower(+mowerProperties[0], +mowerProperties[1], mowerProperties[2], lines[i + 1]));
            }
            else {
                throw new Error("Invalid input");
            }
        }
    }
    catch (error) {
        console.error("An error has occured:", error);
    }
    fs.writeFile("./mower-output.txt", "test", function (err) {
        if (err)
            return console.log(err);
    });
});
/**
 * Creates an grass map with parsed data from input file
 * @param {any[]} parsedData Parsed data from input file
 * @returns {"TreasureMap"} Basic map with only grass cells
 */
var initMap = function (parsedData) {
    var cLine = parsedData.filter(function (line) {
        return line[0] === "C";
    })[0];
    var width = Number(cLine[1]);
    var height = Number(cLine[2]);
    var matrix = Array(height)
        .fill(null)
        .map(function (a, i) {
        return Array(width)
            .fill(null)
            .map(function (b, j) {
            return { type: "Grass", x: j + 1, y: i + 1 };
        });
    });
    return { matrix: matrix, height: height, width: width };
};
/**
 * Move all the players and returns the new map, parsedData and possible movementErrors
 * @param {"TreasureMap"} map Generated map from input file
 * @param {any[]} parsedData Parsed data from input file
 * @returns {{ transformedMap: "TreasureMap", newParsedData: any[], movementError: boolean }} {transformedMap, newParsedData, movementError}
 */
var movePlayers = function (map, parsedData) {
    var newParsedData = (0, lodash_1.cloneDeep)(parsedData);
    var cLine = newParsedData.filter(function (line) { return line[0] === "C"; })[0];
    var players = newParsedData.filter(function (line) { return line[0] === "A"; });
    var newMap = (0, lodash_1.cloneDeep)(map);
    var movementError = false; // Check wheter the player sequence is feasible
    var updateMap = function (player, nextMovement, index) {
        var nextCell = newMap.matrix[nextMovement.player[3]][nextMovement.player[2]];
        var lastCell = newMap.matrix[player[3]][player[2]];
        if (nextMovement.didMove) {
            // Edit new cell
            if (nextCell.type === "Treasure" && nextCell.treasureCount > 1) {
                nextCell.type = "Treasure&Player";
                nextCell.playerValue = lastCell.playerValue + 1;
                nextCell.treasureCount -= 1;
            }
            else {
                nextCell.playerValue = lastCell.playerValue;
                if (nextCell.type === "Treasure" && nextCell.treasureCount === 1) {
                    delete nextCell.treasureCount;
                    nextCell.playerValue += +1;
                }
                nextCell.type = "Player";
            }
            nextCell.name = lastCell.name;
            nextCell.sequence = lastCell.sequence;
            switch (player[4]) {
                case "S":
                    nextCell.orientation = 0;
                    break;
                case "E":
                    nextCell.orientation = -90;
                    break;
                case "O":
                    nextCell.orientation = 90;
                    break;
                case "N":
                    nextCell.orientation = 180;
                    break;
            }
            // Edit last cell
            if (lastCell.type === "Treasure&Player" && lastCell.treasureCount > 0) {
                lastCell.type = "Treasure";
            }
            else {
                lastCell.type = "WasPlayer";
                lastCell.lastPlayerName = nextCell.name;
                delete lastCell.treasureCount;
            }
            delete lastCell.name;
            delete lastCell.orientation;
            delete lastCell.sequence;
            delete lastCell.playerValue;
        }
        lastCell.stepCount = index;
        nextCell.stepCount = index + 1;
    };
    var moving = true;
    var i = 0;
    var stopCount = 0;
    while (moving) {
        for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
            var player = players_1[_i];
            if (player[5].length > i) {
                var nextMove = player[5][i];
                if (["A", "G", "D"].includes(nextMove)) {
                    var movement = this.move(player, nextMove, cLine, newMap);
                    updateMap(player, movement, i);
                    players[players.indexOf(player)] = (0, lodash_1.cloneDeep)(movement.player);
                }
                else {
                    movementError = true;
                    moving = false;
                }
            }
            else {
                stopCount++;
            }
        }
        if (stopCount === players.length) {
            moving = false;
        }
        i++;
    }
    return { transformedMap: newMap, newParsedData: newParsedData, movementError: movementError };
};

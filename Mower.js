"use strict";
exports.__esModule = true;
exports.Mower = void 0;
var lodash_1 = require("lodash");
var Mower = /** @class */ (function () {
    function Mower(x, y, orientation, actions) {
        /**
         * Validate data according to lineRules
         * @param {any[]} parsedData Parsed data from input file
         * @returns {boolean} Boolean if data is conform to lineRules and other checks
         */
        this.validateData = function (parsedData) {
            var _this = this;
            var respectedRules = parsedData.every(function (line) {
                var relatedRule = _this.lineRules.find(function (rule) {
                    return rule.letter === line[0] && rule.arguments === line.length - 1;
                });
                if (relatedRule !== undefined) {
                    return relatedRule.argumentsType.every(function (type, index) {
                        return typeof line[index + 1] === type;
                    });
                }
                else {
                    return false;
                }
            });
            var noOverlap = parsedData.filter(function (line, index) {
                return (parsedData.slice(index + 1).filter(function (line2) {
                    return line[1] === line2[1] && line[2] === line2[2];
                }).length > 0);
            }).length === 0;
            var hasOneAndOnlyOneValidCLine = parsedData.filter(function (line, index) {
                return line[0] === "C" && line[1] >= 0 && line[2] >= 0;
            }).length === 1;
            var noOutOfBounds = function () {
                if (hasOneAndOnlyOneValidCLine) {
                    var cLine_1 = parsedData.filter(function (line, index) {
                        return line[0] === "C";
                    });
                    return (parsedData.filter(function (line, index) {
                        if (["C", "T", "M"].includes(line[0])) {
                            return (line[1] < 0 &&
                                line[1] > cLine_1[1] &&
                                line[2] < 0 &&
                                line[2] > cLine_1[2]);
                        }
                        else if (line[0] === "A") {
                            return (line[2] < 0 &&
                                line[2] > cLine_1[1] &&
                                line[3] < 0 &&
                                line[3] > cLine_1[2]);
                        }
                        return false;
                    }).length === 0);
                }
                return false;
            };
            return (respectedRules &&
                noOverlap &&
                noOutOfBounds() &&
                hasOneAndOnlyOneValidCLine);
        };
        /**
         * Returns player new coordinates (if move was possible), boolean if next cell is a treasure and boolean if player did move
         * @param {["A", string, number, number, string, string]} player Player line from input file
         * @param {string} nextMove Next move in the sequence ("A", "G" or "D")
         * @param {["C", number, number]} cLine Map line from input file
         * @param {"TreasureMap"} newMap Modified map with data and last player movements
         * @returns {{player: "Player", isTreasure: boolean, didMove: boolean}} {player, isTreasure, didMove}
         */
        this.move = function (playerArg, nextMove, cLine, newMap) {
            var movedPlayer = (0, lodash_1.cloneDeep)(playerArg);
            var isNextMoveValid = function (x, y, moveX, moveY) {
                var isNotOutOfBound = x + moveX < cLine[1] &&
                    x + moveX >= 0 &&
                    y + moveY < cLine[2] &&
                    y + moveY >= 0;
                if (isNotOutOfBound) {
                    var nextCell = newMap.matrix[y + moveY][x + moveX];
                    var isMountain = nextCell.type === "Mountain";
                    var isPlayer = nextCell.type === "Player" || nextCell.type === "Treasure&Player";
                    return !isMountain && !isPlayer;
                }
                return false;
            };
            var nextMoveTreasure = function (x, y, moveX, moveY) {
                return newMap.matrix[y + moveY][x + moveX].type === "Treasure";
            };
            var movePlayer = function (player, moveX, moveY) {
                var didMove = false;
                var isTreasure = nextMoveTreasure(player[2], player[3], moveX, moveY);
                if (isNextMoveValid(player[2], player[3], moveX, moveY)) {
                    player[2] += moveX;
                    player[3] += moveY;
                    didMove = true;
                }
                return {
                    player: player,
                    isTreasure: isTreasure,
                    didMove: didMove
                };
            };
            var movement = { player: movedPlayer, isTreasure: false, didMove: false };
            switch (nextMove) {
                case "A":
                    // Check whether the next case is not out of bounds, nor a mountain, nor a player then IGNORE THESE MOVES
                    switch (movedPlayer[4]) {
                        case "N":
                            movement = movePlayer(movedPlayer, 0, -1);
                            break;
                        case "O":
                            movement = movePlayer(movedPlayer, -1, 0);
                            break;
                        case "S":
                            movement = movePlayer(movedPlayer, 0, 1);
                            break;
                        case "E":
                            movement = movePlayer(movedPlayer, 1, 0);
                            break;
                    }
                    break;
                case "G":
                    // Change orientation to the left
                    switch (movedPlayer[4]) {
                        case "N":
                            movedPlayer[4] = "O";
                            break;
                        case "O":
                            movedPlayer[4] = "S";
                            break;
                        case "S":
                            movedPlayer[4] = "E";
                            break;
                        case "E":
                            movedPlayer[4] = "N";
                            break;
                    }
                    break;
                case "D":
                    // Change orientation to the right
                    switch (movedPlayer[4]) {
                        case "N":
                            movedPlayer[4] = "E";
                            break;
                        case "E":
                            movedPlayer[4] = "S";
                            break;
                        case "S":
                            movedPlayer[4] = "O";
                            break;
                        case "O":
                            movedPlayer[4] = "N";
                            break;
                    }
                    break;
            }
            return movement;
        };
        this.x = x;
        this.y = y;
        this.orientation = orientation;
        this.actions = actions;
        this.verifyInput();
        console.log("new Mower:", x, y, orientation, actions);
    }
    /**
     * Execute next mower action
     */
    Mower.prototype.executeNextAction = function (index) {
        var nextAction = this.actions[index];
        //code
    };
    /**
     * Verify if inputs are valid
     */
    Mower.prototype.verifyInput = function () {
        if (this.actions === "" ||
            !this.actions.match("^[RLF]*$") ||
            !this.orientation.match("^[NESW]$")) {
            throw new Error("Mower input not valid");
        }
        else {
            //code
        }
    };
    return Mower;
}());
exports.Mower = Mower;

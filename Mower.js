"use strict";
exports.__esModule = true;
exports.Mower = void 0;
var Mower = /** @class */ (function () {
    function Mower(x, y, orientation, actions) {
        this.x = x;
        this.y = y;
        this.orientation = orientation;
        this.actions = actions;
        this.verifyInput();
        console.log("New mower created:", this);
    }
    /**
     * Verify if inputs are valid
     */
    Mower.prototype.verifyInput = function () {
        if (this.actions === "" ||
            !this.actions.match("^[RLF]*$") ||
            !this.orientation.match("^[NESW]$")) {
            throw new Error("Mower input not valid");
        }
    };
    /**
     * Update Mower's position
     */
    Mower.prototype.updateMowerPosition = function (x, y, index) {
        this.x = x;
        this.y = y;
        var nextAction = this.actions[index];
        switch (nextAction) {
            case "R":
                switch (this.orientation) {
                    case "N":
                        this.orientation = "E";
                        break;
                    case "E":
                        this.orientation = "S";
                        break;
                    case "S":
                        this.orientation = "W";
                        break;
                    case "W":
                        this.orientation = "N";
                        break;
                }
                break;
            case "L":
                switch (this.orientation) {
                    case "N":
                        this.orientation = "W";
                        break;
                    case "E":
                        this.orientation = "N";
                        break;
                    case "S":
                        this.orientation = "E";
                        break;
                    case "W":
                        this.orientation = "S";
                        break;
                }
                break;
        }
    };
    /**
     * Get next potential position of the mower according to it's next move
     */
    Mower.prototype.getNextPosition = function (index) {
        var nextAction = this.actions[index];
        switch (nextAction) {
            case "R":
            case "L":
                return { x: this.x, y: this.y };
            case "F":
                var nextX = 0;
                var nextY = 0;
                switch (this.orientation) {
                    case "N":
                        nextY = 1;
                        break;
                    case "E":
                        nextX = 1;
                        break;
                    case "S":
                        nextY = -1;
                        break;
                    case "W":
                        nextX = -1;
                        break;
                    default:
                        throw new Error("Invalid orientation: " + this.orientation);
                }
                return { x: this.x + nextX, y: this.y + nextY };
            default:
                throw new Error("Invalid action: " + nextAction);
        }
    };
    return Mower;
}());
exports.Mower = Mower;

import { cloneDeep } from "lodash";
export class Mower {
  x: number;
  y: number;
  orientation: string;
  actions: string;

  constructor(x: number, y: number, orientation: string, actions: string) {
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
  executeNextAction(index: number) {
    const nextAction = this.actions[index];
    //code
  }

  /**
   * Verify if inputs are valid
   */
  verifyInput() {
    if (
      this.actions === "" ||
      !this.actions.match("^[RLF]*$") ||
      !this.orientation.match("^[NESW]$")
    ) {
      throw new Error("Mower input not valid");
    } else {
      //code
    }
  }

  /**
   * Validate data according to lineRules
   * @param {any[]} parsedData Parsed data from input file
   * @returns {boolean} Boolean if data is conform to lineRules and other checks
   */
  validateData = function (parsedData) {
    let respectedRules = parsedData.every((line) => {
      let relatedRule = this.lineRules.find((rule) => {
        return rule.letter === line[0] && rule.arguments === line.length - 1;
      });
      if (relatedRule !== undefined) {
        return relatedRule.argumentsType.every((type, index) => {
          return typeof line[index + 1] === type;
        });
      } else {
        return false;
      }
    });

    let noOverlap =
      parsedData.filter((line, index) => {
        return (
          parsedData.slice(index + 1).filter((line2) => {
            return line[1] === line2[1] && line[2] === line2[2];
          }).length > 0
        );
      }).length === 0;

    let hasOneAndOnlyOneValidCLine =
      parsedData.filter((line, index) => {
        return line[0] === "C" && line[1] >= 0 && line[2] >= 0;
      }).length === 1;

    let noOutOfBounds = () => {
      if (hasOneAndOnlyOneValidCLine) {
        let cLine = parsedData.filter((line, index) => {
          return line[0] === "C";
        });
        return (
          parsedData.filter((line, index) => {
            if (["C", "T", "M"].includes(line[0])) {
              return (
                line[1] < 0 &&
                line[1] > cLine[1] &&
                line[2] < 0 &&
                line[2] > cLine[2]
              );
            } else if (line[0] === "A") {
              return (
                line[2] < 0 &&
                line[2] > cLine[1] &&
                line[3] < 0 &&
                line[3] > cLine[2]
              );
            }
            return false;
          }).length === 0
        );
      }
      return false;
    };

    return (
      respectedRules &&
      noOverlap &&
      noOutOfBounds() &&
      hasOneAndOnlyOneValidCLine
    );
  };

  /**
   * Returns player new coordinates (if move was possible), boolean if next cell is a treasure and boolean if player did move
   * @param {["A", string, number, number, string, string]} player Player line from input file
   * @param {string} nextMove Next move in the sequence ("A", "G" or "D")
   * @param {["C", number, number]} cLine Map line from input file
   * @param {"TreasureMap"} newMap Modified map with data and last player movements
   * @returns {{player: "Player", isTreasure: boolean, didMove: boolean}} {player, isTreasure, didMove}
   */
  move = function (playerArg, nextMove, cLine, newMap) {
    const movedPlayer = cloneDeep(playerArg);

    const isNextMoveValid = function (x, y, moveX, moveY) {
      let isNotOutOfBound =
        x + moveX < cLine[1] &&
        x + moveX >= 0 &&
        y + moveY < cLine[2] &&
        y + moveY >= 0;
      if (isNotOutOfBound) {
        const nextCell = newMap.matrix[y + moveY][x + moveX];
        let isMountain = nextCell.type === "Mountain";
        let isPlayer =
          nextCell.type === "Player" || nextCell.type === "Treasure&Player";
        return !isMountain && !isPlayer;
      }
      return false;
    };

    const nextMoveTreasure = function (x, y, moveX, moveY) {
      return newMap.matrix[y + moveY][x + moveX].type === "Treasure";
    };

    const movePlayer = function (player, moveX, moveY) {
      let didMove = false;
      const isTreasure = nextMoveTreasure(player[2], player[3], moveX, moveY);
      if (isNextMoveValid(player[2], player[3], moveX, moveY)) {
        player[2] += moveX;
        player[3] += moveY;
        didMove = true;
      }
      return {
        player,
        isTreasure,
        didMove,
      };
    };

    let movement = { player: movedPlayer, isTreasure: false, didMove: false };

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
}

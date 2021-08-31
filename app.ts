import * as fs from "fs";
import { cloneDeep } from "lodash";
import { Mower } from "./Mower";
console.log("____________________________");

fs.readFile("./mower-input.txt", "utf8", function (err, data) {
  try {
    let lines = data.split("\r\n");
    console.log("lines\n", lines);
    const mapSize = lines
      .shift()
      .split(" ")
      .map((item) => {
        if (typeof +item !== "number") {
          throw new Error("Map size error");
        }
        return +item;
      });
    const isEven = (n: number) => {
      return n % 2 == 0;
    };
    if (!isEven(lines.length)) {
      throw new Error("Mower input not valid");
    }
    console.log("mapSize", mapSize);
    // const mowerTest = new Mower(1, 2, 3, "EFN");
    let mowers: Mower[] = [];
    for (let i = 0; i <= lines.length / 2; i += 2) {
      const mowerProperties: any[] = lines[i].split(" ");
      mowerProperties[0] = +mowerProperties[0];
      mowerProperties[1] = +mowerProperties[1];
      const validProperties = (properties) => {
        return (
          typeof properties[0] === "number" &&
          properties[0] > 0 &&
          properties[0] <= mapSize[0] &&
          typeof properties[1] === "number" &&
          properties[1] > 0 &&
          properties[1] <= mapSize[1] &&
          typeof properties[2].match("^[NESW]$")
        );
      };
      if (validProperties(mowerProperties)) {
        mowers.push(
          new Mower(
            +mowerProperties[0],
            +mowerProperties[1],
            mowerProperties[2],
            lines[i + 1]
          )
        );
      } else {
        throw new Error("Invalid input");
      }
    }
  } catch (error) {
    console.error("An error has occured:", error);
  }

  fs.writeFile("./mower-output.txt", "test", function (err) {
    if (err) return console.log(err);
  });
});

/**
 * Creates an grass map with parsed data from input file
 * @param {any[]} parsedData Parsed data from input file
 * @returns {"TreasureMap"} Basic map with only grass cells
 */
const initMap = function (parsedData) {
  let cLine = parsedData.filter(function (line) {
    return line[0] === "C";
  })[0];
  let width = Number(cLine[1]);
  let height = Number(cLine[2]);
  let matrix = Array(height)
    .fill(null)
    .map(function (a, i) {
      return Array(width)
        .fill(null)
        .map(function (b, j) {
          return { type: "Grass", x: j + 1, y: i + 1 };
        });
    });
  return { matrix, height, width };
};

/**
 * Move all the players and returns the new map, parsedData and possible movementErrors
 * @param {"TreasureMap"} map Generated map from input file
 * @param {any[]} parsedData Parsed data from input file
 * @returns {{ transformedMap: "TreasureMap", newParsedData: any[], movementError: boolean }} {transformedMap, newParsedData, movementError}
 */
const movePlayers = function (map, parsedData) {
  let newParsedData = cloneDeep(parsedData);
  let cLine = newParsedData.filter((line) => line[0] === "C")[0];
  let players = newParsedData.filter((line) => line[0] === "A");
  let newMap = cloneDeep(map);
  let movementError = false; // Check wheter the player sequence is feasible

  const updateMap = function (player, nextMovement, index) {
    const nextCell =
      newMap.matrix[nextMovement.player[3]][nextMovement.player[2]];
    const lastCell = newMap.matrix[player[3]][player[2]];
    if (nextMovement.didMove) {
      // Edit new cell
      if (nextCell.type === "Treasure" && nextCell.treasureCount > 1) {
        nextCell.type = "Treasure&Player";
        nextCell.playerValue = lastCell.playerValue + 1;
        nextCell.treasureCount -= 1;
      } else {
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
      } else {
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

  let moving = true;
  let i = 0;
  let stopCount = 0;
  while (moving) {
    for (let player of players) {
      if (player[5].length > i) {
        const nextMove = player[5][i];
        if (["A", "G", "D"].includes(nextMove)) {
          const movement = this.move(player, nextMove, cLine, newMap);
          updateMap(player, movement, i);
          players[players.indexOf(player)] = cloneDeep(movement.player);
        } else {
          movementError = true;
          moving = false;
        }
      } else {
        stopCount++;
      }
    }
    if (stopCount === players.length) {
      moving = false;
    }
    i++;
  }
  return { transformedMap: newMap, newParsedData, movementError };
};

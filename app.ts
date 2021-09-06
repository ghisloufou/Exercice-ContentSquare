import * as fs from "fs";
import { Mower } from "./Mower";

startApp();

function startApp(fileToRead = "mower-input.txt") {
  try {
    fs.readFile("./" + fileToRead, "utf8", (err, data) => {
      let lines = data.split("\r\n");
      const mapSize = lines
        .shift()
        .split(" ")
        .map((item) => {
          if (+item === NaN) {
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

      let mowers: Mower[] = [];
      // Read each mower lines and create mowers:
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

      const emptyMap = initMap(mapSize[0], mapSize[1], mowers);
      const movedMowers = moveMowers(emptyMap, mapSize[0], mapSize[1], mowers);
      console.log("movedMowers", movedMowers);

      fs.writeFile(
        "./mower-output.txt",
        movedMowers
          .map((mower) => `${mower.x} ${mower.y} ${mower.orientation}`)
          .join("\r\n"),
        (err) => {
          if (err) return console.log(err);
        }
      );
      console.log(
        'Script ended successfully, open "mower-output.txt" to see results.'
      );
    });
    return true;
  } catch (error) {
    console.error("An error has occured:", error);
    return false;
  }
}

/**
 * Create the map with data from input file
 */
function initMap(width: number, height: number, mowers: Mower[]): null[][] {
  let map = Array(height + 1)
    .fill(null)
    .map((a, i) => {
      return Array(width + 1)
        .fill(null)
        .map((b, j) => null);
    });
  // Populate map with mower's first position
  mowers.forEach((mower) => {
    if (map[mower.x][mower.y] !== null) {
      throw new Error("Mowers are overlapping");
    }
    map[mower.x][mower.y] = mower;
  });
  return map;
}

/**
 * Move all the moveMowers and returns the new map
 */
function moveMowers(
  map: any[][],
  width: number,
  height: number,
  mowers: Mower[]
): Mower[] {
  // Update mowers' position
  const updateMap = (mower: Mower, index: number) => {
    const nextCell = mower.getNextPosition(index);

    // Verify if next move is valid
    if (
      nextCell.x >= 0 &&
      nextCell.x <= width &&
      nextCell.y >= 0 &&
      nextCell.y <= height &&
      map[nextCell.x][nextCell.y] === null
    ) {
      map[mower.x][mower.y] = null;
      mower.updateMowerPosition(nextCell.x, nextCell.y, index);
      map[nextCell.x][nextCell.y] = mower;
    } else {
      mower.updateMowerPosition(mower.x, mower.y, index);
    }
  };

  mowers.forEach((mower) => {
    for (let index = 0; index < mower.actions.length; index++) {
      updateMap(mower, index);
    }
  });
  return mowers;
}

export { startApp, initMap, moveMowers };

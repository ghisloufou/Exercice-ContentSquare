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
    console.log("New mower created:", this);
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
    }
  }

  /**
   * Update Mower's position
   */
  updateMowerPosition(x: number, y: number, index: number) {
    this.x = x;
    this.y = y;
    const nextAction = this.actions[index];
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
  }

  /**
   * Get next potential position of the mower according to it's next move
   */
  getNextPosition(index: number): { x: number; y: number } {
    const nextAction = this.actions[index];
    switch (nextAction) {
      case "R":
      case "L":
        return { x: this.x, y: this.y };

      case "F":
        let nextX = 0;
        let nextY = 0;
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
  }
}

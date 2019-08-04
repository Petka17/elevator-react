/**
 *          x->
 * -1-2-3-4-5-6-7-8-9-
 *          ----1----> onTheWayFloors
 * <--------2--------- onTheWayBackFloors
 * ---3--------------> turnWayFloors
 */
class FloorQueue {
  private onTheWayFloors: number[] = []; // 1
  private onTheWayBackFloors: number[] = []; // 2
  private turnWayFloors: number[] = []; // 3

  /**
   * Get next floor
   */
  public get nextFloor() {
    return this.onTheWayFloors.length > 0
      ? this.onTheWayFloors[0]
      : this.onTheWayBackFloors.length > 0
      ? this.onTheWayBackFloors[0]
      : null;
  }

  public addFloors(currentFloor: number, from: number, to: number) {
    const floorDirection: Direction =
      to - from > 0 ? 1 : to - from < 0 ? -1 : 0;

    this.addFloor(currentFloor, from, floorDirection);
    this.addFloor(currentFloor, to, floorDirection, from);
  }

  /**
   * Add new floor to the queue
   * @param {number} currentFloor
   * @param {number} newFloor
   * @param {number} newFloorDirection - direction, where -1 means down, +1 means up
   */
  private addFloor(
    currentFloor: number,
    newFloor: number,
    newFloorDirection: Direction,
    fromFloor?: number
  ) {
    const nextFloor = this.nextFloor || newFloor;
    const currDirection =
      currentFloor < nextFloor ? 1 : currentFloor > nextFloor ? -1 : 0;

    if (newFloorDirection !== currDirection) {
      this.addToList(this.onTheWayBackFloors, newFloor, newFloorDirection);
    } else if (currentFloor * currDirection < newFloor * currDirection) {
      if (!fromFloor) {
        this.addToList(this.onTheWayFloors, newFloor, newFloorDirection);
      } else {
        const currToDirection =
          currentFloor < fromFloor ? 1 : currentFloor > fromFloor ? -1 : 0;
        if (currToDirection * newFloorDirection < 0) {
          this.addToList(this.turnWayFloors, newFloor, newFloorDirection);
        } else {
          this.addToList(this.onTheWayFloors, newFloor, newFloorDirection);
        }
      }
    } else {
      this.addToList(this.turnWayFloors, newFloor, newFloorDirection);
    }
  }

  public removeNextFloor() {
    if (this.onTheWayFloors.length > 0) {
      this.onTheWayFloors.splice(0, 1);
      if (this.onTheWayFloors.length === 0) {
        this.makeTurn();
      }
    } else {
      this.onTheWayBackFloors.splice(0, 1);
      this.makeTurn();
    }
  }

  private makeTurn() {
    this.onTheWayFloors = this.onTheWayBackFloors;
    this.onTheWayBackFloors = this.turnWayFloors;
    this.turnWayFloors = [];
  }

  /**
   * Add a floor to one of the arrays
   * @param {array} list one of the lists
   * @param {number} floor
   * @param {number} order -1 or 1
   */
  private addToList(list: number[], floor: number, order: number): void {
    let i;

    for (i = 0; i < list.length; i++)
      if (list[i] * order >= floor * order) break;

    if (list[i] !== floor) list.splice(i, 0, floor);
  }

  public checkNewTime(currentFloor: number, from: number, to: number): number {
    // Backup lists
    const onTheWayFloorsBackup = this.onTheWayFloors.slice();
    const onTheWayBackFloorsBackup = this.onTheWayBackFloors.slice();
    const turnWayFloorsBackup = this.turnWayFloors.slice();

    // Add floors to lists
    this.addFloors(currentFloor, from, to);

    // Calculate time
    const result = this.getTime(currentFloor);

    // Restore lists
    this.onTheWayFloors = onTheWayFloorsBackup;
    this.onTheWayBackFloors = onTheWayBackFloorsBackup;
    this.turnWayFloors = turnWayFloorsBackup;

    // Return calculated time
    return result;
  }

  private getTime(currentFloor: number): number {
    const floorQueue = [currentFloor]
      .concat(this.onTheWayFloors)
      .concat(this.onTheWayBackFloors)
      .concat(this.turnWayFloors);

    let result = 0;

    for (let i = 1; i < floorQueue.length; i++) {
      result += Math.abs(floorQueue[i] - floorQueue[i - 1]);
    }

    return result;
  }

  public toString(): string {
    return `${this.onTheWayFloors} | ${this.onTheWayBackFloors} | ${
      this.turnWayFloors
    }`;
  }
}

export default FloorQueue;

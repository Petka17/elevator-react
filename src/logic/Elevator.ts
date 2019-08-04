import FloorQueue from "./FloorQueue";

export default class Elevator {
  private currentFloor: number = 1;
  private direction: Direction = 0;
  public readonly id: number;
  private stop: boolean = true;

  private listeners: Function[] = [];
  private readonly queue: FloorQueue = new FloorQueue();

  public constructor(id: number, notifier?: Function) {
    this.id = id;
    if (notifier) this.subscribe(notifier);
  }

  public getState() {
    return {
      nextFloor: this.queue.nextFloor,
      currentFloor: this.currentFloor,
      direction: this.direction,
      stop: this.stop,
      id: this.id
    };
  }

  public subscribe(sendState: Function) {
    this.listeners.push(sendState);
  }

  private notify(): void {
    this.listeners.forEach(fn => {
      fn(this.getState());
    });
  }

  public checkNewTime(from: number, to: number) {
    return this.queue.checkNewTime(this.currentFloor, from, to);
  }

  public addFloors(from: number, to: number): void {
    this.queue.addFloors(this.currentFloor, from, to);

    console.log(`Elevator ${this.id} queue: ${this.queue}`);

    setTimeout(() => {
      if (this.direction === 0) {
        this.notify();
        this.checkElevatorStop();
        this.updateFloor(this.direction);
      }
    }, 0);
  }

  private updateFloor(direction: number) {
    setTimeout(() => {
      this.currentFloor += direction;
      this.checkElevatorStop();
      // Should we stop?
      if (this.direction !== 0) this.updateFloor(this.direction);
    }, 2000);
  }

  private checkElevatorStop() {
    while (this.currentFloor === this.queue.nextFloor) {
      this.stop = true;
      this.notify();
      this.queue.removeNextFloor();
      console.log(`Elevator ${this.id} queue: ${this.queue}`);
    }

    if (this.queue.nextFloor === null) {
      this.direction = 0;
    } else {
      this.direction = this.currentFloor < this.queue.nextFloor ? 1 : -1;
      this.stop = false;
    }

    this.notify();
  }
}

import Elevator from "logic/Elevator";
import EleavtorController from "logic/ElevatorController";
import { action, computed, observable } from "mobx";
import { createContext } from "react";

const DEFAULT_NUMBER_OF_FLOORS = 10;
const DEFAULT_NUMBER_OF_ELEVATORS = 1;

interface Passenger {
  id: string;
  from: number;
  to: number;
  direction: Direction;
  elevatorId: number;
  inTheCabin: boolean;
}

class GlobalStore {
  //--- PASSENGERS ---
  private count: number = 0;
  @observable passengers: Passenger[] = [];

  @action addPassenger(from: number, to: number) {
    const id = `${this.count++}`;

    const elevatorId = this.goToFloor(from, to);

    this.passengers.push({
      id,
      from,
      to,
      direction: to - from > 0 ? 1 : -1,
      elevatorId: elevatorId,
      inTheCabin: false
    });
  }

  @computed get waitingPassengers() {
    return this.passengers.filter(p => !p.inTheCabin);
  }

  @computed get passengersByTheFloors() {
    const result: { [key in number]: Passenger[] } = {};

    for (let i = 0; i < this.waitingPassengers.length; i++) {
      const passenger = this.waitingPassengers[i];

      if (!result[passenger.from]) result[passenger.from] = [];

      result[passenger.from].push(passenger);
    }

    return result;
  }

  public getPassengerForElevator(elevatorId: number): string[] {
    return this.passengers
      .filter(p => p.elevatorId === elevatorId && p.inTheCabin)
      .map(p => p.id);
  }

  @action updatePassengerList = ({
    currentFloor,
    stop,
    id
  }: {
    nextFloor: number | null;
    currentFloor: number;
    direction: Direction;
    stop: boolean;
    id: number;
  }) => {
    if (!stop) return;

    /**
     * Filter out passengers that reached their destination
     */
    this.passengers = this.passengers.filter(
      p => !(p.elevatorId === id && p.to === currentFloor && p.inTheCabin)
    );

    /**
     * Put passengers to the cabin
     */
    for (let i = 0; i < this.passengers.length; i++) {
      const p = this.passengers[i];
      if (p.elevatorId === id && p.from === currentFloor) {
        p.inTheCabin = true;
      }
    }
  };

  //--- Elevator ---

  private elecatorController: EleavtorController = new EleavtorController(
    DEFAULT_NUMBER_OF_FLOORS,
    DEFAULT_NUMBER_OF_ELEVATORS,
    this.updatePassengerList
  );

  @computed get elevators(): Elevator[] {
    return this.elecatorController.elevatorList();
  }

  @computed get floors() {
    let result = [];

    for (let i = this.elecatorController.getNumberOfFloors(); i > 0; i--)
      result.push(i);

    return result;
  }

  @computed get numberOfFloors() {
    return this.elecatorController.getNumberOfFloors();
  }

  @action addElevator() {
    this.elecatorController.addElevator(this.updatePassengerList);
  }

  @action goToFloor(from: number, to: number) {
    return this.elecatorController.goToFloor(from, to);
  }

  //--- SIMULATION ---
  @observable simulationInProcess: boolean = false;
  @observable startTime: number | null = null;
  @observable endTime: number | null = null;

  @computed get simulationTime() {
    if (!this.startTime) return 0;

    if (!this.endTime) return Math.round((Date.now() - this.startTime) / 1000);

    return Math.round((this.endTime - this.startTime) / 1000);
  }

  @action simulation() {
    this.simulationInProcess = !this.simulationInProcess;

    if (!this.simulationInProcess) {
      this.endTime = Date.now();
      return;
    }

    this.endTime = null;
    this.startTime = Date.now();

    this.generateData();
  }

  private getRandomFloor() {
    return Math.floor(Math.random() * this.numberOfFloors) + 1;
  }

  @action generateData() {
    setTimeout(() => {
      if (!this.simulationInProcess) return;

      const numOfNewPassengers = Math.floor(Math.random() * 4);
      console.log(numOfNewPassengers);

      if (numOfNewPassengers > 0) {
        for (let i = 0; i < numOfNewPassengers; i++) {
          const atFloor = this.getRandomFloor();
          let destFloor: number;

          do {
            destFloor = this.getRandomFloor();
          } while (destFloor === atFloor);

          this.addPassenger(atFloor, destFloor);
        }
      }

      this.generateData();
    }, 5000);
  }
}

export const GlobalStoreContext = createContext(new GlobalStore());

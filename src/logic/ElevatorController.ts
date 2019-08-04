import { observable } from "mobx";

import Elevator from "./Elevator";

export default class EleavtorController {
  @observable elevators: Elevator[] = [];
  @observable numberOfFloors: number;

  constructor(
    numberOfFloors: number,
    numberOfElevators: number,
    observer?: Function
  ) {
    this.numberOfFloors = numberOfFloors;

    for (let i = 0; i < numberOfElevators; i++) {
      this.elevators.push(new Elevator(i + 1, observer));
    }
  }

  public elevatorList() {
    return this.elevators;
  }

  public getNumberOfFloors(): number {
    return this.numberOfFloors;
  }

  public addElevator(observer: Function): void {
    this.elevators.push(new Elevator(this.elevators.length + 1, observer));
  }

  public goToFloor(from: number, to: number) {
    const newTimeArray: number[] = this.elevators.map(el =>
      el.checkNewTime(from, to)
    );

    const minTime: number = newTimeArray.reduce((minTime, time) =>
      time < minTime ? time : minTime
    );

    const candidateIndexList: number[] = newTimeArray.reduce<number[]>(
      (list, time, index) => (time === minTime ? [...list, index] : list),
      []
    );

    const randomCandidateIndex: number = Math.floor(
      Math.random() * candidateIndexList.length
    );

    const candidate = this.elevators[candidateIndexList[randomCandidateIndex]];

    candidate.addFloors(from, to);

    return candidate.id;
  }
}

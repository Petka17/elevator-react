import classnames from "classnames";
import Elevator from "logic/Elevator";
import React from "react";

import classes from "../styles.css";

const elevatorFloorClasses = (currentFloor: number, floor: number) =>
  classnames(classes.elevatorFloor, {
    [classes.elevatorPass]: currentFloor === floor
  });

interface Props {
  elevator: Elevator;
  passengers: string[];
  floors: number[];
}

const ElevatorUI = ({ floors, elevator, passengers }: Props) => {
  /**
   * Init base state of the component and get setState function
   */
  const [{ currentFloor, id }, setState] = React.useState(elevator.getState());

  /**
   * Subscribe to the updates of the elevator's state
   */
  React.useEffect(() => {
    elevator.subscribe(setState);
  }, []);

  /**
   * Render
   */
  return (
    <div className={classes.elevator}>
      <div className={classes.label}>{id}</div>
      {floors.map(floor => (
        <div key={floor} className={elevatorFloorClasses(currentFloor, floor)}>
          {currentFloor === floor &&
            passengers.map(id => (
              <div className={classes.passenger} key={id}>
                {id}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default ElevatorUI;

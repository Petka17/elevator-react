import { observer } from "mobx-react-lite";
import React from "react";
import { GlobalStoreContext } from "state";

import ElevatorUI from "./Elevator";
import Passengers from "./Passengers";
import classes from "./styles.css";

const Building = observer(() => {
  const store = React.useContext(GlobalStoreContext);

  return (
    <div className={classes.building}>
      <div className={classes.floorNumbers}>
        <div className={classes.label}>F</div>
        {store.floors.map(floor => (
          <div className={classes.floorNumber} key={floor}>
            {floor}
          </div>
        ))}
      </div>
      {store.elevators.map(el => (
        <ElevatorUI
          key={el.id}
          elevator={el}
          passengers={store.getPassengerForElevator(el.id)}
          floors={store.floors}
        />
      ))}

      <Passengers />
    </div>
  );
});

export default Building;

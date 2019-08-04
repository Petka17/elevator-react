import { observer } from "mobx-react-lite";
import React from "react";
import { GlobalStoreContext } from "state";

import classes from "../styles.css";

const Passengers = observer(() => {
  const store = React.useContext(GlobalStoreContext);

  const [clickedFloor, setClickedFloor] = React.useState<number | null>(null);

  const addPassenger = (from: number, to: number) => {
    setClickedFloor(null);
    if (from === to) return;
    store.addPassenger(from, to);
  };

  return (
    <div className={classes.floors}>
      <div className={classes.label}>Passengers</div>
      {store.floors.map(floor => (
        <div className={classes.floor} key={floor}>
          {store.passengersByTheFloors[floor] &&
            store.passengersByTheFloors[floor].map(p => (
              <div className={classes.waitingPassenger} key={p.id}>
                {p.id}:{p.to}
              </div>
            ))}
          <div
            className={classes.addPassenger}
            onClick={() => setClickedFloor(floor)}
          >
            +
          </div>
          {clickedFloor === floor && (
            <div className={classes.panel}>
              {store.floors.map(toFloor => (
                <div key={toFloor} onClick={() => addPassenger(floor, toFloor)}>
                  {toFloor}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

export default Passengers;

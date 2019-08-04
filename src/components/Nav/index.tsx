import { observer } from "mobx-react-lite";
import React from "react";
import { GlobalStoreContext } from "state";

import classes from "./styles.css";

const Nav = observer(() => {
  const store = React.useContext(GlobalStoreContext);

  return (
    <nav className={classes.navigation}>
      <div className={classes.title}>Elevators</div>
      <div className={classes.buttons}>
        <div className={classes.button} onClick={() => store.addElevator()}>
          +
        </div>
        <div className={classes.button} onClick={() => store.simulation()}>
          {store.simulationInProcess ? "\u25A0" : "\u25B6"}
        </div>
        <div>{store.simulationTime}</div>
      </div>
    </nav>
  );
});

export default Nav;

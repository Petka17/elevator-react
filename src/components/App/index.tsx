import Nav from "components/Nav";
import React from "react";

import Building from "../Building";
import classes from "./styles.css";

const App = () => (
  <div className={classes.container}>
    <Nav />
    <section className={classes.main}>
      <Building />
    </section>
  </div>
);

export default App;

import React from "react";
import { inject, observer } from "mobx-react";

const Standings = ({ store: { standings } }) => {
  return (
    <div className="Standings">
      standings{" "}
      {standings.map(c => {
        return <div>{c.name}</div>;
      })}
    </div>
  );
};

export default inject("store")(observer(Standings));

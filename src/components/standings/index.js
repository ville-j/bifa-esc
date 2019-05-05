import React from "react";
import { inject } from "mobx-react";

const Standings = ({ store: { countries } }) => {
  return (
    <div className="Standings">
      standings{" "}
      {countries.map(c => {
        return <div>{c.name}</div>;
      })}
    </div>
  );
};

export default inject("store")(Standings);

import React from "react";
import { inject, observer } from "mobx-react";
import Flag from "../flag";
import "./standings.css";

const Standings = ({ store: { totalStandings, activeVotes } }) => {
  return (
    <div className="Standings">
      <div className="presenting-country">PEtrii</div>
      <div className="points">
        {totalStandings.map((c, i) => {
          const pointing = activeVotes.find(a => a.country === c.id);
          return (
            <div key={c.id} className={pointing ? "country active" : "country"}>
              <Flag country={c.id} />
              <span>{c.name}</span>
              <span className="single-points">{c.points}</span>
              {pointing && (
                <span className="given-points">{pointing.points}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default inject("store")(observer(Standings));

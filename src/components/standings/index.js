import React from "react";
import { inject, observer } from "mobx-react";
import Flag from "../flag";
import "./standings.css";

const Standings = ({
  store: { totalStandings, activeVotes, activatedCountry, countries }
}) => {
  console.log(activatedCountry);
  return (
    <div className="Standings">
      <div className="presenting-country">
        {activatedCountry.votingCountry && (
          <React.Fragment>
            <img
              src={`stars/${activatedCountry.votingCountry}.jpg`}
              alt="your country"
            />
            <div className="names">
              <div className="a-country">
                {
                  countries.find(c => c.id === activatedCountry.votingCountry)
                    .name
                }
              </div>
              <div className="a-person">{activatedCountry.name}</div>
            </div>
          </React.Fragment>
        )}
      </div>
      <div className="points">
        {totalStandings.map((c, i) => {
          const pointing = activeVotes.find(a => a.country === c.id);
          return (
            <div key={c.id} className={pointing ? "country active" : "country"}>
              <Flag country={c.id} />
              <span>{c.name}</span>
              <span className="single-points">{c.points}</span>
              {pointing && (
                <span className={`given-points p${pointing.points}`}>
                  {pointing.points}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default inject("store")(observer(Standings));

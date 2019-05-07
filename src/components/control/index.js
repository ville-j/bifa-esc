import React from "react";
import { inject, observer } from "mobx-react";
import countries from "../../countries";
import "./control.css";

const Control = ({ store: { queue, applyVotes } }) => {
  return (
    <div className="Queue">
      {queue.map(q => {
        return (
          <div key={q.votingCountry} className="country-points">
            <div>
              {countries.find(c => c.id === q.votingCountry).name} ({q.name})
            </div>
            <div>
              <button>activate</button>
              <button
                onClick={() => {
                  applyVotes(q, 3);
                }}
              >
                1-7
              </button>
              <button
                onClick={() => {
                  applyVotes(q, 2);
                }}
              >
                8
              </button>
              <button
                onClick={() => {
                  applyVotes(q, 1);
                }}
              >
                10
              </button>
              <button
                onClick={() => {
                  applyVotes(q, 0);
                }}
              >
                12
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default inject("store")(observer(Control));

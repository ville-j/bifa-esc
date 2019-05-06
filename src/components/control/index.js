import React from "react";
import { inject, observer } from "mobx-react";

const Control = ({ store: { queue, applyVotes } }) => {
  return (
    <div className="Queue">
      {queue.map(q => {
        return (
          <div
            key={q.votingCountry}
            onClick={() => {
              applyVotes(q);
            }}
          >
            {q.votingCountry} {q.name}
          </div>
        );
      })}
    </div>
  );
};

export default inject("store")(observer(Control));

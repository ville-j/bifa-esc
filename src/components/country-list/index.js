import React from "react";
import { inject, observer } from "mobx-react";
import Reorder, { reorder } from "react-reorder";
import points from "../../points";
import "./country-list.css";

const CountryList = ({
  store: { countries, country, updateCountries, vote }
}) => {
  const onReorder = (e, previousIndex, nextIndex, fromId, toId) => {
    updateCountries(reorder(countries, previousIndex, nextIndex));
  };
  let j = 0;
  return (
    <div className="CountryList">
      <Reorder
        reorderId="country-list"
        lock="horizontal"
        holdTime={500}
        onReorder={onReorder}
      >
        {countries.map((c, i) => {
          if (c.id === country) j += 1;
          return (
            <div key={c.id} className="list-item disable-select">
              <span className="position">
                {c.id !== country && `${i + 1 - j}.`}
              </span>
              <span className="name">{c.name}</span>
              <span className="points">
                {c.id !== country && points[i - j] && `${points[i - j]}p`}
              </span>
            </div>
          );
        })}
      </Reorder>
      <div role="button" className="main-button" onClick={vote}>
        Lähetä
      </div>
    </div>
  );
};

export default inject("store")(observer(CountryList));

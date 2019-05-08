import React from "react";
import { inject, observer } from "mobx-react";
import Reorder, { reorder } from "react-reorder";
import points from "../../points";
import Flag from "../flag";
import "./country-list.css";

const CountryList = ({
  store: {
    countries,
    country,
    updateCountries,
    vote,
    splash,
    setSplash,
    confirmVotes,
    setConfirmVotes
  }
}) => {
  const onReorder = (e, previousIndex, nextIndex, fromId, toId) => {
    updateCountries(reorder(countries, previousIndex, nextIndex));
  };
  let j = 0;
  return (
    <div className="CountryList">
      {splash && (
        <div className="country-splash">
          <div className="title1">Olet</div>
          <div className="title2">
            {countries.find(c => c.id === country).name}
          </div>
          <div className="country-image-container">
            <img src={`stars/${country}.jpg`} alt="your country" />
          </div>

          <div
            className="main-button"
            onClick={() => {
              setSplash(false);
            }}
          >
            OK!
          </div>
        </div>
      )}
      {!splash && (
        <React.Fragment>
          <Reorder
            reorderId="country-list"
            lock="horizontal"
            holdTime={350}
            onReorder={onReorder}
          >
            {countries.map((c, i) => {
              if (c.id === country) j += 1;
              return (
                <div
                  key={c.id}
                  className={
                    "list-item disable-select" +
                    (c.id === country ? " own-country" : "")
                  }
                >
                  <span className="position">{c.ord}.</span>
                  <span className="name">{c.name}</span>
                  <span className="points">
                    {c.id !== country && points[i - j] && `${points[i - j]}`}
                  </span>
                  <span className="flag">
                    <Flag country={c.id} />
                  </span>
                </div>
              );
            })}
          </Reorder>
          <div className="silly-q">Oletko valmis?</div>
          <div
            role="button"
            className="main-button"
            onClick={() => {
              setConfirmVotes(true);
            }}
          >
            Lähetä äänet
          </div>
          {confirmVotes && (
            <div className="confirm-votes">
              <div
                className="cancel-btn"
                onClick={() => {
                  setConfirmVotes(false);
                }}
              >
                Peruuta
              </div>
              Varmista äänten lähettäminen
              <br />
              <div role="button" className="main-button" onClick={vote}>
                Lähetä äänet
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default inject("store")(observer(CountryList));

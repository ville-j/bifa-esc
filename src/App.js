import React from "react";
import { observer, inject } from "mobx-react";
import Login from "./components/login";
import CountryList from "./components/country-list";
import "./App.css";

function App({ store }) {
  return (
    <div className="App">
      {!store.country && <Login />}
      {store.country && <CountryList />}
    </div>
  );
}

export default inject("store")(observer(App));

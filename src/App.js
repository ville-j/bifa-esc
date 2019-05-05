import React from "react";
import { observer, inject } from "mobx-react";
import { HashRouter, Route } from "react-router-dom";
import Login from "./components/login";
import CountryList from "./components/country-list";
import Standings from "./components/standings";
import "./App.css";

function App({ store }) {
  return (
    <div className="App">
      <HashRouter>
        <Route exact path="/" component={store.country ? CountryList : Login} />
        <Route exact path="/standings" component={Standings} />
      </HashRouter>
    </div>
  );
}

export default inject("store")(observer(App));

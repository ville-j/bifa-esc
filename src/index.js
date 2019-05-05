import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { onSnapshot, applySnapshot } from "mobx-state-tree";
import { AppStore } from "./stores/AppStore";
import countries from "./countries";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import socket from "./socket";

const store = AppStore.create(
  {
    countries: countries
  },
  { socket }
);

const snapshot = localStorage.getItem("bifaesc/state");
if (snapshot) {
  applySnapshot(store, JSON.parse(snapshot));
}

onSnapshot(store, snapshot => {
  localStorage.setItem("bifaesc/state", JSON.stringify(snapshot));
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

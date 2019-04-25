import React from "react";
import { inject } from "mobx-react";

const Login = ({ store }) => {
  let input;
  return (
    <div className="Login">
      <h3>Nimi</h3>
      <input type="text" ref={el => (input = el)} />
      <div
        className="main-button"
        role="button"
        onClick={() => {
          store.register(input.value);
        }}
      >
        Seuraava
      </div>
    </div>
  );
};

export default inject("store")(Login);

import React, { useState } from "react";
import { inject } from "mobx-react";
import logo from "../../assets/logo.png";
import "./login.css";

const Login = ({ store }) => {
  const [value, setValue] = useState("");
  let input;
  return (
    <div className="Login">
      <img src={logo} alt="logo" />
      <h3>Kuka olet?</h3>
      <input
        type="text"
        ref={el => (input = el)}
        placeholder="Nimi"
        onChange={() => {
          setValue(input.value);
        }}
      />
      <div
        className={"main-button" + (value.length > 0 ? "" : " disabled")}
        role="button"
        onClick={() => {
          value.length > 0 && store.register(value);
        }}
      >
        Jatka
      </div>
    </div>
  );
};

export default inject("store")(Login);

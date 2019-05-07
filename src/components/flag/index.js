import React from "react";
import "flag-icon-css/css/flag-icon.css";

const Flag = ({ country }) => (
  <span className={`flag-icon flag-icon-${country}`} />
);

export default Flag;

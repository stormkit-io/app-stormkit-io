import React from "react";
import TextField from "@material-ui/core/TextField";

const Input = (props) => {
  return <TextField {...props} />;
};

Input.defaultProps = {
  type: "text",
  variant: "outlined",
};

export default Input;

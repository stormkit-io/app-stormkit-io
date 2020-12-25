import React from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

const Input: React.FC<TextFieldProps> = ({
  type = "text",
  variant = "outlined",
  ...props
}: TextFieldProps): React.ReactElement => {
  return <TextField type={type} variant={variant} {...props} />;
};

export default Input;

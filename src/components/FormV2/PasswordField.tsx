import React, { useState } from "react";
import { StandardTextFieldProps } from "@mui/material/TextField";
import Input from "./Input";
import Button from "../ButtonV2";

interface Props extends StandardTextFieldProps {
  name: string;
}

export default function PasswordField(props: Props): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);

  const Visibility = () => {
    return (
      <span className="fa-regular fa-eye"></span>
    )
  }

  const VisibilityOff = () => {
    return (
      <span className="fa-regular fa-eye-slash"></span>
    )
  }

  return (
    <Input
    className="bg-blue-10 no-border mr-0"
    fullWidth={props.fullWidth}
    type={showPassword ? "text" : "password"}
    defaultValue={props.defaultValue}
    placeholder={props.placeholder}
    name={props.name}
    InputProps={{
      endAdornment: (
        <Button
          styled={false}
          type="button"
          className="py-1 px-2 flex justify-center items-center bg-blue-30  hover:bg-blue-20 mr-1 rounded-sm"
          onClick={handleClickShowPassword}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </Button>
      ),
    }}
  />
  )
}

import React from "react";
import cn from "classnames";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Tooltip } from "@mui/material";

export type Props = TextFieldProps & {
  tooltip?: React.ReactNode;
};

const Input: React.FC<Props> = ({
  tooltip,
  type = "text",
  variant = "filled",
  autoComplete = "off",
  InputProps,
  ...props
}) => {
  return (
    <TextField
      type={type}
      variant={variant}
      autoComplete={autoComplete}
      sx={{
        background: "black",
      }}
      inputProps={{
        className: cn("p-3 text-gray-80"),
      }}
      InputProps={{
        ...InputProps,
        endAdornment: (InputProps?.endAdornment || tooltip) && (
          <>
            {InputProps?.endAdornment}
            {tooltip && (
              <Tooltip title={tooltip} arrow className="text-black">
                <span className="fas fa-question-circle" />
              </Tooltip>
            )}
          </>
        ),
      }}
      {...props}
    />
  );
};

export default Input;

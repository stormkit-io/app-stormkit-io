import React from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import { Tooltip } from "@material-ui/core";

type Props = TextFieldProps & {
  tooltip?: string;
};

const Input: React.FC<Props> = ({
  tooltip,
  type = "text",
  variant = "outlined",
  InputProps,
  ...props
}): React.ReactElement => {
  return (
    <TextField
      type={type}
      variant={variant}
      InputProps={{
        endAdornment: tooltip && (
          <Tooltip title={tooltip} arrow>
            <span className="fas fa-question-circle" />
          </Tooltip>
        ),
        ...InputProps,
      }}
      {...props}
    />
  );
};

export default Input;

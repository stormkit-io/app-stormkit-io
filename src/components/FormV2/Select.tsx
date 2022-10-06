import React from "react";
import cn from "classnames";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import SelectInput, { SelectProps } from "@mui/material/Select";

let inputLabel = 0;

interface Props {
  shrink?: boolean;
  background?: "black" | "transparent";
  textColor?: "gray-80" | "white";
}

const Select: React.FC<SelectProps & Props> = ({
  className,
  variant = "filled",
  label,
  shrink = false,
  fullWidth = true,
  displayEmpty = true,
  defaultValue = "",
  background = "black",
  textColor = "gray-80",
  required,
  ...rest
}): React.ReactElement => {
  const labelId = `form-select-${inputLabel++}`;

  return (
    <FormControl
      variant={variant}
      fullWidth={fullWidth}
      required={required}
      className={cn({
        transparent: background === "transparent",
        "h-full": true,
      })}
      sx={{
        background,
      }}
    >
      {label && (
        <InputLabel id={labelId} shrink={shrink}>
          {label}
        </InputLabel>
      )}
      <SelectInput
        label={label}
        labelId={labelId}
        className={cn({ "w-full": fullWidth }, className)}
        displayEmpty={displayEmpty}
        defaultValue={defaultValue}
        inputProps={{
          className: `text-${textColor} leading-4 p-3`,
        }}
        {...rest}
      />
    </FormControl>
  );
};

export default Select;

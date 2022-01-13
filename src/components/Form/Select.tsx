import React from "react";
import cn from "classnames";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import SelectInput, { SelectProps } from "@material-ui/core/Select";

let inputLabel = 0;

const Select: React.FC<SelectProps & { shrink?: boolean }> = ({
  className,
  variant = "outlined",
  label,
  shrink = false,
  fullWidth = true,
  displayEmpty = true,
  defaultValue = "",
  required,
  ...rest
}): React.ReactElement => {
  const labelId = `form-select-${inputLabel++}`;

  return (
    <FormControl variant={variant} fullWidth={fullWidth} required={required}>
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
        {...rest}
      />
    </FormControl>
  );
};

export default Select;

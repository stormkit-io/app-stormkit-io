import React from "react";
import cn from "classnames";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import SelectInput, { SelectProps } from "@material-ui/core/Select";

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
  return (
    <FormControl variant={variant} fullWidth={fullWidth} required={required}>
      {label && <InputLabel shrink={shrink}>{label}</InputLabel>}
      <SelectInput
        label={label}
        className={cn({ "w-full": fullWidth }, className)}
        displayEmpty={displayEmpty}
        defaultValue={defaultValue}
        {...rest}
      />
    </FormControl>
  );
};

export default Select;

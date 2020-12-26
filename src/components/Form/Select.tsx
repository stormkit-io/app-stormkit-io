import React from "react";
import cn from "classnames";
import SelectInput, { SelectProps } from "@material-ui/core/Select";

const Select: React.FC<SelectProps> = ({
  className,
  variant = "filled",
  ...rest
}): React.ReactElement => {
  return (
    <SelectInput
      className={cn("w-full", className)}
      variant={variant}
      SelectDisplayProps={{ className: "flex items-center p-4 w-full" }}
      {...rest}
    />
  );
};

export default Select;

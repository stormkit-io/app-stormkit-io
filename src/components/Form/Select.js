import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import SelectInput from "@material-ui/core/Select";

const Select = ({ onChange, className, variant = "filled", ...rest }) => {
  return (
    <SelectInput
      className={cn("w-full", className)}
      onChange={(e) => onChange && onChange(e.target.value)}
      variant={variant}
      SelectDisplayProps={{ className: "flex items-center p-4 w-full" }}
      {...rest}
    />
  );
};

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["filled", "standard", "outlined"]),
  className: PropTypes.any,
};

export default Select;

import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import FormWrapper from "./FormWrapper";
import SelectUI from "@material-ui/core/Select";

const Select = ({ handler, className, variant = "filled", ...rest }) => {
  return (
    <SelectUI
      className={cn("w-full", className)}
      onChange={(e) => handler(e.target.value)}
      variant={variant}
      SelectDisplayProps={{ className: "flex items-center p-4 w-full" }}
      {...rest}
    />
  );
};

Select.propTypes = {
  handler: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["filled", "standard", "outlined"]),
  className: PropTypes.any,
};

export default FormWrapper(Select);

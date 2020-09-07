import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const Description = ({ children, className }) => {
  return (
    <div className={cn("p-3 text-sm color-gray-55", className)}>{children}</div>
  );
};

Description.propTypes = {
  children: PropTypes.node,
  className: PropTypes.any,
};

export default Description;

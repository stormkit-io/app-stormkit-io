import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const Section = ({ children, className, label, marginBottom = "mb-8" }) => {
  return (
    <div className={cn("flex", marginBottom, className)}>
      <div className="flex-auto pt-4 min-w-48 max-w-48 font-bold">{label}</div>
      <div className="flex-auto">{children}</div>
    </div>
  );
};

Section.propTypes = {
  marginBottom: PropTypes.string, // The tailwind class for the marginBottom
  children: PropTypes.node,
  className: PropTypes.any,
  label: PropTypes.node
};

export default Section;

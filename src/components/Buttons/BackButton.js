import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Link from "../Link";
import "./BackButton.css";

const BackButton = ({ to, className, size = 8, ...rest }) => (
  <Link
    className={cn(
      "back-button relative inline-block leading-none",
      `w-${size} h-${size}`,
      {
        "text-3xl": size === 8,
        "text-2xl": size === 6
      },
      className
    )}
    {...rest}
    to={to}
  >
    <span className="fas fa-circle fa-stack-1x text-secondary" />
    <span className="fas fa-arrow-alt-circle-left fa-stack-1x text-blue-20" />
  </Link>
);

BackButton.propTypes = {
  className: PropTypes.any,
  to: PropTypes.string,
  size: PropTypes.number
};

export default BackButton;

import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Link from "~/components/Link";
import "./BackButton.css";

const BackButton = ({ to, className, ...rest }) => (
  <Link
    className={cn(
      "back-button text-3xl w-8 h-8 relative inline-block",
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
};

export default BackButton;

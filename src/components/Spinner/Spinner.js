import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import "./Spinner.css";

const Spinner = ({
  width,
  height,
  pageCenter,
  primary,
  secondary,
  className,
}) => (
  <div
    className={cn(
      "spinner",
      "rounded-full",
      `w-${width} h-${height}`,
      {
        "page-center": pageCenter,
        "bg-pink-50": primary,
        "bg-blue-20": secondary,
      },
      className
    )}
  >
    <div className="relative w-full h-full">
      <div className="spinner-bounce w-full h-full rounded-full bg-white absolute top-0 left-0" />
      <div className="spinner-bounce w-full h-full rounded-full bg-white absolute top-0 left-0" />
    </div>
  </div>
);

// Width and height are numbers compatible with tailwind sizes.
Spinner.defaultProps = {
  width: 10,
  height: 10,
};

Spinner.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  pageCenter: PropTypes.bool, // Whether to center in the middle of the page or not.
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  className: PropTypes.any,
};

export default Spinner;

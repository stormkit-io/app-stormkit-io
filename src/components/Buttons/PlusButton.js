import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Button from "../Button";

const PlusButton = ({ className, size, ...props }) => (
  <Button
    styled={false}
    type="button"
    className={cn(
      "border-4 border-dotted border-gray-85 rounded-tl rounded-tr flex items-center w-full hover:border-black",
      { "p-8": size === "medium", "p-2": size === "small" },
      className
    )}
    {...props}
  >
    <span
      className={cn("fas fa-plus", {
        "text-6xl": size === "medium",
        "text-3xl": size === "small",
      })}
    />
  </Button>
);

PlusButton.defaultProps = {
  size: "medium",
};

PlusButton.propTypes = {
  className: PropTypes.any,
  size: PropTypes.oneOf(["small", "medium"]),
};

export default PlusButton;

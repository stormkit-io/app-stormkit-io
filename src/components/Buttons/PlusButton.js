import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Button from "../Button";

const PlusButton = ({ className, size, text, ...props }) => (
  <div className="flex w-full justify-center">
    <Button
      styled={false}
      type="button"
      className={cn(
        "rounded flex items-center hover:bg-white-o-05",
        { "p-8": size === "medium", "p-2": size === "small" },
        className
      )}
      {...props}
    >
      <span
        className={cn({
          "text-2xl": size === "medium",
          "text-xl": size === "small"
        })}
      >
        <span className="fas fa-plus-circle mr-2 text-lg" /> {text}
      </span>
    </Button>
  </div>
);

PlusButton.defaultProps = {
  size: "medium",
  text: "New"
};

PlusButton.propTypes = {
  className: PropTypes.any,
  text: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium"])
};

export default PlusButton;

import React, { useState, cloneElement } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import OutsideClick from "~/components/OutsideClick";
import Button from "~/components/Button";

const DotDotDot = ({ children, className, ...rest }) => {
  const [isOpen, toggleVisibility] = useState(false);

  return (
    <OutsideClick handler={() => toggleVisibility(false)}>
      <div className={cn("relative", className)}>
        <Button
          styled={false}
          onClick={() => toggleVisibility(!isOpen)}
          {...rest}
        >
          <i className="fas fa-ellipsis-h" />
        </Button>
        {isOpen && (
          <div className="flex flex-col min-w-56 absolute right-0 rounded shadow bg-white z-50 items-start mt-4 text-left">
            {React.Children.map(
              children,
              (child, index) =>
                child &&
                cloneElement(child, {
                  toggleVisibility,
                  isLast: children.length - 1 === index
                })
            )}
          </div>
        )}
      </div>
    </OutsideClick>
  );
};

DotDotDot.propTypes = {
  children: PropTypes.node,
  className: PropTypes.any
};

DotDotDot.Item = ({
  icon,
  children,
  onClick,
  toggleVisibility,
  isLast,
  className,
  disabled,
  ...rest
}) => (
  <Button
    as="div"
    className={cn(
      "border-solid border-gray-80 p-4 w-full",
      {
        "hover:bg-gray-90": !disabled,
        "hover:text-pink-50": !disabled,
        "opacity-50": disabled,
        "cursor-not-allowed": disabled,
        "border-b": !isLast
      },
      className
    )}
    disabled={disabled}
    styled={false}
    {...rest}
    onClick={e => {
      e.preventDefault();

      if (disabled) {
        return;
      }

      let shouldClose = true;

      if (typeof onClick === "function") {
        shouldClose = onClick();
      }

      if (shouldClose !== false) {
        toggleVisibility(false);
      }
    }}
  >
    {icon && <i className={icon} />}
    {children}
  </Button>
);

DotDotDot.Item.prototypes = {
  icon: PropTypes.string,
  toggleVisibility: PropTypes.func,
  isLast: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.any,
  disabled: PropTypes.bool
};

export default DotDotDot;

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
              (child) => child && cloneElement(child, { toggleVisibility })
            )}
          </div>
        )}
      </div>
    </OutsideClick>
  );
};

DotDotDot.propTypes = {
  children: PropTypes.node,
  className: PropTypes.any,
};

DotDotDot.Item = ({
  icon,
  children,
  onClick,
  toggleVisibility,
  className,
  ...rest
}) => (
  <Button
    as="div"
    className={cn(
      "border-b border-solid border-gray-80 p-4 w-full hover:bg-gray-90 hover:text-pink-50",
      className
    )}
    styled={false}
    {...rest}
    onClick={(e) => {
      e.preventDefault();
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
  children: PropTypes.node,
  className: PropTypes.any,
};

export default DotDotDot;

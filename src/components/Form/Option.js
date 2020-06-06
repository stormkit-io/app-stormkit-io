import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const Option = React.forwardRef(({ children, className, ...rest }, ref) => {
  return (
    <div
      className={cn(
        "cursor-pointer hover:bg-gray-90 border-b border-solid border-gray-80",
        className
      )}
      {...rest}
      ref={ref}
    >
      <div className="flex p-4 items-center">{children}</div>
    </div>
  );
});

Option.propTypes = {
  children: PropTypes.node,
  className: PropTypes.any,
};

export default Option;

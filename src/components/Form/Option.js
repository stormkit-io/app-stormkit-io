import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const Option = React.forwardRef(({ children, className, ...rest }, ref) => {
  return (
    <div
      className={cn(
        "border-b border-solid border-gray-80",
        {
          "cursor-pointer hover:bg-gray-90": !rest.disabled,
          "bg-gray-85 text-gray-60": rest.disabled,
        },
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

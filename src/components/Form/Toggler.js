import React, { Children, useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Button from "~/components/Button";

const Toggler = ({ children, onSelect, defaultSelected, name, className }) => {
  const [selectedValue, setSelectedValue] = useState(defaultSelected);
  const childArray = Children.toArray(children);

  return (
    <div
      className={cn(
        "flex border border-solid border-gray-83 rounded-lg text-sm",
        className
      )}
    >
      <input type="hidden" value={selectedValue} name={name} />
      {childArray.map((c, i) => {
        const value =
          typeof c.props["data-value"] !== "undefined"
            ? c.props["data-value"]
            : i;

        const isSelected = value === selectedValue;

        return (
          <Button
            as="div"
            styled={false}
            key={value}
            className={cn("p-4", {
              "bg-white": !isSelected,
              "bg-pink-50": isSelected,
              "text-white": isSelected,
              "rounded-tl-lg": i === 0,
              "rounded-bl-lg": i === 0,
              "rounded-tr-lg": i === childArray.length - 1,
              "rounded-br-lg": i === childArray.length - 1
            })}
            onClick={() => {
              setSelectedValue(value);
              onSelect && onSelect(value);
            }}
          >
            {c}
          </Button>
        );
      })}
    </div>
  );
};

Toggler.propTypes = {
  className: PropTypes.any,
  children: PropTypes.node,
  defaultSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  onSelect: PropTypes.func
};

export default Toggler;

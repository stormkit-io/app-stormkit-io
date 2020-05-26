import React, { Children, useState } from "react";
import PropTypes from "prop-types";
import FormWrapper from "./FormWrapper";
import { Wrapper, Item } from "./Togger.styles";

/**
 * Component to display a form toggler. The children is used as the API.
 * If the child has a data-value property, then it that property is used
 * as the value. Otherwise the index is used.
 */
const Toggler = ({ children, handler, selected, name }) => {
  const [selectedState, setSelected] = useState(selected);

  return (
    <Wrapper>
      <input type="hidden" value={selectedState} name={name} />
      {Children.toArray(children).map((c, i) => {
        const value =
          typeof c.props["data-value"] !== "undefined"
            ? c.props["data-value"]
            : i;

        return (
          <Item
            key={value}
            selected={value === selectedState}
            onClick={() => {
              setSelected(value);
              handler(value);
            }}
          >
            {c}
          </Item>
        );
      })}
    </Wrapper>
  );
};

Toggler.propTypes = {
  /**
   * The callback handler when input value changes.
   */
  handler: PropTypes.func.isRequired,

  /**
   * The options of the toggler.
   */
  children: PropTypes.node,

  /**
   * The selected value.
   */
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * The input name.
   */
  name: PropTypes.string
};

export default FormWrapper(Toggler);

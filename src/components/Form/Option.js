import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import StyledOption from "./Option.styles";

export default class Option extends PureComponent {
  static propTypes = {
    /**
     * The text value of this option.
     */
    text: PropTypes.string,

    /**
     * In case more complex structures are needed, it's also possible
     * to provide children.
     */
    children: PropTypes.node,

    /**
     * The value of this option.
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  render() {
    const { value, text, children, ...props } = this.props;
    const content = text || children;

    return (
      <StyledOption {...props} data-highlighted={props.highlighted}>
        {content}
      </StyledOption>
    );
  }
}

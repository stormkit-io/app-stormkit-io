import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FormWrapper from "./FormWrapper";
import { InputStyles } from "./Input.styles";

class Textarea extends PureComponent {
  static propTypes = {
    /**
     * The on change handler.
     */
    handler: PropTypes.func.isRequired
  };

  handleOnChange = e => {
    this.props.handler(e.target.value);
  };

  render() {
    const { handler, ...props } = this.props;
    return <StyledTextarea {...props} onChange={this.handleOnChange} />;
  }
}

const StyledTextarea = styled.textarea`
  ${InputStyles}
  width: 100%;
  border-radius: ${p => (p.rounded ? p.borderRadius : 0)};
  min-height: ${p => p.minHeight};
`;

StyledTextarea.defaultProps = {
  minHeight: "80px",
  borderRadius: "3px"
};

export default FormWrapper(Textarea);

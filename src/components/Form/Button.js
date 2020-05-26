import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormContext from "./context";
import StyledButton, { ButtonSpinner, StyledText } from "./Button.styles";

class Button extends PureComponent {
  static displayName = "Button";

  static propTypes = {
    /**
     * Whether the form is loading or not.
     */
    loading: PropTypes.bool
  };

  render() {
    const { loading, children, ...props } = this.props;

    return (
      <StyledButton {...props}>
        {loading && <ButtonSpinner />}
        <StyledText loading={loading}>{children}</StyledText>
      </StyledButton>
    );
  }
}

export default props => (
  <FormContext.Consumer>
    {({ loading }) => <Button {...props} loading={loading} />}
  </FormContext.Consumer>
);

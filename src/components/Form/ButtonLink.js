import React, { PureComponent } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import FormContext from "./context";
import Spinner from "~/components/Spinner";
// import props from "~/assets/styles/props";
import Button from "~/components/Button";

const StyledSpinner = styled(Spinner)`
  margin: 0 auto;
`;

const StyledButton = styled(Button)`
  margin: 0;

  ${StyledSpinner} {
    width: 32px;
    height: 32px;
    margin: 0 auto;
  }
`;

StyledButton.defaultProps = {
  primary: false,
  secondary: false,
  tertiary: false,
  height: "52px",
  width: "30%",
};

class ButtonComponent extends PureComponent {
  static displayName = "Button";

  static propTypes = {
    /**
     * Whether the form is loading or not.
     */
    loading: PropTypes.bool,
  };

  render() {
    const { loading, children, ...props } = this.props;

    return (
      <StyledButton {...props}>
        {loading && <StyledSpinner />}
        {!loading && children}
      </StyledButton>
    );
  }
}

export default (props) => (
  <FormContext.Consumer>
    {({ loading }) => <ButtonComponent {...props} loading={loading} />}
  </FormContext.Consumer>
);

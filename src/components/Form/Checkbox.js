import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormWrapper from "./FormWrapper";
import CheckboxUI from "@material-ui/core/Checkbox";

class Checkbox extends PureComponent {
  static displayName = "Checkbox";

  static defaultProps = {
    checked: false
  };

  static propTypes = {
    checked: PropTypes.bool,
    handler: PropTypes.func.isRequired
  };

  handleOnChange = () => {
    this.props.handler(!this.props.checked);
  };

  render() {
    // eslint-disable-next-line
    const { handler, ...props } = this.props;

    return <CheckboxUI {...props} onChange={this.handleOnChange} />;
  }
}

export default FormWrapper(Checkbox);

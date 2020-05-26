import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FormWrapper from "./FormWrapper";
import CheckboxUI from "@material-ui/core/Checkbox";

class Checkbox extends PureComponent {
  static displayName = "Checkbox";

  static defaultProps = {
    checked: false
  };

  static propTypes = {
    /**
     * Whether the checkbox is checked or not.
     */
    checked: PropTypes.bool,

    /**
     * When the checkbox is selected/unselected this
     * callback will be triggered.
     */
    handler: PropTypes.func.isRequired
  };

  handleOnChange = () => {
    this.props.handler(!this.props.checked);
  };

  render() {
    const { handler, checked, ...props } = this.props;

    return (
      <CheckboxUI {...props} checked={checked} onChange={this.handleOnChange} />
    );
  }
}

export default FormWrapper(Checkbox);

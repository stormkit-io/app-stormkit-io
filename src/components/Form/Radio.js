import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FormWrapper from "./FormWrapper";

class Radio extends PureComponent {
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
    // Do not allow radio buttons to uncheck themselves
    if (this.props.checked) {
      return;
    }

    this.props.handler(true);
  };

  render() {
    const { handler, ...props } = this.props;
    return <input {...props} onChange={this.handleOnChange} type="radio" />;
  }
}

export default FormWrapper(
  Object.assign(
    styled(Radio)`
      margin: 0 1rem 0 0;
      vertical-align: middle;
    `,
    { displayName: "Radio" }
  )
);

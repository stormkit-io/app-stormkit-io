import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import FormWrapper from "./FormWrapper";
import StyledInput, { Icon } from "./Input.styles";

class Input extends PureComponent {
  static displayName = "Input";

  static defaultProps = {
    type: "text",
    value: ""
  };

  static propTypes = {
    /**
     * The callback handler when input value changes.
     */
    handler: PropTypes.func.isRequired,

    /**
     * Optional. The icon that will be displayed inside the input.
     * To position the icon simply use the class name right, left.
     */
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  handleOnChange = e => {
    const value = e.target.value;
    this.props.handler(value);
  };

  render() {
    const { handler, icon, ...props } = this.props;
    const iconProps = {};

    if (typeof icon === "object") {
      Object.assign(iconProps, icon);
      iconProps.className = cn(iconProps.className);
    } else {
      iconProps.className = cn(icon);
    }

    return (
      <Fragment>
        <StyledInput {...props} onChange={this.handleOnChange} />
        {icon && <Icon {...iconProps} />}
      </Fragment>
    );
  }
}

export default FormWrapper(Input);

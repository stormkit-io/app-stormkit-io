import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SwitchUI from "@material-ui/core/Switch";

/**
 * Wrap the Material-UI Switch component since it does not
 * support a default checked value.
 */
const Switch = ({ checked = false, confirm, ...rest }) => {
  const [isChecked, setChecked] = useState(checked);

  useEffect(() => {
    setChecked(checked);
  }, [checked]);

  return (
    <SwitchUI
      {...rest}
      checked={isChecked}
      onChange={(val) => {
        if (typeof confirm === "function") {
          confirm(setChecked);
        } else {
          setChecked(!isChecked);
          rest.onChange && rest.onChange(val);
        }
      }}
    />
  );
};

Switch.propTypes = {
  /**
   * Whether the switch is checked or not.
   */
  checked: PropTypes.bool,

  /**
   * A confirmation callback before switching the component.
   * It receives a callback argument, that expects a boolean
   * value as an argument. It's used to set the checked state
   * after the confirm action.
   */
  confirm: PropTypes.func,
};

export default Switch;

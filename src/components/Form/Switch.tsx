import React, { useState, useEffect, ReactElement, FC } from "react";
import SwitchUI from "@material-ui/core/Switch";

type Props = {
  /**
   * Whether the switch is checked or not.
   */
  checked: boolean;

  /**
   * A confirmation callback before switching the component.
   * It receives a callback argument, that expects a boolean
   * value as an argument. It's used to set the checked state
   * after the confirm action.
   */
  confirm: (arg0: any) => void;
  onChange?: (arg0: any) => void;
};

/**
 * Wrap the Material-UI Switch component since it does not
 * support a default checked value.
 */
const Switch: FC<Props> = ({
  checked = false,
  confirm,
  ...rest
}: Props): ReactElement => {
  const [isChecked, setChecked] = useState<boolean>(checked);

  useEffect(() => {
    setChecked(checked);
  }, [checked]);

  return (
    <SwitchUI
      {...rest}
      checked={isChecked}
      onChange={val => {
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

export default Switch;

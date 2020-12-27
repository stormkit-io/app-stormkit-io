import React, { useState, useEffect, ReactElement, FC } from "react";
import SwitchUI, { SwitchProps } from "@material-ui/core/Switch";

interface Props extends SwitchProps {
  confirm?: (arg0: (val: boolean) => void) => void;
}

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
          rest.onChange && rest.onChange(val, !isChecked);
        }
      }}
    />
  );
};

export default Switch;

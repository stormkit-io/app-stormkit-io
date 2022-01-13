import React, { useState, useEffect, ReactElement, FC } from "react";
import SwitchUI, { SwitchProps } from "@material-ui/core/Switch";

interface Props extends SwitchProps {
  confirm?: (arg0: (val: boolean) => void) => void;
  withWrapper?: boolean;
  children?: React.ReactNode;
}

/**
 * Wrap the Material-UI Switch component since it does not
 * support a default checked value.
 */
const Switch: FC<Props> = ({
  checked = false,
  confirm,
  withWrapper,
  children,
  ...rest
}: Props): ReactElement => {
  const [isChecked, setChecked] = useState<boolean>(checked);

  useEffect(() => {
    setChecked(checked);
  }, [checked]);

  const component = (
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

  return withWrapper ? (
    <div className="flex w-full border border-solid border-gray-85 rounded py-2 items-center text-sm bg-gray-90">
      <label className="cursor-pointer">
        {component}
        {children}
      </label>
    </div>
  ) : (
    <label className="cursor-pointer">
      {component}
      {children}
    </label>
  );
};

export default Switch;

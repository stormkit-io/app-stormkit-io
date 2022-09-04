import React, { useState, useEffect, ReactElement, FC } from "react";
import { Tooltip } from "@mui/material";
import SwitchUI, { SwitchProps } from "@mui/material/Switch";

interface Props extends SwitchProps {
  confirm?: (arg0: (val: boolean) => void) => void;
  withWrapper?: boolean;
  children?: React.ReactNode;
  tooltip?: React.ReactNode;
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
  tooltip,
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
    <div className="flex w-full border border-solid border-gray-85 rounded-sm py-2 items-center text-sm bg-gray-90 pr-3">
      <label className="cursor-pointer flex-grow">
        {component}
        {children}
      </label>
      {tooltip && (
        <Tooltip title={tooltip} arrow className="relative right-px text-black">
          <span className="fas fa-question-circle" />
        </Tooltip>
      )}
    </div>
  ) : (
    <label className="cursor-pointer">
      {component}
      {children}
    </label>
  );
};

export default Switch;

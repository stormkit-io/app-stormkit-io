import React, { ReactElement, FC } from "react";
import cn from "classnames";
import SelectInput from "@material-ui/core/Select";

type Props = {
  onChange: (arg0: any) => void;
  variant?: "filled" | "standard" | "outlined";
  className?: string;
  name: string;
  displayEmpty: boolean;
  value: string;
};

const Select: FC<Props> = ({
  onChange,
  className,
  variant,
  ...rest
}: Props): ReactElement => {
  return (
    <SelectInput
      className={cn("w-full", className)}
      onChange={e => onChange && onChange(e.target.value)}
      variant={variant}
      SelectDisplayProps={{ className: "flex items-center p-4 w-full" }}
      {...rest}
    />
  );
};

Select.defaultProps = {
  variant: "filled"
} as Partial<Props>;

export default Select;

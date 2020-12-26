import React, { forwardRef, MutableRefObject } from "react";
import cn from "classnames";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  value: string;
}

const Option: React.FC<Props> = forwardRef(
  (
    { children, className, disabled, value, ...rest },
    ref
  ): React.ReactElement => {
    return (
      <div
        className={cn(
          "border-b border-solid border-gray-80",
          {
            "cursor-pointer hover:bg-gray-90": !disabled,
            "bg-gray-85 text-gray-60": disabled
          },
          className
        )}
        {...rest}
        ref={ref as MutableRefObject<HTMLDivElement>}
      >
        <div className="flex p-4 items-center">{children}</div>
      </div>
    );
  }
);

export default Option;

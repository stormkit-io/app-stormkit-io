import React, {
  ReactNode,
  FC,
  forwardRef,
  ReactElement,
  MutableRefObject
} from "react";
import cn from "classnames";

type Props = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

const Option: FC<Props> = forwardRef(({
  children,
  className,
  disabled,
  ...rest
}: Props, ref): ReactElement => {
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
});

export default Option;

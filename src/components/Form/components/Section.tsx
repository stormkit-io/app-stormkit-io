import React, { ReactNode, FC, ReactElement } from "react";
import cn from "classnames";

type Props = {
  marginBottom: string; // The tailwind class for the marginBottom
  children: ReactNode;
  className: string;
  label: ReactNode;
}

const Section: FC<Props> = ({
  children,
  className,
  label,
  marginBottom = "mb-8"
}: Props): ReactElement => {

  return (
    <div className={cn("flex", marginBottom, className)}>
      <div className="flex-auto pt-4 min-w-48 max-w-48 font-bold">{label}</div>
      <div className="flex-auto">{children}</div>
    </div>
  );
};

export default Section;

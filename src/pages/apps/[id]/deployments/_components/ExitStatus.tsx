import React from "react";
import cn from "classnames";

interface Props {
  code: null | number;
  iconOnly?: boolean;
  className?: string;
}

const ExitStatus: React.FC<Props> = ({ code, iconOnly, className, ...rest }) =>
  code === 0 ? (
    <span className={cn("text-green-50", className)} {...rest}>
      <span className="fas fa-check-circle" /> {!iconOnly && "Success"}
    </span>
  ) : code !== null ? (
    <span className={cn("text-red-50", className)} {...rest}>
      <span className="fas fa-times-circle" /> {!iconOnly && "Failed"}
    </span>
  ) : (
    <span className={cn("text-blue-40", className)} {...rest}>
      <span className="fas fa-running" /> {!iconOnly && "Running"}
    </span>
  );

export default ExitStatus;

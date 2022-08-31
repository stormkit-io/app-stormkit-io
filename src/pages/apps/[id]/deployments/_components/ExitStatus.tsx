import React from "react";
import cn from "classnames";

const exitSuccess = 0;
const exitStoppedManually = -1;

interface ExitStatusProps {
  code: number | null;
  iconOnly: boolean;
  className?: string;
}

const ExitStatus = ({
  code,
  iconOnly,
  className,
  ...rest
}: ExitStatusProps): React.ReactElement =>
  code === exitSuccess ? (
    <span className={cn("text-green-50", className)} {...rest}>
      <span className="fas fa-check-circle" /> {!iconOnly && "Success"}
    </span>
  ) : code === exitStoppedManually ? (
    <span className={cn("text-red-50", className)} {...rest}>
      <span className="fas fa-stop-circle" /> {!iconOnly && "Stopped"}
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

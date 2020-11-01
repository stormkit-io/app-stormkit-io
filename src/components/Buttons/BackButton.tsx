import React, { FC, ReactElement } from "react";
import cn from "classnames";
import Link from "../Link";
import "./BackButton.css";

type Props = {
  className?: string;
  to: string;
  size?: number;
};

const BackButton: FC<Props> = ({
  to,
  className,
  size = 8,
  ...rest
}: Props): ReactElement => (
    <Link
      className={cn(
        "back-button relative inline-block leading-none",
        `w-${size} h-${size}`,
        {
          "text-3xl": size === 8,
          "text-2xl": size === 6
        },
        className
      )}
      {...rest}
      to={to}
    >
      <span className="fas fa-circle fa-stack-1x text-secondary" />
      <span className="fas fa-arrow-alt-circle-left fa-stack-1x text-blue-20" />
    </Link>
  );

export default BackButton;

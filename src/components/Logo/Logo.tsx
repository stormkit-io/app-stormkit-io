import React, { ReactElement, FC } from "react";
import cn from "classnames";
import logo from "~/assets/images/stormkit-logo.svg";

interface Props {
  iconOnly: boolean;
  iconSize: number;
  className: string;
}

const Logo: FC<Props> = ({
  iconOnly,
  className,
  iconSize = 16,
  ...rest
}: Props): ReactElement => {
  return (
    <span className={cn("inline-flex items-center", className)} {...rest}>
      <img
        src={logo}
        alt="Stormkit Logo"
        className={`inline-block mr-4 w-${iconSize}`}
      />
      {!iconOnly && (
        <span className="font-bold text-lg text-secondary hover:text-white">
          Stormkit
        </span>
      )}
    </span>
  );
};

export default Logo;

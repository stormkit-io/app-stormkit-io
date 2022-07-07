import React from "react";
import cn from "classnames";
import logoText from "~/assets/logos/stormkit-logo-text-h-white.svg";
import logoIcon from "~/assets/logos/stormkit-logo-circle.svg";

interface Props {
  iconOnly?: boolean;
  iconSize?: number;
  className?: string;
}

const Logo: React.FC<Props> = ({
  iconOnly = false,
  className,
  iconSize = 16,
  ...rest
}: Props): React.ReactElement => {
  return (
    <span className={cn("inline-flex items-center", className)} {...rest}>
      <img
        src={iconOnly ? logoIcon : logoText}
        alt="Stormkit Logo"
        className={cn(`inline-block w-${iconSize}`, {
          "w-28": !iconOnly,
          "w-8": iconOnly,
        })}
      />
      {!iconOnly && (
        <span className="font-bold text-lg text-secondary hover:text-white">
          {document.cookie.indexOf("sk_canary=true") > -1 ? "canary" : ""}
        </span>
      )}
    </span>
  );
};

export default Logo;

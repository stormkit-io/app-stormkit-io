import React from "react";
import cn from "classnames";
import logoText from "~/assets/logos/stormkit-logo-text-h-white.svg";
import logoIcon from "~/assets/logos/stormkit-logo-circle.svg";
import { connect } from "~/utils/context";
import AuthContext, { AuthContextProps } from "~/pages/auth/Auth.context";

interface Props extends AuthContextProps {
  iconOnly?: boolean;
  iconSize?: number;
  className?: string;
}

const Logo: React.FC<Props> = ({
  iconOnly = false,
  className,
  iconSize = 16,
  user,
  ...rest
}: Props): React.ReactElement => {

  const isCanary = () =>
    window.document.cookie.indexOf("sk_canary=true") > -1 ? true : false;
  const enableCanary = () => {
    window.document.cookie = "sk_canary=true";
  };
  const disableCanary = () => {
    window.document.cookie = "sk_canary=false";
  };

  const color = isCanary() ? "text-white" : "text-gray-800"

  return (
    <span
      className={cn("flex flex-direction row items-center", className)}
      {...rest}
    >
      <div className="flex">
        <img
          src={iconOnly ? logoIcon : logoText}
          alt="Stormkit Logo"
          className={cn(`inline-block w-${iconSize}`, {
            "w-28": !iconOnly,
            "w-8": iconOnly,
          })}
        />
        {user?.isAdmin == true && !iconOnly && (
          <div>
            <div
              style={{ padding: "10px" }}
              onClick={() => (isCanary() ? disableCanary() : enableCanary() )}
            >
              <p className={color} >Canary</p>
            </div>
          </div>
        )}
      </div>
    </span>
  );
};

export default connect<Props, AuthContextProps>(Logo, [
  { Context: AuthContext, props: ["user"] },
]);


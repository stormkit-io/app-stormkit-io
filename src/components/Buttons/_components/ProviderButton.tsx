import React, { FC, ReactElement, ReactNode } from "react";
import cn from "classnames";
import Button from "~/components/Button";

type Props = {
  provider: "github" | "gitlab" | "bitbucket";
  text: "GitHub" | "GitLab" | "Bitbucket";
  type?: "button" | "submit";
  children: ReactNode;
  className?: string;
}

const ProviderButton: FC<Props> = ({
  provider,
  text,
  type = "button",
  children,
  className,
  ...rest
}: Props): ReactElement => {
  return (
    <Button
      {...rest}
      type={type}
      className={cn(
        [
          `button-${provider}`,
          "w-full",
          "items-center",
          "border",
          `border-${provider}`,
          `text-${provider}`,
          `hover:bg-${provider}`,
          "hover:text-white",
          "rounded-xl"
        ],
        className
      )}
    >
      {children}
      <span className={`text-xl mr-3 fab fa-${provider}`} />
      <span>{text}</span>
    </Button>
  );
};

export default ProviderButton;

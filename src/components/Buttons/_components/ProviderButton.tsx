import React from "react";
import cn from "classnames";
import Button from "~/components/Button";

export interface Props extends React.HTMLProps<HTMLButtonElement> {
  provider: Provider;
  text: ProviderText;
}

export type OmittedProps = Omit<Props, "provider" | "text">;

const ProviderButton: React.FC<Props> = ({
  provider,
  text,
  type = "button",
  children,
  className,
  ...rest
}): React.ReactElement => {
  return (
    <Button
      {...rest}
      ref={undefined}
      as="button"
      type={type}
      className={cn(
        [
          `button-${provider}`,
          "w-full",
          "items-center",
          "border",
          `hover:border-${provider}`,
          `hover:text-${provider}`,
          "rounded-xl",
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

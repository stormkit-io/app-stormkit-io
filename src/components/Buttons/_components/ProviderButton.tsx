import React from "react";
import cn from "classnames";
import Button from "~/components/Button";

export interface Props extends React.HTMLProps<HTMLButtonElement> {
  itemsCenter?: boolean;
  text: ProviderText;
  logo: string;
}

export type OmittedProps = Omit<Props, "logo" | "text">;

const ProviderButton: React.FC<Props> = ({
  text,
  type = "button",
  logo,
  itemsCenter,
  className,
  children,
  ...rest
}): React.ReactElement => {
  return (
    <Button
      {...rest}
      ref={undefined}
      as="button"
      type={type}
      secondary
      className={cn(
        ["items-center", "border", "w-full", "mx-auto", "max-w-72"],
        className
      )}
    >
      {children}
      <span className="flex w-full">
        <span
          className={cn("flex flex-0 ml-6", {
            "justify-end min-w-1/3": !itemsCenter,
          })}
        >
          <img src={logo} className="text-xl" />
        </span>
        <span className="flex flex-1 justify-start ml-3">{text}</span>
      </span>
    </Button>
  );
};

export default ProviderButton;

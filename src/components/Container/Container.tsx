import React from "react";
import cn from "classnames";

interface Props {
  bg?: "bg-blue-50";
  maxWidth?: "w-max-w-2xl";
  margin?: "m-auto";
  title: React.ReactNode;
  actions?: React.ReactNode;
  className?: string | string[] | Record<string, boolean>;
  children: React.ReactNode;
}

const Container: React.FC<Props> = ({
  title,
  actions,
  children,
  className,
  margin = "m-auto",
  maxWidth = "max-w-2xl",
  bg = "bg-blue-50",
}) => {
  return (
    <div
      className={cn(["w-full text-gray-80", margin, maxWidth, bg, className])}
    >
      <div className="flex p-4 items-center">
        <h3 className="font-bold">{title}</h3>
        {actions && (
          <div className="flex flex-1 justify-end text-sm">{actions}</div>
        )}
      </div>
      {children}
    </div>
  );
};

export default Container;
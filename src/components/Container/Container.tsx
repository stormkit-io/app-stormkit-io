import React from "react";
import cn from "classnames";

interface Props {
  bg?: "bg-blue-50";
  maxWidth?: "max-w-2xl" | "max-w-none";
  margin?: "m-auto";
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string | string[] | Record<string, boolean>;
  children: React.ReactNode;
}

const Container: React.FC<Props> = ({
  title,
  subtitle,
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
      {(title || actions) && (
        <div className="flex p-4">
          {(title || subtitle) && (
            <div className="flex flex-col">
              {title && (
                <h3 className="flex items-center font-bold">{title}</h3>
              )}
              {subtitle && <h4 className="flex items-center">{subtitle}</h4>}
            </div>
          )}
          {actions && (
            <div className="flex flex-1 justify-end text-sm ml-4">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Container;

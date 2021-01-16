import React, { useRef, forwardRef, ReactElement } from "react";
import cn from "classnames";
import Spinner from "~/components/Spinner";
import Link from "~/components/Link";
import "./Button.css";

export interface Props extends React.HTMLProps<HTMLButtonElement> {
  as?: "div" | "span" | "a" | "button";
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  loading?: boolean;
  styled?: boolean;
  href?: string;
}

const prepareStyles = (
  classes: Array<string>,
  options: { primary?: boolean; secondary?: boolean; tertiary?: boolean }
) => {
  const { primary, secondary, tertiary } = options;

  classes.push(
    ...[
      "relative",
      "inline-flex",
      "p-4",
      "items-center",
      "justify-center",
      "rounded-lg",
      "button"
    ]
  );

  if (primary) {
    classes.push("bg-pink-50", "text-white");
  } else if (secondary) {
    classes.push("bg-blue-20", "text-secondary");
  } else if (tertiary) {
    // TODO: Implement me
  }
};

const Button = forwardRef<HTMLButtonElement, Props>(
  (properties: Props, parentRef): ReactElement => {
    const {
      children,
      primary,
      secondary,
      tertiary,
      loading,
      className,
      disabled,
      href,
      as = "button",
      styled = true,
      ...rest
    } = properties;

    const linkRef = useRef<HTMLAnchorElement>(null);
    const classes: Array<string> = [];

    if (styled) {
      prepareStyles(classes, { primary, secondary, tertiary });
    }

    const props = {
      className: cn(classes, className),
      disabled: disabled || loading ? "disabled" : undefined,
      ...rest
    };

    const content = (
      <>
        {as !== "button"
          ? children
          : children && (
              <span
                className={cn(
                  "inline-flex",
                  "items-center",
                  "w-full",
                  "justify-center",
                  {
                    invisible: loading
                  }
                )}
              >
                {children}
              </span>
            )}
        {loading && <Spinner width={6} height={6} className="button-spinner" />}
        {href && <Link to={href} className="hidden" ref={linkRef} />}
      </>
    );

    if (rest.onClick && as !== "a" && as !== "button") {
      props.tabIndex = 0;
      props.role = "button";

      if (!props.onKeyDown) {
        props.onKeyDown = (e: React.KeyboardEvent) =>
          (e.key === "Enter" || e.key === " ") &&
          props.onClick &&
          props.onClick(
            (e as unknown) as React.MouseEvent<HTMLButtonElement, MouseEvent>
          );
      }
    }

    if (href && as !== "a") {
      if (as !== "button") {
        props.tabIndex = 0;
        props.role = "button";
      }

      props.onClick = () => {
        linkRef.current?.click();
      };

      props.onKeyDown = (e: React.KeyboardEvent) => {
        (e.key === "Enter" || e.key === " ") && linkRef.current?.click();
      };
    }

    props.ref = parentRef;

    return React.createElement(as, props, content);
  }
);

export default Button;

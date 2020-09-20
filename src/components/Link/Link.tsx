import React, { forwardRef, FC, ReactElement } from "react";
import cn from "classnames";
import { Link as OriginalLink } from "react-router-dom";

interface Props {
  to: string,
  children: HTMLElement,
  className: string,
  secondary: boolean,
  tertiary: boolean,
  rel?: string,
  target?: string
}

const Link: FC<Props> = forwardRef<HTMLAnchorElement, Props>(
  ({ to, children, secondary, tertiary, className, ...props }: Props, ref): ReactElement => {
    let isExternal = false;
    let classes: string = className;

    if (secondary) {
      classes = cn(className, "text-pink-50", "hover:text-red-50");
    } else if (tertiary) {
      classes = cn(
        className,
        "text-primary",
        "font-bold",
        "hover:text-pink-50"
      );
    }

    if (to.indexOf("http") === 0 || to.indexOf("//") === 0) {
      props.rel = "noreferrer noopener";
      props.target = "_blank";
      isExternal = true;
    } else if (to.indexOf("mailto:") === 0) {
      isExternal = true;
    }

    if (isExternal) {
      return (
        <a href={to} {...props} ref={ref} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <OriginalLink to={to} {...props} className={classes} ref={ref}>
        {children}
      </OriginalLink>
    );
  }
);

export default Link;

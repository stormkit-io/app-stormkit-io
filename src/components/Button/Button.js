import React, { useRef } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Spinner from "~/components/Spinner";
import Link from "~/components/Link";
import "./Button.css";

const Button = ({
  children,
  primary,
  secondary,
  tertiary,
  loading,
  className,
  disabled,
  href,
  as,
  styled,
  ...rest
}) => {
  const linkRef = useRef(null);
  const classes = ["relative"];

  if (styled) {
    classes.push(
      ...[
        "inline-flex",
        "p-4",
        "items-center",
        "justify-center",
        "rounded-lg",
        "button",
      ]
    );

    if (primary) {
      classes.push("bg-pink-50", "text-white");
    } else if (secondary) {
      classes.push("bg-blue-20", "text-secondary");
    } else if (tertiary) {
    }
  }

  const props = {
    className: cn(classes, className),
    disabled: disabled || loading ? "disabled" : undefined,
    ...rest,
  };

  const content = (
    <>
      <span
        className={cn(
          "inline-flex",
          "items-center",
          "w-full",
          "justify-center",
          {
            invisible: loading,
          }
        )}
      >
        {children}
      </span>
      {loading && <Spinner width={6} height={6} className="button-spinner" />}
      {href && <Link to={href} className="hidden" ref={linkRef} />}
    </>
  );

  if (rest.onClick && as !== "a" && as !== "button") {
    props.tabIndex = 0;
    props.role = "button";
  }

  if (href && as !== "a") {
    if (as !== "button") {
      props.tabIndex = 0;
      props.role = "button";
    }

    props.onClick = () => {
      linkRef.current.click();
    };

    props.onKeyDown = (e) => {
      (e.key === "Enter" || e.key === " ") && linkRef.current.click();
    };
  }

  return React.createElement(as, props, content);
};

Button.defaultProps = {
  as: "button",
  styled: true,
};

Button.propTypes = {
  loading: PropTypes.bool,
  className: PropTypes.any,
  children: PropTypes.node,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  tertiary: PropTypes.bool,
  href: PropTypes.string,
  styled: PropTypes.bool,
  as: PropTypes.string,
};

export default Button;

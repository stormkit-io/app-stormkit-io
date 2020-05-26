import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Spinner from "~/components/Spinner";
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
  ...rest
}) => {
  const classes = [
    "inline-flex",
    "p-4",
    "items-center",
    "justify-center",
    "rounded-lg",
    "button",
    "relative",
  ];

  if (primary) {
    classes.push("bg-pink-50", "text-white");
  } else if (secondary) {
    classes.push("bg-blue-20", "text-secondary");
  } else if (tertiary) {
  }

  const props = {
    className: cn(classes, className),
    disabled: disabled || loading ? "disabled" : undefined,
    ...rest,
  };

  const content = (
    <>
      <span
        className={cn("inline-flex", "items-center", { invisible: loading })}
      >
        {children}
      </span>
      {loading && <Spinner width={6} height={6} className="button-spinner" />}
    </>
  );

  if (href) {
    as = "a";
    props.href = href;
  }

  return React.createElement(as, props, content);
};

Button.defaultProps = {
  as: "button",
};

Button.propTypes = {
  loading: PropTypes.bool,
  className: PropTypes.any,
  children: PropTypes.node,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  tertiary: PropTypes.bool,
  href: PropTypes.string,
  as: PropTypes.string,
};

export default Button;

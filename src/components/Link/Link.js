import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { Link as OriginalLink } from "react-router-dom";

const Link = forwardRef(
  ({ to, children, secondary, className, ...props }, ref) => {
    let isExternal = false;
    let classes = className;

    if (secondary) {
      classes = cn(className, "text-pink-50", "hover:text-secondary");
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

Link.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.any,
  secondary: PropTypes.bool,
};

export default Link;

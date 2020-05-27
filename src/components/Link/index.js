import React from "react";
import PropTypes from "prop-types";
import { Link as OriginalLink } from "react-router-dom";

const Link = ({ to, children, ...props }) => {
  let isExternal = false;

  if (to.indexOf("http") === 0 || to.indexOf("//") === 0) {
    props.rel = "noreferrer noopener";
    props.target = "_blank";
    isExternal = true;
  }

  if (isExternal) {
    return (
      <a href={to} {...props}>
        {children}
      </a>
    );
  }

  return (
    <OriginalLink to={to} {...props}>
      {children}
    </OriginalLink>
  );
};

Link.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
};

export default Link;

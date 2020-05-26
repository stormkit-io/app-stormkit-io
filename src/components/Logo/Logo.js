import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import logo from "~/assets/images/stormkit-logo.svg";

const Logo = ({ iconOnly, className, iconSize = 16, ...rest }) => {
  return (
    <span className={cn("inline-flex items-center", className)} {...rest}>
      <img
        src={logo}
        alt="Stormkit Logo"
        className={`inline-block mr-4 w-${iconSize}`}
      />
      {!iconOnly && (
        <span className="font-bold text-lg text-white">Stormkit</span>
      )}
    </span>
  );
};

Logo.propTypes = {
  iconOnly: PropTypes.bool,
  iconSize: PropTypes.number,
  className: PropTypes.string,
};

export default Logo;

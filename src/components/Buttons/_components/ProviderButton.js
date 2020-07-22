import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import Button from "~/components/Button";

const ProviderButton = ({ provider, text, children, className, ...rest }) => {
  return (
    <Button
      type="button"
      {...rest}
      className={cn(
        [
          `button-${provider}`,
          "w-full",
          "items-center",
          "border",
          `border-${provider}`,
          `text-${provider}`,
          `hover:bg-${provider}`,
          "hover:text-white",
          "rounded-xl",
        ],
        className
      )}
    >
      {children}
      <span className={`text-xl mr-3 fab fa-${provider}`} />
      <span>{text}</span>
    </Button>
  );
};

ProviderButton.propTypes = {
  provider: PropTypes.oneOf(["github", "gitlab", "bitbucket"]),
  text: PropTypes.oneOf(["GitHub", "GitLab", "Bitbucket"]),
  children: PropTypes.node,
  className: PropTypes.any,
};

export default ProviderButton;

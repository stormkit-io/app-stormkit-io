import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Icon } from "./InfoBox.styles";

const icon = props => {
  if (props.actionRequired) {
    return "fas fa-briefcase";
  }

  if (props.warning) {
    return "fas fa-radiation";
  }

  if (props.error) {
    return "fas fa-exclamation-triangle";
  }

  if (props.success) {
    return "fas fa-check";
  }

  return "fas fa-info-circle";
};

const InfoBox = ({ children, scrollIntoView, noIcon, ...props }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && scrollIntoView) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ref, scrollIntoView]);

  return (
    <Box ref={ref} {...props}>
      {noIcon !== true && <Icon className={icon(props)} />} {children}
    </Box>
  );
};

InfoBox.propTypes = {
  children: PropTypes.node,
  noIcon: PropTypes.bool,
  scrollIntoView: PropTypes.bool,
  actionRequired: PropTypes.bool
};

export default InfoBox;

import React from "react";
import PropTypes from "prop-types";
import InfoBox from "~/components/InfoBox";
import styled from "styled-components";

const StyledInfoBox = styled(InfoBox)`
  text-align: left;
`;

const Success = ({ message, ...props }) => {
  if (!message) {
    return null;
  }

  if (!props.info && !props.success) {
    props.success = true;
  }

  return <StyledInfoBox {...props}>{message}</StyledInfoBox>;
};

Success.propTypes = {
  /**
   * The success message.
   */
  message: PropTypes.string,
};

export default Success;

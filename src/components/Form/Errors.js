import React from "react";
import PropTypes from "prop-types";
import InfoBox from "~/components/InfoBox";
import styled from "styled-components";
import { props } from "~/assets/styles";

const StyledInfoBox = styled(InfoBox)`
  text-align: left;
`;

const UL = styled.ul`
  li {
    margin-bottom: ${props.sizes.s};

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Errors = ({ errors, ...props }) => {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <StyledInfoBox {...props} error>
      <UL>
        {Object.keys(errors).map(err => (
          <li key={err}>{errors[err]}</li>
        ))}
      </UL>
    </StyledInfoBox>
  );
};

Errors.propTypes = {
  /**
   * An object of errors.
   */
  errors: PropTypes.object
};

export default Errors;

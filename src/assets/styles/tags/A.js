import React from "react";
import styled, { css } from "styled-components";
import props from "../props";
import { Link } from "react-router-dom";

export const styles = css`
  color: ${p => p.color || props.linkBase};
  transition: color 0.1s ease-in-out;
  position: relative;
  display: inline-block;
  text-decoration: none;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const InternalLink = styled(Link)`
  ${styles}
`;

const ExternalLink = styled.a`
  ${styles}
`;

export default props => {
  if (props.to && props.to.indexOf("http") === 0) {
    const newProps = { ...props, to: undefined, href: props.to };
    return <ExternalLink {...newProps} target="_blank" />;
  } else {
    return <InternalLink {...props} />;
  }
};

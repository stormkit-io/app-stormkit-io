import { css } from "styled-components";
import styled from "styled-components";
import props from "~/assets/styles/props";

export const InputStyles = css`
  outline: none;
  width: 100%;
  background: white;
  padding: ${props.sizes.m};
  border-radius: ${props.borderRadiusS};
  border: 1px solid ${props.gray80};
  font-size: 0.9rem;
  transition: border-color ease-in 0.1s;

  &:focus {
    border-color: ${props.gray70};
  }

  &[disabled] {
    background: ${props.gray80};
  }
`;

export const Icon = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: ${props.sizes.l};
  color: ${props.gray70};
  left: ${p => (p.position === "left" ? props.sizes.xl : "auto")};
  right: ${p => (p.position === "right" ? props.sizes.xl : "auto")};
  cursor: ${p => (p.clickable ? "pointer" : "")};
`;

Icon.defaultProps = {
  position: "right"
};

export default styled.input`
  ${InputStyles}
`;

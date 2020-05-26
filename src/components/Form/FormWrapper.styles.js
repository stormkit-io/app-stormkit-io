// This is the label that is displayed within the input
import styled from "styled-components";
import { default as props, sizes } from "~/assets/styles/props";

// Example: Checkbox Label
export const InlineLabel = styled.span`
  cursor: pointer;
  font-size: ${(p) => p.fontSize || "0.9rem"};
  color: ${props.colors.font};
  user-select: none;
`;

// Example: Text Label
export const Label = styled.span`
  position: absolute;
  margin-bottom: ${(p) => (p.hasValue ? "-0.5rem" : "")};
  bottom: ${(p) => (p.hasValue ? "100%" : "50%")};
  left: ${(p) => (p.hasValue ? 0 : p.padding || props.sizes.m)};
  transform: ${(p) => (p.hasValue ? "translateY(-100%)" : "translateY(50%)")};
  transition: all ${props.transitionXS} ${props.transitionStart};
  font-size: ${(p) => (p.hasValue ? "0.9rem" : p.fontSize || "1rem")};
  color: ${(p) => (p.hasValue ? props.colors.fontSecondary : props.gray50)};
`;

export const Error = styled.span`
  position: absolute;
  top: 100%;
  margin-top: ${sizes.m};
  right: 0;
  background: rgba(111, 22, 5, 0.8);
  color: white;
  padding: ${sizes.s};
  font-size: 0.8rem;
  border-radius: ${props.borderRadiusM};
  z-index: 1;

  &:before {
    content: "";
    position: absolute;
    right: 2rem;
    bottom: 100%;
    width: 0;
    height: 0;
    border-left: ${sizes.s} solid transparent;
    border-right: ${sizes.s} solid transparent;
    border-bottom: ${sizes.s} solid rgba(111, 22, 5, 0.8);
  }
`;

export const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  width: ${(p) => p.width || "100%"};
  margin: ${(p) => p.margin || 0};
`;

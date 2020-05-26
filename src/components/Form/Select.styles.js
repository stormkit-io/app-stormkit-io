import styled from "styled-components";
import { InputStyles } from "~/components/Form/Input.styles";
import props from "~/assets/styles/props";

export const Selected = styled.div`
  padding: ${props.sizes.m};
  background: transparent;
  flex: 1 1 auto;
  cursor: pointer;
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  // Hack to have the same height with other inputs.
  &:empty:before {
    content: "x";
    visibility: hidden;
  }

  &:after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 50%;
    right: 0;
    margin-right: ${(p) => p.padding || props.sizes.m};
    border: solid ${props.gray70};
    border-width: 0 3px 3px 0;
    padding: 3px;
    transition: border ${props.transitionS} ${props.transitionStart};
    transform: translateY(-50%) rotate(45deg);
  }

  &:hover:after {
    border: solid ${props.gray30};
    border-width: 0 3px 3px 0;
  }
`;

export const Wrapper = styled.div`
  ${InputStyles}
  position: relative;
  display: flex;
  font-size: ${props.sizes.m};
  padding: 0;
  outline: none;
  cursor: ${(p) => (p.disabled ? "default" : "pointer")};

  ${Selected} {
    background: ${(p) => (p.disabled ? props.gray80 : undefined)};
  }
`;

Wrapper.defaultProps = {
  border: `1px solid ${props.gray80}`,
};

export const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: -1px;
  right: -1px;
  margin-top: 1px;
  border: ${(p) => p.border};
  border-top: none;
  background: ${(p) => p.background || props.gray90};
  box-shadow: ${(p) => p.shadow || props.shadowM};
  max-height: ${(p) => (p.open ? p.maxHeight || "20rem" : "0")};
  visibility: ${(p) => (p.open ? "visible" : "hidden")};
  overflow-x: none;
  overflow-y: auto;
  z-index: 999999;
  user-select: none;
  padding: ${props.sizes.m};
  transition: ${(p) => (p.open ? `all 0.1s ease-in-out` : "none")};
`;

Dropdown.defaultProps = {
  border: `1px solid ${props.gray80}`,
};

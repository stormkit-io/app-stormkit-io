import styled from "styled-components";
import { props } from "~/assets/styles";

export const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
`;

export const Item = styled.div`
  background: ${(p) => (p.selected ? props.colors.primary[100] : "white")};
  color: ${(p) => (p.selected ? "white" : undefined)};
  padding: ${props.sizes.m};
  border: 1px solid ${props.gray80};
  font-size: 0.9rem;
  border-right: none;
  cursor: pointer;
  user-select: none;

  &:first-child {
    border-top-left-radius: ${props.borderRadiusS};
    border-bottom-left-radius: ${props.borderRadiusS};
  }

  &:last-child {
    border-top-right-radius: ${props.borderRadiusS};
    border-bottom-right-radius: ${props.borderRadiusS};
    border-right: 1px solid ${props.gray80};
  }
`;

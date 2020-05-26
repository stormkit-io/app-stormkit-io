import styled from "styled-components";
import props from "../props";

export default styled.span`
  cursor: pointer;
  color: ${props.fontSecondary};
  text-decoration: underline;
  user-select: none;

  &:hover {
    color: ${props.colors.primary[100]};
  }
`;

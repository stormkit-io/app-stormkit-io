import styled from "styled-components";
import { props } from "~/assets/styles";

export { Button } from "~/assets/styles";
export * from "../../../styles";

export const H2 = styled.h2`
  color: ${props.colors.primary[100]};
  font-size: ${props.sizes.xl};
`;

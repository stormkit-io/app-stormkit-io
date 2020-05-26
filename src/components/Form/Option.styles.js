import props from "~/assets/styles/props";
import styled from "styled-components";

const Option = styled.div`
  padding: ${(p) => p.padding || props.sizes.m};
  cursor: pointer;
  background: ${(p) =>
    p.selected ? props.blue40 : p.highlighted ? props.gray85 : "white"};
  display: ${(p) => p.display};
  flex-direction: ${(p) => p.flexDirection};
  justify-content: ${(p) => p.justifyContent};
  align-items: ${(p) => p.alignItems};
  font-size: ${props.sizes.m};
  transition: background 0.1s ease-in;

  &:hover {
    background: ${props.colors.borders};
  }
`;

Option.defaultProps = {
  display: "flex",
  alignItems: "center",
};

export default Option;

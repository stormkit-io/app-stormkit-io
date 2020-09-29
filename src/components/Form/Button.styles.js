import styled from "styled-components";
import Spinner from "~/components/Spinner";
import themes from "~/assets/styles/themes";
import props from "~/assets/styles/props";

export const ButtonSpinner = styled(Spinner)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
`;

export const StyledText = styled.span`
  visibility: ${p => (p.loading ? "hidden" : "")};
`;

const Button = styled.button.attrs({
  theme: p => themes.get(p.theme)
})`
  position: relative;
  padding: ${props.sizes.m};
  background: ${p => p.theme.background};
  color: ${p => p.theme.color};
  border: none;
  border-radius: ${props.borderRadiusS};
  cursor: pointer;
  outline: none;
  transition: all ${props.transitionS} ${props.transitionStart};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;

  &:hover {
    background: ${p => p.theme.hoverBackground};
    color: ${p => p.theme.hoverColor};
  }

  &:active {
    box-shadow: ${props.shadowM};
  }

  ${ButtonSpinner} {
    width: 32px;
    height: 32px;
    margin: 0 auto;
  }
`;

Button.defaultProps = {
  primary: true,
  secondary: false,
  tertiary: false,
  height: "52px",
  padding: `0 ${props.sizes.m}`
};

export default Button;

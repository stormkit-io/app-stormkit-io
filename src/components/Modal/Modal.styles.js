import styled, { keyframes } from "styled-components";
import { props } from "@ui";

const margin = "20%";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scale = keyframes`
  from { transform: scale(0.9); }
  to { transform: scale(1); }
`;

export const Close = styled.span`
  position: absolute;
  right: 1rem;
  top: 1rem;
  font-size: 1.5rem;
  cursor: pointer;

  @media (min-width: ${props.breakpoints.get("phablet")}) {
    display: none;
  }
`;

Close.timeout = 250;

export const Container = styled.div`
  margin: 0 ${p => p.margin || margin};
  flex: 1 1 auto;
  max-height: 100%;

  @media (max-width: ${props.breakpoints.get("tablet")}) {
    margin: ${props.sizes.xxl};
  }
`;

export const InnerContainer = styled.div`
  background-color: white;
  border-radius: ${props.borderRadiusM};
  overflow-x: auto;
`;

export const InnerOverlay = styled.div`
  display: flex;
  height: calc(100% - 2rem);
  align-items: center;
  overflow-x: auto;
  margin: 1rem 0;
`;

export const Overlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  animation: ${fadeIn} 0.1s ease-in;
  transition: all ${Close.timeout}ms ease-in;
  background: rgba(0, 0, 0, 0.8);
  z-index: 4;
  opacity: ${p => p.isAboutToClose && 0};

  ${Container} {
    transform: scale(${p => (p.isAboutToClose && !p.fullScreen ? 1.25 : 1)});
    transition: transform ${Close.timeout}ms ease-in-out;
    animation: ${scale} 0.1s ease-in;
  }

  ${InnerContainer} {
    max-height: ${p => (p.fullScreen ? "none" : "90vh")};
  }

  ${p =>
    p.fullScreen
      ? `
      ${Container}, ${InnerContainer}, ${InnerOverlay} {
        margin: 0;
        height: 100%
      }
      `
      : ""}

  @media (max-width: ${props.breakpoints.get("phablet")}) {
    ${Container}, ${InnerContainer}, ${InnerOverlay} {
        margin: 0;
        height: 100vh;
        max-height: none;
        border-radius: 0;
      }
  }
`;

export const Title = styled.div`
  padding: ${props.sizes.xl};
  text-align: ${p => p.textAlign || "left"};
  border-bottom: 1px solid ${props.gray80};
  border-top-right-radius: ${props.borderRadiusM};
  border-top-left-radius: ${props.borderRadiusM};
  font-size: ${props.sizes.ml};
  font-weight: bold;
`;

export const Content = styled.div`
  padding: ${p =>
    typeof p.padding !== "undefined" ? p.padding : props.sizes.m};
`;

export const Footer = styled.div`
  padding: ${props.sizes.m};
  padding-top: ${p => p.paddingTop};
  text-align: ${p => p.textAlign};
`;

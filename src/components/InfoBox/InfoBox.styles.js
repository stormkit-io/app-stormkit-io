import styled from "styled-components";
import props from "~/assets/styles/props";

const color = (p, num) => {
  return p.actionRequired
    ? props[`green${num}`]
    : p.warning
    ? props[`yellow${num}`]
    : p.error
    ? props[`red${num}`]
    : p.success
    ? props[`green${num}`]
    : props[`blue${num}`];
};

export const Icon = styled.span`
  font-size: ${props.sizes.xl};
  margin: 0 ${props.sizes.m} 0 0;
`;

export const Box = styled.div`
  border-radius: ${props.borderRadiusS};
  padding: ${props.sizes.l} ${props.sizes.m};
  background-color: ${(p) => color(p, 20)};
  color: ${(p) => color(p, 80)};
  display: flex;
  align-items: center;
  line-height: 1.3;
  margin-bottom: ${(p) => p.marginBottom};
  margin-top: ${(p) => p.marginTop};
  width: 100%;
`;

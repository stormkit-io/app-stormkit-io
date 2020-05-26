import styled, { css } from "styled-components";
import styles from "~/assets/styles/props";

const common = css`
  font-family: ${styles.fontLight};
  font-weight: bold;
  margin: 0 0 ${styles.sizes.m} 0;
`;

const H2 = styled.h2`
  ${common}
`;

H2.defaultProps = { fontSize: "1.3rem" };

const H4 = styled.h4`
  ${common}
`;

H4.defaultProps = { fontSize: "1.25rem" };

export { H2, H4 };

import { css } from "styled-components";
import { breakpoints } from "./props";

/**
 * @type {{
 *   phoneAndBigger: function,
 *   phoneAndSmaller: function,
 *   phabletAndBigger: function,
 *   phabletAndSmaller: function,
 *   tabletAndSmaller: function,
 *   tabletAndBigger: function,
 *   desktopAndSmaller: function,
 *   desktopAndBigger: function
 * }}
 */
const media = {};

breakpoints.forEach((value, key) => {
  media[`${key}AndBigger`] = (...args) => css`
    @media (min-width: ${value}) {
      ${css(...args)};
    }
  `;

  media[`${key}AndSmaller`] = (...args) => css`
    @media (max-width: ${value}) {
      ${css(...args)};
    }
  `;
});

/**
 * From each breakpoint, this will create an object like:
 *
 * {
 *   phoneAndBigger: ...,
 *   phoneAndSmaller: ...,
 *   tabletAndBigger: ...,
 *   tabletAndSmaller: ...,
 * }
 */
export default media;

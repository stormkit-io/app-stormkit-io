import { createGlobalStyle } from "styled-components";
import props from "./props";

export const styles = `
  /* http://meyerweb.com/eric/tools/css/reset/
     v2.0 | 20110126
     License: none (public domain)
  */

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  html {
    box-sizing: border-box;
    font-size: ${props.baseFontSize};
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    line-height: 1;
    font-family: 'Merriweather Sans', sans-serif;
    font-size: 14px;
    color: ${props.gray40};
    /*background: url(http://api.thumbr.it/whitenoise-10x10.png?background=f9f9f9ff&noise=626262&density=15&opacity=6);*/
    background: ${props.colors.background};
    color: ${props.colors.font};
    &:hover {
      cursor: default;
    }
  }

  ol, ul {
    list-style: none;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  a {
    color: ${props.colors.primary[100]};
    text-decoration: none;
  }

  a:hover {
    text-decoration: none;
  }

  button {
    background: 0;
    padding: 0;
    border: 0;
    color: ${props.colors.font};
    display: flex;
    justify-content: center;
    align-items: center;

    &:focus {
      outline: none;
    }

    &:hover {
      cursor: pointer;
      filter: brightness(110%); // browser support has some limits, but might be good enough
    }

    .fas, .fab {
      margin-right: ${props.sizes.m};
      font-size: ${props.sizes.l};
    }
  }

  ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
    color: ${props.gray50};
  }
  ::-moz-placeholder { /* Firefox 19+ */
    color: ${props.gray50};
  }
  :-ms-input-placeholder { /* IE 10+ */
    color: ${props.gray50};
  }
  :-moz-placeholder { /* Firefox 18- */
    color: ${props.gray50};
  }

  b {
    font-weight: bold;
  }

  p {
    line-height: 1.3
  }

  i {
    font-style: italic;
  }
`;

const GlobalStyle = createGlobalStyle`${styles}`;

export default GlobalStyle;

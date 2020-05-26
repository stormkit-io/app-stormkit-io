import themes from "./themes";

const T = themes.get();

const bp = new Map();
bp.set("phone", "319px");
bp.set("phablet", "480px");
bp.set("tablet", "800px");
bp.set("laptop", "994px");
bp.set("container", "1024px");
bp.set("desktop", "1364px");

export const breakpoints = bp;

export const sizes = {
  xxs: "0.1rem",
  xs: "0.25rem",
  s: "0.5rem",
  ms: "0.75rem",
  m: "1rem",
  ml: "1.25rem",
  l: "1.5rem",
  xl: "1.75rem",
  xxl: "2.25rem",
  xxxl: "3rem",
};

export default {
  ...T,

  baseFontSize: "14px",

  fontBase: "#4a4a4a",

  linkBase: T.colors.primary[100],
  linkBaseHover: "#fff",

  colorSuccess: "#43a047",
  colorError: "#ff3c15",
  colorInfo: "#3a74f9",

  colorBitbucket: "#004fd3",
  colorGitlab: "#6b4fbb",
  colorGithub: "#22292e",

  gray100: "#ffffff",
  gray90: "#f9f9f9",
  gray85: "#f2f2f2",
  gray80: "#e0e0e0",
  gray70: "#c5c5c5",
  gray60: "#b2b2b2",
  gray55: "#7B7A83",
  gray50: "#a4a4a4",
  gray40: "#4f4f4f",
  gray30: "#4a4a4a",
  gray20: "#333333",
  gray10: "#222222",
  gray00: "#000000",

  blue80: "#1564cc",
  blue70: "#1ac9db",
  blue60: "#1564cc6b",
  blue20: "#2c2c4a",

  green20: "#e0ffd9",
  green50: "#c8ffd1",
  green60: "#b2f3bc",
  green40: "#24b47e",
  green80: "#328c32",

  red20: "#f9e8e8",
  red50: "#d80202",
  red60: "#d70202",
  red80: "#bf3030",

  yellow50: "#e2ca00",
  yellow30: "#ceba14",

  padding: [sizes.s, sizes.ms, sizes.m],
  margin: [sizes.s, sizes.ms, sizes.m],

  transitionStart: "ease-in-out",
  transitionEnd: "ease-in",
  transitionXS: "0.125s",
  transitionS: "0.25s",
  transitionMS: "0.375s",
  transitionM: "0.5s",
  transitionL: "1s",

  borderRadiusS: "6px",
  borderRadiusM: "13px",
  borderRadiusL: "30px",

  shadowS: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  shadowMS: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
  shadowM: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
  shadowML: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)", // prettier-ignore
  shadowL: "0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)", // prettier-ignore
  shadowHover: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)", // prettier-ignore
  shadowTransition: "all 0.3s cubic-bezier(.25, .8, .25, 1)",

  fontLight: `'Source Sans Pro', sans-serif`,

  containerWidth: bp.get("container"),

  sizes,
  breakpoints,
};

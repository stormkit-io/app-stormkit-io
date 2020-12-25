module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["src/index.js", "src/**/*.js", "src/**/*.ts", "src/**/*.tsx"],
    options: {
      whitelist: [
        // Provider related dynamic classes
        "hover:bg-github",
        "hover:bg-gitlab",
        "hover:bg-bitbucket",
        "border-github",
        "border-gitlab",
        "border-bitbucket",
        "text-github",
        "text-gitlab",
        "text-bitbucket",

        // InfoBox related dynamic classes
        "text-blue-20",
        "bg-yellow-80",
        "bg-blue-90",
        "bg-blue-80",
        "bg-red-50",
        "border-blue-80",
        "border-yellow-60",
        "border-green-50",
        "border-red-50"
      ],
      whitelistPatterns: [/^(w|h)-/]
    }
  },
  theme: {
    borderRadius: {
      none: "0",
      sm: "3px",
      lg: "13px",
      xl: "30px",
      full: "100%",
      DEFAULT: "6px"
    },
    maxWidth: {
      "0": "0",
      "1/4": "25%",
      "1/3": "33%",
      "1/2": "50%",
      "3/4": "75%",
      p48: "48%",
      xs: "20rem",
      sm: "24rem",
      "2xl": "42rem",
      "screen-sm": "640px",
      "screen-md": "768px",
      "screen-lg": "1024px",
      "screen-xl": "1280px",
      10: "2.5rem",
      12: "3rem",
      16: "4rem",
      48: "12rem",
      56: "14rem",
      64: "16rem",
      72: "20rem",
      128: "32rem",
      none: "none",
      full: "100%"
    },
    minWidth: {
      "0": "0",
      "1/4": "25%",
      "1/3": "33%",
      "1/2": "50%",
      "3/4": "75%",
      p48: "48%",
      10: "2.5rem",
      12: "3rem",
      16: "4rem",
      48: "12rem",
      56: "14rem",
      64: "16rem",
      72: "20rem",
      128: "32rem",
      full: "100%"
    },
    extend: {
      colors: {
        primary: "#4f4f4f",
        secondary: "#bcbed0",
        tertiary: "#7B7A83",

        white: "#ffffff",
        "white-o-05": "rgba(255, 255, 255, 0.05)",
        "white-o-25": "rgba(255, 255, 255, 0.25)",
        "white-o-50": "rgba(255, 255, 255, 0.50)",
        "white-o-75": "rgba(255, 255, 255, 0.75)",

        black: "#000000",
        "black-o-05": "rgba(0, 0, 0, 0.05)",
        "black-o-25": "rgba(0, 0, 0, 0.25)",
        "black-o-50": "rgba(0, 0, 0, 0.50)",
        "black-o-75": "rgba(0, 0, 0, 0.75)",

        bitbucket: "#004fd3",
        gitlab: "#6b4fbb",
        github: "#22292e",
        stripe: "#32325d",

        "gray-100": "#ffffff",
        "gray-90": "#f9f9f9",
        "gray-85": "#f2f2f2",
        "gray-83": "#eeeff6",
        "gray-80": "#e0e0e0",
        "gray-75": "#d8dae8",
        "gray-70": "#c5c5c5",
        "gray-60": "#b2b2b2",
        "gray-55": "#7B7A83",
        "gray-50": "#a4a4a4",
        "gray-40": "#4f4f4f",
        "gray-30": "#4a4a4a",
        "gray-20": "#333333",
        "gray-10": "#222222",
        "gray-00": "#000000",

        "pink-50": "#f6005c",

        "blue-90": "#e2f2ff",
        "blue-80": "#c9e3f9",
        "blue-70": "#9fcff9",
        "blue-60": "#82bef3",
        "blue-50": "#68b5f9",
        "blue-40": "#218dff",
        "blue-30": "#1564cc",
        "blue-20": "#2c2c4a",
        "blue-10": "#0f092b",

        "green-90": "#d3f7cc",
        "green-80": "#b0f3a4",
        "green-70": "#68f57d",
        "green-60": "#39c54e",
        "green-50": "#2d9639",
        "green-40": "#24b47e",
        "green-20": "#e0ffd9",

        "red-90": "#f9e8e8",
        "red-85": "#ffebeb",
        "red-80": "#f1baba",
        "red-60": "#e27171",
        "red-50": "#d80202",
        "red-20": "#800f0f",

        "yellow-90": "fffde7",
        "yellow-80": "#fff9c4",
        "yellow-70": "#fff59d",
        "yellow-60": "#fff176",
        "yellow-50": "#ffee58",
        "yellow-40": "#ffeb3b",
        "yellow-30": "#fdd835",
        "yellow-20": "#fbc02d",
        "yellow-10": "#f9a825"
      }
    }
  },
  variants: {
    visibility: ["responsive", "hover", "focus", "group-hover"]
  },
  plugins: []
};

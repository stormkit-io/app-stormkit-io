module.exports = {
  purge: [],
  theme: {
    borderRadius: {
      none: "0",
      sm: "3px",
      lg: "13px",
      full: "100%",
      default: "6px",
    },
    extend: {
      colors: {
        primary: "#262525",
        secondary: "#bcbed0",
        tertiary: "#4f4f4f",

        white: "#ffffff",
        "white-o-05": "rgba(255, 255, 255, 0.05)",
        "white-o-25": "rgba(255, 255, 255, 0.25)",
        "white-o-50": "rgba(255, 255, 255, 0.50)",
        "white-o-75": "rgba(255, 255, 255, 0.75)",

        black: "#000000",
        "black-o-25": "rgba(0, 0, 0, 0.25)",
        "black-o-50": "rgba(0, 0, 0, 0.50)",
        "black-o-75": "rgba(0, 0, 0, 0.75)",

        bitbucket: "#004fd3",
        gitlab: "#6b4fbb",
        github: "#22292e",

        "gray-100": "#ffffff",
        "gray-90": "#f9f9f9",
        "gray-85": "#f2f2f2",
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
        "blue-80": "#1564cc",
        "blue-70": "#1ac9db",
        "blue-60": "#1564cc6b",
        "blue-50": "#0f092b",
        "blue-20": "#2c2c4a",

        "green-20": "#e0ffd9",
        "green-50": "#c8ffd1",
        "green-60": "#b2f3bc",
        "green-40": "#24b47e",
        "green-80": "#328c32",

        "red-20": "#f9e8e8",
        "red-50": "#d80202",
        "red-60": "#d70202",
        "red-80": "#bf3030",

        "yellow-50": "#e2ca00",
        "yellow-30": "#ceba14",
      },
    },
  },
  variants: {
    visibility: ["responsive", "hover", "focus", "group-hover"],
  },
  plugins: [],
};

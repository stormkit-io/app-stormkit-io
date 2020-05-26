const themes = {
  get: t => themes[t] || themes.dark,
  dark: {
    colors: {
      background: "#0f092b", // #202e33
      backgroundSecondary: "#2C2C4A",
      backgroundContrast: "#fff",
      borders: "#d8dae8", // we use this for selected rows too
      selected: "#EEEFF6", //
      font: "#262525",
      fontSecondary: "#BCBED0",
      stripe: "#32325D",
      bitbucket: "#004fd3",
      gitlab: "#6b4fbb",
      github: "#22292e",
      primary: {
        100: "#F6005C",
        80: "#FA2347"
      },
      secondary: {
        50: "#007dff"
      },
      link: "#2B26DF",
      status: { failed: "#bf3030", success: "#3bbb1e", running: "#1564cc" }
    }
  }
};

export default themes;

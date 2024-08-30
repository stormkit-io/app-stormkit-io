import { useMemo, useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AuthContext from "./auth/Auth.context";
import routes from "./routes";
import createTheme from "./mui-theme";
import { RootContext } from "./Root.context";

interface Props {
  Router: typeof BrowserRouter;
}

const LS_KEY = "STORMKIT_MODE";

export default function Root({ Router }: Props) {
  const [mode, setMode] = useState<"dark" | "light">(
    (localStorage.getItem(LS_KEY) as "dark") || "dark"
  );

  const theme = useMemo(() => {
    return createTheme(mode);
  }, [mode]);

  return (
    <RootContext.Provider
      value={{
        mode,
        setMode: v => {
          localStorage.setItem(LS_KEY, v);
          setMode(v);
        },
      }}
    >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AuthContext>
              <Routes>
                {routes.map(route => (
                  <Route
                    {...route}
                    key={Array.isArray(route.path) ? route.path[0] : route.path}
                  />
                ))}
              </Routes>
            </AuthContext>
          </Router>
        </ThemeProvider>
      </StyledEngineProvider>
    </RootContext.Provider>
  );
}

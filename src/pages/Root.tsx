import { useMemo } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AuthContext from "./auth/Auth.context";
import routes from "./routes";
import createTheme from "./mui-theme";

interface Props {
  Router: typeof BrowserRouter;
}

export default function Root({ Router }: Props) {
  const theme = useMemo(() => {
    return createTheme("dark");
  }, []);

  return (
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
  );
}

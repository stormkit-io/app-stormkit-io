import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import AuthContext from "./auth/Auth.context";
import routes from "./routes";
import theme from "./mui-theme";

interface Props {
  Router: typeof BrowserRouter;
}

const Root: React.FC<Props> = ({ Router }): React.ReactElement => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
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

export default Root;

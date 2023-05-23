import { Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import routes from "./routes";

export default function User() {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Routes>
        {routes.map(route => (
          <Route
            {...route}
            key={Array.isArray(route.path) ? route.path[0] : route.path}
          />
        ))}
      </Routes>
    </Box>
  );
}

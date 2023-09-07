import { useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { envMenuItems } from "./menu_items";

interface Props {
  app: App;
}

export default function EnvMenu({ app }: Props) {
  const { environments } = useContext(AppContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Deduce the envId from the pathname because we cannot access
  // the :envId url parameter, as it's included inside
  // this component as a child.
  const envId = pathname.split("/environments/")?.[1]?.split("/")?.[0];

  const env = environments.find(e => e.id === envId)!;
  const selectedEnvId = envId || "";

  const envMenu = useMemo(
    () => envMenuItems({ app, env, pathname }),
    [app, env, pathname]
  );

  if (!selectedEnvId) {
    return <></>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        mb: { xs: 0, lg: 2 },
        px: { xs: 2, lg: 0 },
      }}
    >
      <Select
        variant="standard"
        disableUnderline
        onChange={e => {
          if (pathname.includes(`/environments/${selectedEnvId}`)) {
            navigate(
              pathname.replace(
                `/environments/${selectedEnvId}`,
                `/environments/${e.target.value}`
              )
            );
          } else {
            navigate(`/apps/${app.id}/environments/${e.target.value}`);
          }
        }}
        sx={{ pr: 1 }}
        value={selectedEnvId || "_"}
      >
        <MenuItem value="_" disabled>
          Select an environment
        </MenuItem>
        {environments.map(e => (
          <MenuItem key={e.id} value={e.id}>
            {e.env}
          </MenuItem>
        ))}
      </Select>
      <Box
        sx={{
          textAlign: "right",
        }}
      >
        {envMenu.map(item => (
          <Link
            key={item.path}
            href={item.path}
            sx={{
              cursor: "pointer",
              color: "white",
              pr: 1.5,
              pl: { xs: 1.5, lg: 0 },
              py: { xs: 1.5, lg: 0.25 },
              display: "inline-flex",
              alignItems: "center",
              opacity: item.isActive ? 1 : 0.4,
              ":hover": {
                opacity: 1,
                color: "white",
              },
              ":last-child": {
                pr: 0,
              },
            }}
          >
            <Box
              component="span"
              display="inline-block"
              sx={{
                scale: "0.75",
                display: { xs: "none", lg: "inline-block" },
              }}
            >
              <IconButton>{item.icon}</IconButton>
            </Box>
            {item.text}
          </Link>
        ))}
      </Box>
    </Box>
  );
}

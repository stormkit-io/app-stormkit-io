import { useMemo } from "react";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Logo from "../Logo";
import Dot from "~/components/Dot";
import { getLogoForProvider, parseRepo } from "~/utils/helpers/providers";

interface Props {
  app: App;
  imageSize?: number;
}

const providerHosts: Record<Provider, string> = {
  bitbucket: "bitbucket.org",
  github: "github.com",
  gitlab: "gitlab.com",
};

export default function AppName({ app, imageSize = 18 }: Props) {
  const { repo, provider } = parseRepo(app.repo);
  const providerLogo = getLogoForProvider(provider);
  const linkToRepo = `https://${providerHosts[provider]}/${repo}`;
  const isStormkitApp = useMemo(() => {
    return app.id === "1" && app.repo.includes("app-stormkit-io");
  }, [app]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {isStormkitApp ? (
        <Logo iconOnly iconSize={18} sx={{ mr: 1 }} testId="app-logo" />
      ) : (
        <Box
          component="img"
          sx={{
            display: "inline-block",
            mr: 1,
            width: imageSize,
          }}
          src={providerLogo}
          alt={provider}
        />
      )}

      <Typography>
        {isStormkitApp ? (
          <Tooltip
            title="This application controls the Stormkit UI. Use this to fetch latest updates."
            placement="bottom"
            arrow
          >
            <Link href={`/apps/${app.id}/environments`}>{app.displayName}</Link>
          </Tooltip>
        ) : (
          <Link href={`/apps/${app.id}/environments`}>{app.displayName}</Link>
        )}
      </Typography>
      <Dot />
      <Typography>
        <Link
          href={linkToRepo}
          target="_blank"
          rel="noreferrer noopener"
          sx={{ color: "text.secondary" }}
        >
          {repo}
        </Link>
      </Typography>
    </Box>
  );
}

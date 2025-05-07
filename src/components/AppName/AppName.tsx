import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BoltIcon from "@mui/icons-material/Bolt";
import Dot from "~/components/Dot";
import IconBg from "~/components/IconBg";
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

export default function AppName({ app, imageSize = 20 }: Props) {
  if (app.isBare) {
    return (
      <Typography sx={{ display: "flex", alignItems: "center" }}>
        <IconBg
          sx={{
            width: imageSize,
            height: imageSize,
            mr: 1,
            bgcolor: "text.primary",
          }}
        >
          <BoltIcon sx={{ ml: 0, fontSize: 16, color: "container.paper" }} />
        </IconBg>
        <Link href={`/apps/${app.id}/environments`}>{app.displayName}</Link>
      </Typography>
    );
  }

  const { repo, provider } = parseRepo(app.repo);
  const providerLogo = getLogoForProvider(provider);
  const linkToRepo = `https://${providerHosts[provider]}/${repo}`;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
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

      <Typography>
        <Link href={`/apps/${app.id}/environments`}>{app.displayName}</Link>
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

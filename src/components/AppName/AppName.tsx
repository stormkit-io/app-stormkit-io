import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
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

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
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
          sx={{ color: grey[500] }}
        >
          {repo}
        </Link>
      </Typography>
    </Box>
  );
}

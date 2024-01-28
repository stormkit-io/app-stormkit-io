import type { SxProps } from "@mui/material";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import githubLogo from "~/assets/logos/github-logo.svg";
import bitbucketLogo from "~/assets/logos/bitbucket-logo.svg";
import gitlabLogo from "~/assets/logos/gitlab-logo.svg";

interface Props {
  sx?: SxProps;
  imageSx?: SxProps;
  repo: string;
  displayName?: string;
  withLinkToRepo?: boolean;
  wrapOnMobile?: boolean;
}

const providerHosts: Record<Provider, string> = {
  bitbucket: "bitbucket.org",
  github: "github.com",
  gitlab: "gitlab.com",
};

export default function AppName({
  repo,
  sx,
  imageSx,
  displayName,
  withLinkToRepo,
  wrapOnMobile,
}: Props) {
  const pieces = repo.split("/") || [];
  const provider = pieces.shift() as Provider;
  const nameWithoutPrefix = pieces.join("/");
  const logo =
    provider === "github"
      ? githubLogo
      : provider === "gitlab"
      ? gitlabLogo
      : bitbucketLogo;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
    >
      <Box
        component="img"
        sx={{
          display: "inline-block",
          mr: 1,
          width: 8,
          ...imageSx,
        }}
        src={logo}
        alt={provider}
      />
      <Box>
        {withLinkToRepo && (
          <Link
            href={`https://${providerHosts[provider]}/${nameWithoutPrefix}`}
            aria-label="Repository URL"
            target="_blank"
            rel="noreferrer noopener"
            sx={{ display: "block", ml: 1 }}
          >
            <Box
              component="span"
              sx={{
                maxWidth: { xs: wrapOnMobile ? "150px" : "none", md: "none" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                display: "block",
                textOverflow: "ellipsis",
              }}
            >
              {nameWithoutPrefix}
            </Box>
          </Link>
        )}
        {!withLinkToRepo && nameWithoutPrefix}
        {displayName && (
          <Box
            sx={{
              fontSize: 12,
              opacity: 0.7,
            }}
          >
            {displayName}
          </Box>
        )}
      </Box>
    </Box>
  );
}

import React from "react";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import githubLogo from "~/assets/logos/github-logo.svg";
import bitbucketLogo from "~/assets/logos/bitbucket-logo.svg";
import gitlabLogo from "~/assets/logos/gitlab-logo.svg";

interface Props {
  app: App;
  imageWidth?: 6 | 7 | 8;
  withLinkToRepo?: boolean;
  withDisplayName?: boolean;
}

const providerHosts: Record<Provider, string> = {
  bitbucket: "bitbucket.org",
  github: "github.com",
  gitlab: "gitlab.com",
};

const AppName: React.FC<Props> = ({
  app,
  withDisplayName,
  withLinkToRepo,
  imageWidth = 8,
}) => {
  const pieces = app.repo.split("/") || [];
  const provider = pieces.shift() as Provider;
  const nameWithoutPrefix = pieces.join("/");
  const logo =
    provider === "github"
      ? githubLogo
      : provider === "gitlab"
      ? gitlabLogo
      : bitbucketLogo;

  return (
    <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
      <Box
        component="img"
        sx={{ display: "inline-block", mr: 1, w: imageWidth }}
        src={logo}
        alt={provider}
      />
      <Box sx={{ lineHeight: 1.5 }}>
        {withLinkToRepo && (
          <Link
            href={`https://${providerHosts[app.provider]}/${nameWithoutPrefix}`}
            aria-label="Repository URL"
            sx={{ color: "white" }}
          >
            {nameWithoutPrefix}
          </Link>
        )}
        {!withLinkToRepo && nameWithoutPrefix}
        {withDisplayName && (
          <Box sx={{ fontSize: 12, opacity: 0.7 }}>{app.displayName}</Box>
        )}
      </Box>
    </Box>
  );
};

export default AppName;

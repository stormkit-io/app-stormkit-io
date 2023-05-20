import React from "react";
import Link from "~/components/Link";
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
      <div className="leading-4">
        {withLinkToRepo && (
          <Link
            to={`https://${providerHosts[app.provider]}/${nameWithoutPrefix}`}
            aria-label="Repository URL"
          >
            {nameWithoutPrefix}
          </Link>
        )}
        {!withLinkToRepo && nameWithoutPrefix}
        {withDisplayName && (
          <div className="text-xs text-gray-60">{app.displayName}</div>
        )}
      </div>
    </Box>
  );
};

export default AppName;

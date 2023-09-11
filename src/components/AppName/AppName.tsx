import React from "react";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import githubLogo from "~/assets/logos/github-logo.svg";
import bitbucketLogo from "~/assets/logos/bitbucket-logo.svg";
import gitlabLogo from "~/assets/logos/gitlab-logo.svg";

interface Props {
  app: App;
  imageWidth?: number;
  withLinkToRepo?: boolean;
  withDisplayName?: boolean;
  withMarginRight?: boolean;
  wrapOnMobile?: boolean;
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
  withMarginRight = true,
  imageWidth = 8,
  wrapOnMobile,
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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mr: withMarginRight ? 2 : 0,
      }}
    >
      <Box
        component="img"
        sx={{ display: "inline-block", mr: 1, width: imageWidth }}
        src={logo}
        alt={provider}
      />
      <Box>
        {withLinkToRepo && (
          <Link
            href={`https://${providerHosts[app.provider]}/${nameWithoutPrefix}`}
            aria-label="Repository URL"
            target="_blank"
            rel="noreferrer noopener"
            sx={{ color: "white" }}
          >
            <Box
              component="span"
              sx={{
                maxWidth: { xs: wrapOnMobile ? "150px" : "none", md: "none" },
                display: "inline-block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {nameWithoutPrefix}
            </Box>
          </Link>
        )}
        {!withLinkToRepo && nameWithoutPrefix}
        {withDisplayName && (
          <Box
            sx={{
              fontSize: 12,
              opacity: 0.7,
            }}
          >
            {app.displayName}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AppName;

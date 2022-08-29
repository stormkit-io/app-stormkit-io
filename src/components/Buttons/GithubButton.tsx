import React from "react";
import ProviderButton, { OmittedProps } from "./_components/ProviderButton";
import githubLogo from "~/assets/logos/github-logo.svg";

const GithubButton = (props: OmittedProps): React.ReactElement => {
  return <ProviderButton {...props} logo={githubLogo} text="GitHub" />;
};

export default GithubButton;

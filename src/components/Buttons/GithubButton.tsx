import React from "react";
import ProviderButton, { OmittedProps } from "./_components/ProviderButton";

const GithubButton = (props: OmittedProps): React.ReactElement => {
  return <ProviderButton {...props} provider="github" text="GitHub" />;
};

export default GithubButton;

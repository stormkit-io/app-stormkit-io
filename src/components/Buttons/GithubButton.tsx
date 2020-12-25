import React from "react";
import ProviderButton, { Props } from "./_components/ProviderButton";

const GithubButton = (props: Props): React.ReactElement => {
  return <ProviderButton {...props} provider="github" text="GitHub" />;
};

export default GithubButton;

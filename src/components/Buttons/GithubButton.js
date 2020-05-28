import React from "react";
import ProviderButton from "./_components/ProviderButton";

const GithubButton = (props) => {
  return <ProviderButton {...props} provider="github" text="GitHub" />;
};

export default GithubButton;

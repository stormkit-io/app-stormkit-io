import React from "react";
import ProviderButton from "./_components/ProviderButton";

const BitbucketButton = props => {
  return <ProviderButton {...props} provider="bitbucket" text="Bitbucket" />;
};

export default BitbucketButton;

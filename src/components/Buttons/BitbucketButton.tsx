import React from "react";
import ProviderButton, { Props } from "./_components/ProviderButton";

const BitbucketButton = (props: Props): React.ReactElement => {
  return <ProviderButton {...props} provider="bitbucket" text="Bitbucket" />;
};

export default BitbucketButton;

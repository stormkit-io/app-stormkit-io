import React from "react";
import { connect } from "~/utils/context";
import InfoBox from "~/components/InfoBox";
import * as buttons from "~/components/Buttons";
import AuthContext, { AuthContextProps } from "../Auth.context";

const OauthLogin: React.FC<AuthContextProps> = ({
  loginOauth,
  error,
}): React.ReactElement => (
  <>
    <buttons.GithubButton
      onClick={() => loginOauth("github")}
      className="mb-8 mx-12"
    />
    <buttons.GitlabButton
      onClick={() => loginOauth("gitlab")}
      className="mb-8 mx-12"
    />
    <buttons.BitbucketButton
      onClick={() => loginOauth("bitbucket")}
      className="mx-12"
    />
    {error && <InfoBox className="mt-4">{error}</InfoBox>}
  </>
);

export default connect<unknown, AuthContextProps>(OauthLogin, [
  {
    Context: AuthContext,
    props: ["loginOauth", "error"],
  },
]);

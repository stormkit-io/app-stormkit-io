import React from "react";
import PropTypes from "prop-types";
import { connect } from "~/utils/context";
import DefaultLayout from "~/layouts/DefaultLayout";
import AuthContext from "~/pages/auth/Auth.context";
import RootContext from "~/pages/Root.context";
import { Title } from "~/pages/apps/_components";
import { BackButton } from "~/components/Buttons";
import ExplanationBox from "~/components/ExplanationBox";
import GithubRepos from "./Provider.github";
import BitbucketRepos from "./Provider.bitbucket";
import GitlabRepos from "./Provider.gitlab";

const Provider = ({
  match,
  github,
  gitlab,
  bitbucket,
  history,
  user,
  loginOauth,
  api
}) => {
  const { provider } = match.params;
  const popupLogin = loginOauth(provider);

  return (
    <DefaultLayout>
      <div className="flex flex-col mb-4">
        <Title>
          <Title.Sub>
            <span className="inline-flex items-center">
              <BackButton to={"/apps/new"} className="mr-4" />
              <span>New App</span>
            </span>
          </Title.Sub>
        </Title>
        <div className="flex flex-auto">
          <div className="page-section mr-6 flex flex-col">
            <h3 className="font-bold text-lg">
              Step 2 of 2. Choose repository
            </h3>
            {provider === "github" && (
              <GithubRepos
                history={history}
                github={github}
                user={user}
                api={api}
                loginOauth={popupLogin}
              />
            )}

            {provider === "bitbucket" && (
              <BitbucketRepos
                api={api}
                history={history}
                bitbucket={bitbucket}
                loginOauth={popupLogin}
              />
            )}

            {provider === "gitlab" && (
              <GitlabRepos
                api={api}
                history={history}
                gitlab={gitlab}
                loginOauth={popupLogin}
              />
            )}
          </div>
          <div className="min-w-1/3 max-w-1/3">
            <ExplanationBox title="Selecting a repository">
              <p>
                Github supports granting access to single repositories, while
                Bitbucket works on account level.
                <br />
                <br />
                If you're using Github and don't see your app listed, connect it
                by pressing "Connect more repositories".
              </p>
            </ExplanationBox>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

Provider.propTypes = {
  user: PropTypes.object,
  bitbucket: PropTypes.object,
  github: PropTypes.object,
  gitlab: PropTypes.object,
  api: PropTypes.object,
  match: PropTypes.object
};

export default connect(Provider, [
  { Context: RootContext, props: ["bitbucket", "github", "gitlab", "api"] },
  { Context: AuthContext, props: ["user", "loginOauth"] }
]);

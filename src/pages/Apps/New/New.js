import React from "react";
import PropTypes from "prop-types";
import { connect } from "~/utils/context";
import DefaultLayout from "~/layouts/DefaultLayout";
import AuthContext from "~/pages/Auth/Auth.context";
import RootContext from "~/pages/Root.context";
import { Title } from "~/pages/Apps/_components";
import { useFetchAppList } from "~/pages/Apps/actions";
import ExplanationBox from "~/components/ExplanationBox";
import Link from "~/components/Link";
import * as btn from "~/components/Buttons";
import { login as loginAction } from "./actions";

const Start = ({ loginOauth, history, api, ...rest }) => {
  const { apps, loading } = useFetchAppList({ api });
  const login = (provider) => {
    return loginAction({ api: rest[provider], provider, history, loginOauth });
  };

  return (
    <DefaultLayout>
      <Title>
        <Title.Sub>
          {loading ? (
            <span className="content-placeholder w-40 h-8" />
          ) : (
            <span className="inline-flex items-center">
              {apps.length > 0 && <btn.BackButton to={"/"} className="mr-4" />}
              <span>New App</span>
            </span>
          )}
        </Title.Sub>
      </Title>
      <div className="flex">
        <div className="page-section mr-6 flex flex-col">
          <h3 className="font-bold text-lg">
            Step 1 of 2. Where can we find your codebase?
          </h3>
          <div className="flex flex-auto items-center py-24">
            <btn.GithubButton onClick={login("github")} className="mr-4" />
            <btn.BitbucketButton
              onClick={login("bitbucket")}
              className="mr-4"
            />
            <btn.GitlabButton onClick={login("gitlab")} />
          </div>
          <p>
            Having issues setting up your project? Reach us at{" "}
            <Link secondary to="mailto:hello@stormkit.io">
              hello@stormkit.io
            </Link>
            .
          </p>
        </div>
        <div className="w-1/3">
          <ExplanationBox title="CI &amp; CD">
            <p>
              Once you choose a git provider, you'll be able to grant us access
              to one or more repository. This is all you need to get started and
              get automated deployments whenever you push to a branch.
            </p>
          </ExplanationBox>
        </div>
      </div>
    </DefaultLayout>
  );
};

Start.propTypes = {
  github: PropTypes.object,
  bitbucket: PropTypes.object,
  history: PropTypes.object,
  api: PropTypes.object,
  loginOauth: PropTypes.func,
};

export default connect(Start, [
  { Context: RootContext, props: ["bitbucket", "github", "gitlab", "api"] },
  { Context: AuthContext, props: ["loginOauth"] },
]);

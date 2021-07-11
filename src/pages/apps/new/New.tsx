import React from "react";
import { useHistory } from "react-router";
import { connect } from "~/utils/context";
import DefaultLayout from "~/layouts/DefaultLayout";
import AuthContext, { AuthContextProps } from "~/pages/auth/Auth.context";
import RootContext, { RootContextProps } from "~/pages/Root.context";
import { Title } from "~/pages/apps/_components";
import { useFetchAppList } from "~/pages/apps/actions";
import ExplanationBox from "~/components/ExplanationBox";
import Link from "~/components/Link";
import * as btn from "~/components/Buttons";

interface ContextProps extends AuthContextProps, RootContextProps {}

const Start: React.FC<ContextProps> = ({
  loginOauth,
  api,
}): React.ReactElement => {
  const history = useHistory();
  const { apps, loading } = useFetchAppList({ api });

  const login = (provider: Provider) => {
    return loginOauth(provider).then(({ accessToken }) => {
      if (accessToken) {
        history.push(`/apps/new/${provider}`);
      }
    });
  };

  return (
    <DefaultLayout>
      <div>
        <Title>
          <Title.Sub>
            {loading ? (
              <span className="content-placeholder w-40 h-8" />
            ) : (
              <span className="inline-flex items-center">
                {apps.length > 0 && (
                  <btn.BackButton to={"/"} className="mr-4" />
                )}
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
              <btn.GithubButton
                onClick={() => login("github")}
                className="mr-4"
              />
              <btn.BitbucketButton
                onClick={() => login("bitbucket")}
                className="mr-4"
              />
              <btn.GitlabButton onClick={() => login("gitlab")} />
            </div>
            <p>
              Having issues setting up your project? Reach us at{" "}
              <Link secondary to="mailto:hello@stormkit.io">
                hello@stormkit.io
              </Link>
              .
            </p>
          </div>
          <div className="min-w-1/3 max-w-1/3">
            <ExplanationBox title="CI &amp; CD">
              <p>
                Once you choose a git provider, you'll be able to grant us
                access to one or more repository. This is all you need to get
                started and get automated deployments whenever you push to a
                branch.
              </p>
            </ExplanationBox>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default connect<unknown, ContextProps>(Start, [
  { Context: RootContext, props: ["api"] },
  { Context: AuthContext, props: ["loginOauth"] },
]);

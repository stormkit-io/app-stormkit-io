import React, { useContext, useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import DefaultLayout from "~/layouts/DefaultLayout";
import { AuthContext } from "~/pages/auth/Auth.context";
import { Title } from "~/pages/apps/_components";
import { BackButton } from "~/components/Buttons";
import ExplanationBox from "~/components/ExplanationBox";
import GithubRepos from "./Provider.github";
import BitbucketRepos from "./Provider.bitbucket";
import GitlabRepos from "./Provider.gitlab";
import Form from "~/components/Form";
import InputAdornment from "@material-ui/core/InputAdornment";

interface RouteMatchParams {
  provider: string;
}

const Provider: React.FC = () => {
  const { user, loginOauth } = useContext(AuthContext);
  const [filter, setFilter] = useState<string>("");
  const history = useHistory();
  const match = useRouteMatch<RouteMatchParams>();
  const provider = match.params.provider;

  if (
    provider !== "github" &&
    provider !== "gitlab" &&
    provider !== "bitbucket"
  ) {
    return <>Provider is not supported.</>;
  }

  const popupLogin = () => loginOauth?.(provider);

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

            <Form.Input
              className="mt-4"
              fullWidth
              value={filter}
              placeholder={"Filter repos by name"}
              onChange={e => setFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span className="fas fa-search" />
                  </InputAdornment>
                ),
              }}
            />

            {provider === "github" && (
              <GithubRepos
                history={history}
                user={user!}
                loginOauth={popupLogin}
                filter={filter}
              />
            )}

            {provider === "bitbucket" && (
              <BitbucketRepos
                history={history}
                loginOauth={popupLogin}
                filter={filter}
              />
            )}

            {provider === "gitlab" && (
              <GitlabRepos
                history={history}
                loginOauth={popupLogin}
                filter={filter}
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

export default Provider;

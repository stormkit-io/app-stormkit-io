import React, { createContext, useMemo } from "react";
import Api from "~/utils/api/Api";
import BitbucketApi from "~/utils/api/Bitbucket";
import GithubApi from "~/utils/api/Github";
import GitlabApi from "~/utils/api/Gitlab";
import { AuthContext } from "./auth";

const Context = createContext({});

export type ProviderApi = GithubApi | BitbucketApi | GitlabApi;

export interface RootContextProps {
  api: Api;
  bitbucket: BitbucketApi;
  github: GithubApi;
  gitlab: GitlabApi;
}

interface Props {
  children: React.ReactNode;
}

/**
 * The Root context is similar to the rootReducer in redux.
 * It includes all global contexts and injects the root state to them.
 */
const RootContext: React.FC<Props> = ({ children }): React.ReactElement => {
  const state = useMemo(
    () => ({
      bitbucket: new BitbucketApi(),
      github: new GithubApi(),
      gitlab: new GitlabApi(),
      api: new Api({ baseurl: process.env.API_DOMAIN || "" }),
    }),
    []
  );

  return (
    <Context.Provider value={state}>
      <AuthContext.Provider
        api={state.api}
        bitbucket={state.bitbucket}
        github={state.github}
        gitlab={state.gitlab}
      >
        {children}
      </AuthContext.Provider>
    </Context.Provider>
  );
};

export default Object.assign(RootContext, {
  Consumer: Context.Consumer,
  Provider: RootContext,
});

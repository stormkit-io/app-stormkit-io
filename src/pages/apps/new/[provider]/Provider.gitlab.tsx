import React from "react";
import { History } from "history";
import gitlabApi from "~/utils/api/Gitlab";
import api from "~/utils/api/Api";
import Spinner from "~/components/Spinner";
import { GitlabButton } from "~/components/Buttons";
import { login as loginUser } from "./actions";
import LoginScreen from "./_components/LoginScreen";
import RepoList from "./_components/RepoList";

interface Account {
  login: string;
  avatar: string;
}

interface Repository {
  name: string;
}

interface Props {
  history: History;
  filter?: string;
  loginOauth: () => void;
}

interface State {
  repositories?: Repository[];
  accounts?: Account[];
  loading?: boolean;
  requiresLogin?: boolean;
  error?: string | null;
  nextPage?: number;
}

export default class GitlabRepositories extends React.PureComponent<
  Props,
  State
> {
  unmounted = false;

  state: State = {
    accounts: [],
    repositories: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    if (!gitlabApi.accessToken) {
      return this.updateState({ requiresLogin: true });
    }

    try {
      await this.user();
      await this.repositories();
    } catch (res) {
      if (res instanceof Error && res.message === "unauthorized") {
        this.updateState({ requiresLogin: true });
      } else {
        this.updateState({ error: "Something unexpected occurred." });
      }
    }
  };

  user = async () => {
    const glUser = await gitlabApi.user();

    // Normalize the user and make it look like an account.
    const user = {
      id: glUser.id,
      login: glUser.username,
      avatar: glUser.avatar_url,
      type: "user",
      selected: true,
    };

    this.updateState({ accounts: [user] });
    return user;
  };

  /**
   * Installations lists user accounts which installed stormkit github app.
   *
   * @memberof GithubRepositories
   */
  repositories = async (page?: number) => {
    this.updateState({ loading: true });

    const { repositories } = this.state;
    const { repos, nextPage } = await gitlabApi.repositories({ page });

    this.updateState({
      repositories: [...repositories!, ...repos],
      loading: false,
      nextPage,
    });
  };

  updateState = (args: State) => {
    if (this.unmounted !== true) {
      this.setState(args);
    }
  };

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    const { loginOauth, history, filter } = this.props;
    const {
      repositories,
      accounts = [],
      loading,
      requiresLogin,
      nextPage,
    } = this.state;

    if (requiresLogin) {
      return (
        <LoginScreen>
          <GitlabButton
            onClick={loginUser({
              loginOauth,
              updateState: (args: State) => this.updateState(args),
              init: () => this.init(),
            })}
          />
        </LoginScreen>
      );
    }

    if (loading && accounts.length === 0) {
      return (
        <div className="mt-12 flex w-full justify-center">
          <Spinner primary />
        </div>
      );
    }

    return (
      <>
        <div className="mt-4 mb-4 w-full">
          {accounts.length > 0 && (
            <div className="flex p-4 border border-solid border-gray-80 rounded bg-gray-90">
              {accounts &&
                accounts.map(account => (
                  <div key={account.login} className="flex items-center">
                    <img
                      src={account.avatar}
                      alt={account.login}
                      className="w-8 h-8 mr-4 rounded-full"
                    />{" "}
                    {account.login}
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="flex-auto">
          <RepoList
            api={api}
            history={history}
            repositories={repositories?.filter(r => r.name.includes(filter!))}
            provider="gitlab"
            loading={loading}
            hasNextPage={!!nextPage}
            onNextPageClick={e => {
              e.preventDefault();
              this.repositories(nextPage);
            }}
          />
        </div>
      </>
    );
  }
}

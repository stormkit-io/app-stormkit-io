import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Spinner from "~/components/Spinner";
import { GitlabButton } from "~/components/Buttons";
import { login as loginUser } from "./actions";
import LoginScreen from "./_components/LoginScreen";
import RepoList from "./_components/RepoList";

export default class GitlabRepositories extends PureComponent {
  static propTypes = {
    api: PropTypes.object,
    gitlab: PropTypes.object,
    history: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    accounts: [],
    repositories: [],
    loading: true,
    errors: {},
    nextPage: null,
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    if (!this.props.gitlab.accessToken) {
      return this.updateState({ requiresLogin: true });
    }

    try {
      await this.user();
      await this.repositories();
    } catch (res) {
      if (res.message === "unauthorized") {
        this.updateState({ requiresLogin: true });
      } else {
        this.updateState({ error: "Something unexpected occurred." });
      }
    }
  };

  user = async () => {
    const api = this.props.gitlab;
    const glUser = await api.user();

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
  repositories = async page => {
    this.updateState({ loading: true });

    const api = this.props.gitlab;
    const { repositories } = this.state;
    const { repos, nextPage } = await api.repositories({ page });

    this.updateState({
      repositories: [...repositories, ...repos],
      loading: false,
      nextPage,
    });
  };

  updateState = (...args) => {
    if (this.unmounted !== true) {
      this.setState(...args);
    }
  };

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    const { loginOauth, api, history, filter } = this.props;
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
              updateState: (...args) => this.updateState(...args),
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
                  <div
                    key={account.login}
                    value={account.login}
                    className="flex items-center"
                  >
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
            repositories={repositories.filter(r => r.name.includes(filter))}
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

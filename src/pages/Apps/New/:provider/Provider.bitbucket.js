import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Spinner from "~/components/Spinner";
import { BitbucketButton } from "~/components/Buttons";
import { login as loginUser } from "./actions";
import LoginScreen from "./_components/LoginScreen";
import RepoList from "./_components/RepoList";
import Accounts from "./_components/Accounts";

export default class BitbucketRepositories extends PureComponent {
  static propTypes = {
    bitbucket: PropTypes.object, // The bitbucket api
    history: PropTypes.object,
    api: PropTypes.object,
    loginOauth: PropTypes.func,
  };

  state = {
    selectedAccount: null,
    loadingInsert: false,
    accounts: [],
    repositories: [],
    loading: true,
    errors: {},
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    if (!this.props.bitbucket.accessToken) {
      return this.setState({ requiresLogin: true });
    }

    try {
      await this.user();
      await this.teams();
      await this.repositories();
    } catch (res) {
      if (res.message === "unauthorized") {
        this.setState({ requiresLogin: true });
      } else {
        console.log(res.message);
        this.setState({ error: "Something unexpected occurred." });
      }
    }
  };

  user = async () => {
    const api = this.props.bitbucket;
    const bbUser = await api.user();

    // Normalize the user and make it look like an account.
    const user = {
      login: bbUser.nickname || bbUser.username,
      avatar: bbUser.links.avatar.href,
      type: "user",
      selected: true,
    };

    this.setState({ accounts: [user] });
    return user;
  };

  teams = async () => {
    const api = this.props.bitbucket;
    const teams = await api.teams();

    if (teams.size === 0) {
      return this.setState({ loading: false });
    }

    const accounts = this.state.accounts.concat(
      teams.values.map((t) => ({
        login: t.username,
        avatar: t.links.avatar.href,
        type: "team",
        selected: false,
      }))
    );

    return new Promise((resolve) => {
      this.setState({ accounts }, () => resolve(accounts));
    });
  };

  repositories = async () => {
    const account = this.state.accounts.filter((a) => a.selected)[0];

    if (!account) {
      return;
    }

    // Cache the stuff
    this.repositories = this.repositories || {};

    if (this.repositories[account.login]) {
      return this.setState(this.repositories[account.login]);
    }

    const api = this.props.bitbucket;

    // If the account type is a team, we include it in the repo call
    // to filter the results.
    const res = await api.repositories(
      account.type === "team" ? account.login : undefined
    );

    this.repositories[account.login] = {
      selectedAccount: account,
      repositories: res.values,
      loading: false,
    };

    this.setState(this.repositories[account.login]);
  };

  onAccountChange = (login) => {
    const accounts = this.state.accounts.map((a) => ({
      ...a,
      selected: a.login === login,
    }));

    this.setState(
      { accounts, loading: true, repositories: [] },
      this.repositories
    );
  };

  render() {
    const { loginOauth, history, api } = this.props;
    const { accounts = [], loading, requiresLogin, repositories } = this.state;
    const { login } = accounts.filter((i) => i.selected)[0] || {};

    if (requiresLogin) {
      return (
        <LoginScreen>
          <BitbucketButton
            onClick={loginUser({
              loginOauth,
              setState: (...args) => this.setState(...args),
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
        <div className="mt-12 mb-4 w-full">
          {accounts.length > 0 && (
            <Accounts
              selected={login}
              onAccountChange={this.onAccountChange}
              accounts={accounts}
            />
          )}
        </div>
        <div className="flex-auto">
          <RepoList
            api={api}
            history={history}
            repositories={repositories}
            provider="bitbucket"
            loading={loading}
          />
        </div>
      </>
    );
  }
}

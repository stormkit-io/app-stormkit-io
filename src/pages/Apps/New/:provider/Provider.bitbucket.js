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
    hasNextPage: false,
    pageQueryParams: {},
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    if (!this.props.bitbucket.accessToken) {
      return await this.updateState({ requiresLogin: true });
    }

    try {
      await this.user();
      await this.teams();
      const selectedAccount = this.state.accounts.find((a) => a.selected);
      await this.updateState({ selectedAccount });
      await this.getRepositories();
    } catch (res) {
      if (res.message === "unauthorized") {
        this.updateState({ requiresLogin: true });
      } else {
        this.updateState({ error: "Something unexpected occurred." });
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

    await this.updateState({ accounts: [user] });
    return user;
  };

  teams = async () => {
    const api = this.props.bitbucket;
    const teams = await api.teams();

    if (teams.size === 0) {
      return await this.updateState({ loading: false });
    }

    const accounts = this.state.accounts.concat(
      teams.values.map((t) => ({
        login: t.username,
        avatar: t.links.avatar.href,
        type: "team",
        selected: false,
      }))
    );

    await this.updateState({ accounts });
    return accounts;
  };

  getRepositories = async () => {
    // set loading to true to show a spinner until api requests are done
    this.updateState({ loading: true });

    // get the selected account
    const { selectedAccount } = this.state;

    if (!selectedAccount) {
      return this.updateState({ loading: false });
    }

    const api = this.props.bitbucket;

    // get current pageIndex and items per page
    const { repositories, pageQueryParams } = this.state;

    // api params
    const defaultParams = {
      role: "admin",
      pagelen: 100,
    };
    const params =
      Object.keys(pageQueryParams).length > 0 ? pageQueryParams : defaultParams;

    // fetch the repositories
    // If the account type is a team, we include it in the repo call
    // to filter the results.
    const res = await api.repositories({
      team: selectedAccount.type === "team" ? selectedAccount.login : undefined,
      params,
    });

    // adds the current page to the repositories
    const page = res.values;
    repositories.push(...page);

    // check if there is a next page with more repositories
    const hasNextPage = !!res.next;

    // gather the params for the next page (if there is one) into an object for consecutive calls through `load more` button
    const nextPageParams = hasNextPage
      ? res.next
          .split("?")[1]
          .split("&")
          .reduce((params, param) => {
            const key = param.split("=")[0];
            const value = param.split("=")[1];
            params[key] = value;
            return params;
          }, {})
      : defaultParams;

    this.updateState({
      repositories: repositories,
      loading: false,
      hasNextPage,
      pageQueryParams: nextPageParams,
    });
  };

  onAccountChange = async (login) => {
    const selectedAccount = this.state.accounts.find((a) => a.login === login);
    const accounts = this.state.accounts.map((a) => ({
      ...a,
      selected: a.login === login,
    }));

    if (selectedAccount) {
      await this.updateState({ repositories: [], accounts, selectedAccount });
      this.getRepositories();
    }
  };

  updateState = (...args) => {
    // wait for the callback to be triggered to resolve the promise to avoid side effects (too) slowly mutating the state
    return new Promise((resolve) => {
      if (this.unmounted !== true) {
        this.setState(...args, () => {
          resolve(true);
        });
      }
      resolve(true);
    });
  };

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    const { loginOauth, history, api } = this.props;
    const {
      accounts = [],
      loading,
      requiresLogin,
      repositories,
      hasNextPage,
    } = this.state;
    const { login } = accounts.filter((i) => i.selected)[0] || {};

    if (requiresLogin) {
      return (
        <LoginScreen>
          <BitbucketButton
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
            onNextPageClick={this.getRepositories}
            hasNextPage={hasNextPage}
          />
        </div>
      </>
    );
  }
}

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import qs from "query-string";
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
      const selectedAccount = this.state.accounts.find(a => a.selected);
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

    // fetch the repositories
    const res = await api.repositories({
      params: { ...defaultParams, ...pageQueryParams },
    });

    // check if there is a next page with more repositories
    const hasNextPage = !!res.next;

    // gather the params for the next page (if there is one) into an object for consecutive calls through `load more` button
    const nextPageParams = hasNextPage
      ? qs.parse(res.next.split("?")[1])
      : defaultParams;

    this.updateState({
      repositories: [...repositories, ...res.values],
      loading: false,
      hasNextPage,
      pageQueryParams: nextPageParams,
    });
  };

  onAccountChange = async login => {
    const selectedAccount = this.state.accounts.find(a => a.login === login);
    const accounts = [...this.state.accounts].map(a => ({
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
    return new Promise(resolve => {
      if (this.unmounted !== true) {
        this.setState(...args, () => {
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  };

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    const { loginOauth, history, api, filter } = this.props;
    const {
      accounts = [],
      loading,
      requiresLogin,
      repositories,
      hasNextPage,
    } = this.state;
    const { login } = accounts.filter(i => i.selected)[0] || {};

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
        <div className="mt-4 mb-4 w-full">
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
            repositories={repositories.filter(r => r.name.includes(filter))}
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

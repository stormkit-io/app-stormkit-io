import React, { createContext, PureComponent } from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import Api from "~/utils/api/Api";
import BitbucketApi from "~/utils/api/Bitbucket";
import GithubApi from "~/utils/api/Github";
import GitlabApi from "~/utils/api/Gitlab";
import { AuthContext } from "./Auth";

const Context = createContext();

const api = new Api({
  baseurl: process.env.API_DOMAIN,
});

/**
 * The Root context is similar to the rootReducer in redux.
 * It includes all global contexts and injects the root state to them.
 */
export default class RootContext extends PureComponent {
  static Consumer = Context.Consumer;
  static Provider = RootContext;

  static defaultProps = {
    defaultContext: {
      api,
      bitbucket: new BitbucketApi(),
      github: new GithubApi(),
      gitlab: new GitlabApi(),
    },
  };

  static propTypes = {
    Router: PropTypes.func,
    children: PropTypes.node,
    defaultContext: PropTypes.object,
  };

  // Save API object in state, otherwise it causes unneeded re-renders.
  // https://reactjs.org/docs/context.html#caveats
  state = {
    api: this.props.defaultContext.api,
    bitbucket: this.props.defaultContext.bitbucket,
    github: this.props.defaultContext.github,
    gitlab: this.props.defaultContext.gitlab,
  };

  render() {
    const { Router, defaultContext } = this.props;

    return (
      <Router>
        {/* The route is required to make the app responsive to route changes */}
        <Route
          path={"/"}
          render={() => (
            <Context.Provider value={this.state}>
              <AuthContext.Provider
                defaultContext={defaultContext}
                api={this.state.api}
                bitbucket={this.state.bitbucket}
                github={this.state.github}
                gitlab={this.state.gitlab}
              >
                {this.props.children}
              </AuthContext.Provider>
            </Context.Provider>
          )}
        />
      </Router>
    );
  }
}

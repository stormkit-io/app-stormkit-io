import React, { PureComponent, createContext } from "react";
import PropTypes from "prop-types";
import { Redirect, withRouter } from "react-router-dom";
import { LocalStorage } from "~/utils/storage";
import openPopup from "~/utils/helpers/popup";

const Context = createContext();
const LS_USER = "skit_user";

/**
 * For Server Side - if one day it's needed - simply
 * move the state changers as static and pass as an argument
 * the setState function.
 */
class AuthContext extends PureComponent {
  static defaultProps = {
    defaultContext: {
      loading: true,
      user: null,
      error: null,
      logout: async (e) => {
        e && e.preventDefault();
        const { api } = this.props;

        api.removeAuthToken();
        LocalStorage.del(LS_USER);
        this.setState({ user: null });
        window.location.href = "/";
      },
      loginOauth: (provider) => () => {
        return new Promise((resolve) => {
          const { api } = this.props;
          const url = api.baseurl + `/auth/${provider}`;
          const title = "oauthWindow";
          const onClose = (data) => {
            if (data.sessionToken) {
              api.setAuthToken(data.sessionToken); // adds it to local storage
              this.persistUser(data.user);

              // Persist it for this session
              this.props.bitbucket.accessToken = data.accessToken;
              this.props.github.accessToken = data.accessToken;
              this.props.gitlab.accessToken = data.accessToken;

              resolve({
                user: data.user,
                sessionToken: data.sessionToken,
                accessToken: data.accessToken,
              });
            }

            if (data.success === false) {
              if (data.email === false) {
                this.setState({
                  error:
                    "We could not fetch your primary verified email from the provider. Make sure your email is verified.",
                });
              } else {
                this.setState({
                  error:
                    "An error occurred while authenticating. Please retry.",
                });
              }
            }
          };

          openPopup({ url, title, onClose });
        });
      },
    },
  };

  static propTypes = {
    location: PropTypes.object,
    api: PropTypes.object,
    gitlab: PropTypes.object,
    github: PropTypes.object,
    bitbucket: PropTypes.object,
    defaultContext: PropTypes.object,
  };

  // This is important: we need to default to initial props
  // in order to be able to provide a default context and test behaviour.
  state = {
    loading: this.props.defaultContext.loading || false,
    user: this.props.defaultContext.user || null,
    error: this.props.defaultContext.error || null,
  };

  async componentDidMount() {
    const { api } = this.props;

    try {
      const token = api.getAuthToken();

      if (token) {
        api.setAuthToken(token);
        const { user, ok } = await api.fetch("/user");

        if (ok) {
          return this.persistUser(user);
        }
      }

      throw new Error("Something went wrong, log in again.");
    } catch (e) {
      this.setState({ loading: false });
    }
  }

  getContext = () => ({
    ...this.state,
    ...this.props.defaultContext,
  });

  persistUser = (user) => {
    this.setState({ user, loading: false });
    LocalStorage.set(LS_USER, user);
  };

  render() {
    const { user, loading } = this.state;
    const { location } = this.props;

    if (loading) {
      return null;
    }

    const { pathname, search } = location;

    // Redirect the user to the console login if he/she
    // is not logged in and the pathname is not auth.
    if (!user && pathname.indexOf("/auth") === -1) {
      const encoded =
        pathname !== "/" && pathname !== "/logout"
          ? encodeURIComponent(`${pathname}${search}`)
          : undefined;

      return <Redirect to={`/auth${encoded ? `?redirect=${encoded}` : ""}`} />;
    }

    return (
      <Context.Provider value={this.getContext()}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

const enhanced = withRouter(AuthContext);

export default Object.assign(enhanced, {
  Consumer: Context.Consumer,
  Provider: enhanced,
});

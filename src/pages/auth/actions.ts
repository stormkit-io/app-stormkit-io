import { useEffect, useState } from "react";
import api, { LS_ACCESS_TOKEN, LS_PROVIDER } from "~/utils/api/Api";
import bitbucketApi from "~/utils/api/Bitbucket";
import githubApi from "~/utils/api/Github";
import gitlabApi from "~/utils/api/Gitlab";
import openPopup, { DataMessage } from "~/utils/helpers/popup";
import { LocalStorage } from "~/utils/storage";

const LS_USER = "skit_user";

interface FetchUserReturnValue {
  error: string | null;
  loading: boolean;
  user?: User;
  accounts: Array<ConnectedAccount>;
  setUser: (u: User) => void;
  setError: SetError;
}

interface FetchUserResponse {
  accounts: Array<ConnectedAccount>;
  user: User;
  paymentRequired?: boolean;
  ok: boolean;
}

export const useFetchUser = (): FetchUserReturnValue => {
  const token = api.getAuthToken();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User>();
  const [accounts, setAccounts] = useState<Array<ConnectedAccount>>([]);
  const [loading, setLoading] = useState<boolean>(!!token);

  useEffect(() => {
    let unmounted: boolean;

    if (token) {
      setLoading(true);
      api.setAuthToken(token);
      api
        .fetch<FetchUserResponse>("/user")
        .then(({ user, ok, accounts, paymentRequired }) => {
          if (ok && !unmounted) {
            setUser({ ...user, paymentRequired });
            setAccounts(accounts);
            LocalStorage.set(LS_USER, user);
          }
        })
        .catch(e => {
          if (!unmounted && e.status !== 401) {
            setError("Something went wrong, log in again.");
          }
        })
        .finally(() => {
          if (!unmounted) {
            setLoading(false);
          }
        });
    }

    return () => {
      unmounted = true;
    };
  }, [api, token]);

  return { error, user, accounts, loading, setError, setUser };
};

export const logout = () => (): void => {
  api.removeAuthToken();
  LocalStorage.del(LS_USER);
  LocalStorage.del(LS_ACCESS_TOKEN);
  window.location.href = "/";
};

interface LoginOauthProps {
  setUser: (u: User) => void;
  setError: SetError;
}

export interface LoginOauthReturnValue {
  user: User;
  accessToken: string;
  sessionToken: string;
}

// This one returns a function that returns another function.
// The first function is used to inject the api props. The second
// function produces an oauthlogin function based on the provider.
export const loginOauth = ({ setUser, setError }: LoginOauthProps) => {
  return (provider: Provider): Promise<LoginOauthReturnValue> => {
    return new Promise(resolve => {
      let url = api.baseurl + `/auth/${provider}`;
      const referral = LocalStorage.get("referral") || "";
      if (referral !== "") {
        url = `${url}?referral=${referral}`;
      }

      const title = "oauthWindow";

      const onClose = (data: DataMessage) => {
        if (data?.sessionToken) {
          api.setAuthToken(data.sessionToken); // adds it to local storage
          setUser(data.user!);

          // Persist it for this session
          bitbucketApi.accessToken = data.accessToken;
          githubApi.accessToken = data.accessToken;
          gitlabApi.accessToken = data.accessToken;

          LocalStorage.set(LS_ACCESS_TOKEN, data.accessToken);
          LocalStorage.set(LS_PROVIDER, provider);

          resolve({
            user: data.user!,
            sessionToken: data.sessionToken,
            accessToken: data.accessToken!,
          });
        }

        if (data?.success === false) {
          if (data.email === false) {
            setError(
              "We could not fetch your primary verified email from the provider. Make sure your email is verified."
            );
          } else {
            setError("An error occurred while authenticating. Please retry.");
          }
        }
      };

      openPopup({ url, title, onClose });
    });
  };
};

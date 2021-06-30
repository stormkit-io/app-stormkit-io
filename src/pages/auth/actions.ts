import { useEffect, useState } from "react";
import Api from "~/utils/api/Api";
import Bitbucket from "~/utils/api/Bitbucket";
import Github from "~/utils/api/Github";
import Gitlab from "~/utils/api/Gitlab";
import openPopup from "~/utils/helpers/popup";
import { LocalStorage } from "~/utils/storage";

const LS_USER = "skit_user";

interface FetchUserProps {
  api: Api;
}

interface FetchUserReturnValue {
  error: string | null;
  loading: boolean;
  user?: User;
  setUser: (u: User) => void;
  setError: SetError;
}

interface FetchUserResponse {
  user: User;
  ok: boolean;
}

export const useFetchUser = ({ api }: FetchUserProps): FetchUserReturnValue => {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unmounted: boolean;

    const token = api.getAuthToken();

    if (token) {
      setLoading(true);
      api.setAuthToken(token);
      api
        .fetch<FetchUserResponse>("/user")
        .then(({ user, ok }) => {
          if (ok && !unmounted) {
            setUser(user);
            LocalStorage.set(LS_USER, user);
          }
        })
        .catch(_ => {
          if (!unmounted) {
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
  }, [api]);

  return { error, user, loading, setError, setUser };
};

interface LogoutProps {
  api: Api;
}

export const logout = ({ api }: LogoutProps) => (): void => {
  api.removeAuthToken();
  LocalStorage.del(LS_USER);
  window.location.href = "/";
};

interface DataMessage {
  accessToken: string;
  sessionToken: string;
  user: User;
  success: boolean;
  email: boolean;
}

interface LoginOauthProps {
  api: Api;
  bitbucket: Bitbucket;
  gitlab: Gitlab;
  github: Github;
  setUser: (u: User) => void;
  setError: SetError;
}

interface LoginOauthReturnValue {
  user: User;
  accessToken: string;
  sessionToken: string;
}

// This one returns a function that returns another function.
// The first function is used to inject the api props. The second
// function produces an oauthlogin function based on the provider.
export const loginOauth = ({
  api,
  bitbucket,
  gitlab,
  github,
  setUser,
  setError
}: LoginOauthProps) => {
  return (provider: Provider): (() => Promise<LoginOauthReturnValue>) => {
    return () =>
      new Promise(resolve => {
        const url = api.baseurl + `/auth/${provider}`;
        const title = "oauthWindow";

        const onClose = (data: DataMessage) => {
          if (data?.sessionToken) {
            api.setAuthToken(data.sessionToken); // adds it to local storage
            setUser(data.user);

            // Persist it for this session
            bitbucket.accessToken = data.accessToken;
            github.accessToken = data.accessToken;
            gitlab.accessToken = data.accessToken;

            resolve({
              user: data.user,
              sessionToken: data.sessionToken,
              accessToken: data.accessToken
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

import { useEffect, useState } from "react";
import api, { LS_ACCESS_TOKEN, LS_PROVIDER } from "~/utils/api/Api";
import bitbucketApi from "~/utils/api/Bitbucket";
import gitlabApi from "~/utils/api/Gitlab";
import openPopup, { DataMessage } from "~/utils/helpers/popup";
import { LocalStorage } from "~/utils/storage";

interface FetchUserReturnValue {
  error: string | null;
  loading: boolean;
  user?: User;
  accounts: Array<ConnectedAccount>;
  setUser: (u: User) => void;
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
        .then(({ user, ok, accounts }) => {
          if (ok && !unmounted) {
            setUser(user);
            setAccounts(accounts);
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

  return { error, user, accounts, loading, setUser };
};

interface Providers {
  github: boolean;
  gitlab: boolean;
  bitbucket: boolean;
  basicAuth?: "enabled";
}

export const useFetchActiveProviders = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<Providers>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    api
      .fetch<Providers>("/auth/providers")
      .then(p => setProviders(p))
      .catch(() =>
        setError("Something went wrong while fetching providers, try again.")
      )
      .finally(() => setLoading(false));
  }, []);

  return { error, loading, providers };
};

export const logout = () => (): void => {
  api.removeAuthToken();
  window.location.href = "/";
};

interface LoginOauthProps {
  setUser: (u: User) => void;
}

export interface LoginOauthReturnValue {
  user: User;
  accessToken: string;
  sessionToken: string;
}

// This one returns a function that returns another function.
// The first function is used to inject the api props. The second
// function produces an oauthlogin function based on the provider.
export const loginOauth = ({ setUser }: LoginOauthProps) => {
  return (provider: Provider): Promise<LoginOauthReturnValue> => {
    return new Promise((resolve, reject) => {
      let url = api.baseurl + `/auth/${provider}`;

      const title = "oauthWindow";
      let alreadyClosed = false;

      const onClose = (data: DataMessage) => {
        // This function gets called twice with different data for some reason.
        // This hack makes sure the second is disregarded.
        if (alreadyClosed) {
          return;
        }

        alreadyClosed = true;

        if (data?.sessionToken) {
          api.setAuthToken(data.sessionToken); // adds it to local storage
          setUser(data.user!);

          // Persist it for this session
          if (data.accessToken) {
            bitbucketApi.accessToken = data.accessToken!;
            gitlabApi.accessToken = data.accessToken;
            LocalStorage.set(LS_ACCESS_TOKEN, data.accessToken);
          }

          if (provider) {
            LocalStorage.set(LS_PROVIDER, provider);
          }

          resolve({
            user: data.user!,
            sessionToken: data.sessionToken,
            accessToken: data.accessToken!,
          });
        }

        if (!data?.success) {
          if (data.email === false) {
            reject(
              "We could not fetch your primary verified email from the provider. Make sure your email is verified."
            );
          } else if (data.error === "seats-full") {
            reject(
              "Your license does not allow more seats. Upgrade your plan to accept new users."
            );
          } else if (data.error === "account-too-new") {
            reject(
              "Your provider account is newly created. We do not accept new accounts. Please wait a few days."
            );
          } else {
            reject("An error occurred while authenticating. Please retry.");
          }
        }
      };

      openPopup({ url, title, onClose });
    });
  };
};

interface FetchTeamsProps {
  user?: User;
  refreshToken: Number;
}

export const useFetchTeams = ({ user, refreshToken }: FetchTeamsProps) => {
  const [teams, setTeams] = useState<Team[]>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    api
      .fetch<Team[]>("/teams")
      .then(teams => {
        setTeams(teams);
      })
      .catch(() => {
        setError("Something went wrong while fetching teams.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshToken, user]);

  return { teams, error, loading };
};

// instanceDetailsCache.ts
type CacheState = {
  details?: InstanceDetails;
  loading: boolean;
  subscribers: Set<
    (data: { details?: InstanceDetails; loading: boolean }) => void
  >;
  fetchPromise: Promise<void> | null;
};

export const cache: CacheState = {
  loading: true,
  subscribers: new Set(),
  fetchPromise: null,
};

const notifySubscribers = () => {
  cache.subscribers.forEach(callback =>
    callback({ details: cache.details, loading: cache.loading })
  );
};

const fetchData = async () => {
  if (cache.fetchPromise) return cache.fetchPromise;

  cache.fetchPromise = api
    .fetch<InstanceDetails>("/instance")
    .then(d => {
      cache.details = {
        ...d,
        update: {
          api: d.latest?.apiVersion !== d.stormkit?.apiVersion,
        },
      };
    })
    .catch(() => {
      cache.details = {
        update: { api: true },
        stormkit: { selfHosted: true, apiCommit: "", apiVersion: "" },
      };
    })
    .finally(() => {
      cache.loading = false;
      notifySubscribers();
    });

  return cache.fetchPromise;
};

// Hook that uses the cache
export const useFetchInstanceDetails = () => {
  const [state, setState] = useState<{
    details?: InstanceDetails;
    loading: boolean;
  }>({
    details: cache.details,
    loading: cache.loading,
  });

  useEffect(() => {
    // If we already have data, use it
    if (cache.details && !cache.loading) {
      setState({ details: cache.details, loading: false });
      return;
    }

    // Subscribe to updates
    const callback = (data: {
      details?: InstanceDetails;
      loading: boolean;
    }) => {
      setState(data);
    };

    cache.subscribers.add(callback);

    // Start fetch if it hasn't started
    if (!cache.fetchPromise) {
      fetchData();
    }

    return () => {
      cache.subscribers.delete(callback);
    };
  }, []);

  return state;
};

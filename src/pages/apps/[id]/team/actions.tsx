import React, { useEffect, useState } from "react";
import { Location, History } from "history";
import { useLocation } from "react-router-dom";
import Link from "~/components/Link";
import api from "~/utils/api/Api";

interface FetchMemberProps {
  app: App;
}

interface LocationState extends Location {
  members: number;
}

export interface Member {
  appId: string;
  isOwner: Boolean;
  createdAt: number | null;
  user: User;
}

interface FetchMemberResponse {
  members: Member[];
}

interface FetchMemberReturnValue {
  loading: boolean;
  error: string | null;
  members: Member[];
}

export const useFetchMembers = ({
  app,
}: FetchMemberProps): FetchMemberReturnValue => {
  const location = useLocation<LocationState>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const refresh = location?.state?.members;

  useEffect(() => {
    let unmounted = false;

    setLoading(true);

    api
      .fetch<FetchMemberResponse>(`/app/${app.id}/members`)
      .then(res => {
        if (unmounted !== true) {
          setLoading(false);
          setMembers(res.members);
        }
      })
      .catch(() => {
        if (unmounted !== true) {
          setLoading(false);
          setError(
            "Something went wrong while fetching members list. Please try again and if the problem persists contact us from Discord or email."
          );
        }
      });

    return () => {
      unmounted = true;
    };
  }, [api, app, refresh]);

  return { loading, error, members };
};

interface HandleInviteProps {
  app: App;
  setToken: (v: string) => void;
  setError: SetError;
  setLoading: SetLoading;
}

interface InviteFormValues {
  displayName: string;
  provider: Provider;
}

interface HandleInviteResponse {
  token: string;
}

export const handleInvite =
  ({ app, setToken, setError, setLoading }: HandleInviteProps) =>
  ({ displayName, provider }: InviteFormValues) => {
    setLoading(true);

    api
      .post<HandleInviteResponse>(`/app/members/invite`, {
        appId: app.id,
        displayName,
        provider,
      })
      .then(res => {
        setToken(res.token);
      })
      .catch(async res => {
        if (res.status === 400) {
          const data = await res.json();

          if (data.code === "inception") {
            return setError("Funny move, but you cannot invite yourself.");
          }

          return setError("Please provide a display name.");
        }

        if (res.status === 402) {
          return setError(
            <div>
              Your current package does not allow adding more team members.{" "}
              <br />
              You can always <Link to="/user/account">upgrade</Link> to proceed.
            </div>
          );
        }
      })
      .then(() => {
        setLoading(false);
      });
  };

interface HandleDeleteProps {
  userId: string;
  app: App;
  history: History;
  setError: SetError;
  setLoading: SetLoading;
}

export const handleDelete = ({
  userId,
  app,
  history,
  setError,
  setLoading,
}: HandleDeleteProps): Promise<void> => {
  setLoading(true);

  return api
    .delete(`/app/member`, { appId: app.id, userId })
    .then(() => {
      setLoading(false);
      setTimeout(() => {
        history.replace({ state: { members: Date.now() } });
      }, 250);
    })
    .catch(res => {
      setLoading(false);
      setError(
        res.error ||
          "An unknown error occurred. Please try again and if the problem persists contact us from Discord or email."
      );
    });
};

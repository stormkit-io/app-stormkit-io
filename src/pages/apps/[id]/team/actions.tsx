import React, { useEffect, useState } from "react";
import { Location, History } from "history";
import { useLocation } from "react-router-dom";
import Link from "~/components/Link";
import Api from "~/utils/api/Api";
import { ConfirmModalProps } from "~/components/ConfirmModal";

interface FetchMemberProps {
  api: Api;
  app: App;
}

interface LocationState extends Location {
  members: number;
}

interface Member {
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
  api,
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
  api: Api;
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
  ({ api, app, setToken, setError, setLoading }: HandleInviteProps) =>
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

interface HandleDeleteProps extends Pick<ConfirmModalProps, "confirmModal"> {
  userId: string;
  api: Api;
  app: App;
  history: History;
}

export const handleDelete =
  ({ userId, api, app, history, confirmModal }: HandleDeleteProps) =>
  () => {
    confirmModal(
      "Your are about to remove a member from this app. You will need to re-invite if the user needs access again.",
      {
        onConfirm: ({ setError, setLoading, closeModal }) => {
          setLoading(true);

          api
            .delete(`/app/member`, { appId: app.id, userId })
            .then(() => {
              setLoading(false);
              closeModal();
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
        },
      }
    );
  };

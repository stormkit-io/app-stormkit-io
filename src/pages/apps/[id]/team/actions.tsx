import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface FetchMemberProps {
  app: App;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

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
  }, [api, app]);

  return { loading, error, members };
};

interface HandleInviteProps {
  app: App;
  values: Record<string, string>;
}

interface HandleInviteResponse {
  token: string;
}

export const handleInvite = ({ app, values }: HandleInviteProps) => {
  return api.post<HandleInviteResponse>(`/app/members/invite`, {
    appId: app.id,
    displayName: values.displayName,
    provider: values.provider,
  });
};

interface DeleteTeamMemberProps {
  userId: string;
  app: App;
}

export const deleteTeamMember = ({
  userId,
  app,
}: DeleteTeamMemberProps): Promise<void> => {
  return api.delete(`/app/member`, { appId: app.id, userId });
};

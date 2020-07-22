import React, { useEffect, useState } from "react";
import Link from "~/components/Link";

export const useFetchMembers = ({ api, app, location }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const refresh = location?.state?.members;

  useEffect(() => {
    let unmounted = false;

    setLoading(true);

    api
      .fetch(`/app/${app.id}/members`)
      .then((res) => {
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

export const handleInvite = ({ api, app, setToken, setError, setLoading }) => ({
  displayName,
  provider,
}) => {
  setLoading(true);

  api
    .post(`/app/members/invite`, { appId: app.id, displayName, provider })
    .then((res) => {
      setToken(res.token);
    })
    .catch(async (res) => {
      if (res.status === 400) {
        const data = await res.json();
        if (data.code === "inception") {
          return setError("Funny move, but you cannot invite yourself.");
        } else {
          return setError("Please provide a display name.");
        }
      }

      if (res.status === 402) {
        return setError(
          <div>
            Your current package does not allow adding more team members. <br />
            You can always <Link to="/user/account">upgrade</Link> to proceed.
          </div>
        );
      }
    })
    .then(() => {
      setLoading(false);
    });
};

export const handleDelete = ({
  userId,
  api,
  app,
  history,
  confirmModal,
}) => () => {
  confirmModal(
    "Your are about to remove a member from this app. You will need to re-invite if the user needs access again.",
    {
      onConfirm: ({ setError, setLoading, closeModal }) => {
        setLoading(true);

        api
          .delete(`/app/member`, { appId: app.id, userId })
          .then(() => {
            setLoading(false);
            closeModal(() => {
              history.replace({ state: { members: Date.now() } });
            });
          })
          .catch((res) => {
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

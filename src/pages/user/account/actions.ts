import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

export type StatusName = "trialing" | "active";

interface Email {
  address: string;
  verified: boolean;
  primary: boolean;
}

export const useFetchEmails = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    api
      .fetch<{ emails: Email[] }>("/user/emails")
      .then(({ emails }) => {
        setEmails(emails);
      })
      .catch(() => {
        setError("Something went wrong while fetching list of emails.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { emails, error, loading };
};

type LoadingState = "delete" | "submit" | null;

interface Message {
  type: "error" | "success" | "default";
  content: string;
}

interface UsePersonalAccessTokenStateProps {
  hasToken: boolean;
}

interface UsePersonalAccessTokenStateReturnValue {
  msg?: Message;
  loading: LoadingState;
  token: string;
  submitToken: () => void;
  deleteToken: () => void;
  setToken: (v: string) => void;
}

export const usePersonalAccessTokenState = ({
  hasToken,
}: UsePersonalAccessTokenStateProps): UsePersonalAccessTokenStateReturnValue => {
  const [loading, setLoading] = useState<LoadingState>(null);
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState<Message | undefined>(
    hasToken
      ? {
          type: "default",
          content:
            "There is already a personal access token associated with this account. Submit a new one to overwrite.",
        }
      : undefined
  );

  const deleteToken = () => {
    setLoading("delete");

    api
      .put("/user/access-token", { token: "" })
      .then(() => {
        setLoading(null);
        setMsg({
          type: "success",
          content:
            "The access token has been deleted successfully. From now on, oAuth will be used as the authentication method.",
        });
      })
      .catch(() => {
        setLoading(null);
        setMsg({
          type: "error",
          content:
            "Something went wrong while updating the personal access token. Please try again.",
        });
      });
  };

  const submitToken = () => {
    setLoading("submit");

    api
      .put("/user/access-token", { token })
      .then(() => {
        setLoading(null);
        setMsg({
          type: "success",
          content:
            "The access token has been updated successfully. From now on, it'll be used to connect to the provider.",
        });
      })
      .catch(() => {
        setLoading(null);
        setMsg({
          type: "error",
          content:
            "Something went wrong while updating the personal access token. Please try again.",
        });
      });
  };

  return { msg, token, deleteToken, submitToken, setToken, loading };
};

export const deleteUser = async () => {
  return await api.delete(`/user`);
};

import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface UseFetchAuditsProps {
  appId?: string;
  envId?: string;
  teamId?: string;
  nextPage?: number;
}

export const useFetchAudits = ({
  teamId,
  envId,
  appId,
  nextPage,
}: UseFetchAuditsProps) => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [beforeId, setBeforeId] = useState("");

  const params = new URLSearchParams(
    JSON.parse(
      JSON.stringify({
        teamId,
        appId,
        envId,
        beforeId,
      })
    )
  );

  useEffect(() => {
    if (!appId && !teamId && !envId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(undefined);

    api
      .fetch<{ audits: Audit[]; pagination: Pagination }>(
        `/audits?${params.toString()}`
      )
      .then(({ audits: newAudits, pagination }) => {
        setAudits(beforeId ? [...audits, ...newAudits] : newAudits);

        if (pagination.hasNextPage && pagination.beforeId) {
          setBeforeId(pagination.beforeId);
        } else {
          setBeforeId("");
        }
      })
      .catch(() => {
        setError(
          "Something went wrong while fetching audits. Try again later."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [envId, appId, teamId, nextPage]);

  return { audits, error, loading, hasNextPage: beforeId !== "" };
};

import type { Log } from "./actions";
import React, { useContext } from "react";
import { useParams, useLocation } from "react-router";
import { AppContext } from "~/pages/apps/[id]/App.context";
import Container from "~/components/Container";
import { useFetchDeploymentRuntimeLogs } from "./actions";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBoxV2";
import Link from "~/components/Link";

const renderLog = (log: Log, i: number) => {
  let data = log.data.split(/END\sRequestId:/)[0];

  if (data.indexOf("\tINFO\t") > -1) {
    data = data.split("\tINFO\t")[1];
  }

  data = data.split(/\n?START/)[0];

  if (data.trim().length === 0) {
    return <></>;
  }

  return (
    <div key={`${log.timestamp}${i}`} className="mb-1 whitespace-pre-wrap">
      <span className="text-gray-50 inline-block mr-1">
        {new Date(Number(log.timestamp) * 1000)
          .toISOString()
          .split(".")[0]
          .replace("T", " ")}
      </span>
      {data}
    </div>
  );
};

const RuntimeLogs: React.FC = () => {
  const { deploymentId } = useParams();
  const location = useLocation();
  const { app } = useContext(AppContext);
  const { logs, error, loading } = useFetchDeploymentRuntimeLogs({
    appId: app.id,
    deploymentId,
  });

  return (
    <Container
      title={
        <p>
          Runtime logs
          <Link
            className="block mt-1"
            to={location.pathname.replace("/runtime-logs", "")}
          >
            <span className="fa fa-chevron-left mr-2" />#{deploymentId}
          </Link>
        </p>
      }
      maxWidth="max-w-none"
    >
      <div className="p-4 pt-0">
        {loading && (
          <div className="flex items-center w-full justify-center">
            <Spinner />
          </div>
        )}
        {error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
        {!loading &&
          (logs.length > 0 ? (
            <div className="bg-blue-10 font-mono text-xs p-4 pb-3">
              {logs.map(renderLog)}
            </div>
          ) : (
            "Nothing found"
          ))}
      </div>
    </Container>
  );
};

export default RuntimeLogs;

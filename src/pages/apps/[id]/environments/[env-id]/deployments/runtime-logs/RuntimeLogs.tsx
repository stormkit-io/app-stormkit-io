import type { Log } from "./actions";
import React, { useContext } from "react";
import { useParams, useLocation } from "react-router";
import emptyListSvg from "~/assets/images/empty-list.svg";
import { AppContext } from "~/pages/apps/[id]/App.context";
import Container from "~/components/Container";
import { useFetchDeploymentRuntimeLogs } from "./actions";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBoxV2";
import Link from "~/components/Link";

const renderLog = (log: Log, i: number) => {
  let data = log.data.split(/END\sRequestId:/)[0];

  // Regex to remove lines like:
  // 2022-10-20T13:05:30.027Z	undefined	TRACE
  // 2022-10-20T13:05:30.028Z	undefined	ERROR
  data = data.replace(
    /20[0-9]{2}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[[0-9]+Z.*(ERROR|TRACE|INFO|WARN)\t?/g,
    ""
  );

  // Regex to remove lines like:
  // START RequestId: <request-id> Version: 1
  data = data.replace(/START\sRequestId:\s[\sa-z0-9-]+\sVersion:\s[0-9]+/, "");
  data = data.trim();

  if (data.length === 0) {
    return <></>;
  }

  return (
    <div key={`${log.timestamp}${i}`} className="whitespace-pre-wrap flex">
      <span className="text-gray-50 bg-black p-3 flex flex-shrink-0">
        {new Date(Number(log.timestamp) * 1000)
          .toISOString()
          .split(".")[0]
          .replace("T", " ")}
      </span>
      <span className="inline-block p-3">{data}</span>
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
            <div className="bg-blue-10 font-mono text-xs">
              {logs.map(renderLog)}
            </div>
          ) : (
            <div className="p-4 flex items-center justify-center flex-col">
              <p className="mt-8">
                <img src={emptyListSvg} alt="No feature flags" />
              </p>
              <p className="mt-8">It is quite empty here.</p>
              <p>
                Logs produced by server side rendered apps and APIs will be
                displayed here.
              </p>
            </div>
          ))}
      </div>
    </Container>
  );
};

export default RuntimeLogs;

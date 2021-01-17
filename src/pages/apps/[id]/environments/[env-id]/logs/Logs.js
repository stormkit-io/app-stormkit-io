import React from "react";
import PropTypes from "prop-types";
import RootContext from "~/pages/Root.context";
import AppContext from "~/pages/apps/App.context";
import InfoBox from "~/components/InfoBox";
import Spinner from "~/components/Spinner";
import { connect } from "~/utils/context";
import EnvironmentContext from "../Environment.context";
import { useFetchLogs } from "./actions";

const Logs = ({ api, environment, app }) => {
  const { logs, error, loading } = useFetchLogs({ environment, app, api });

  return (
    <div className="bg-white rounded p-8 mt-4">
      {error && !loading && (
        <InfoBox type={InfoBox.ERROR}>{error.message || error}</InfoBox>
      )}
      {loading && (
        <div className="flex justify-center">
          <Spinner primary />
        </div>
      )}
      {!loading && (
        <div>
          <h2 className="text-lg font-bold mb-4">Logs</h2>
          <div className="font-mono text-xs bg-blue-10 text-white p-4 rounded">
            {logs.length ? (
              logs.map((log, i) => (
                <div
                  key={`${log.timestamp}-${i}`}
                  className="mb-2"
                  title={log.requestId}
                >
                  <div className="flex opacity-50 mb-1">
                    <span className="flex-auto">
                      {new Date(log.timestamp * 1000).toLocaleDateString(
                        "en-CH",
                        {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                        }
                      )}
                    </span>
                    <div className="ml-2">[{log.label || "info"}]</div>
                  </div>
                  <div className="break-all">{log.data}</div>
                </div>
              ))
            ) : (
              <p>
                Serverless logs are captured and displayed here. For static
                applications there are no logs to display.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Logs.propTypes = {
  env: PropTypes.object,
  envs: PropTypes.array,
  app: PropTypes.object
};

export default Object.assign(
  connect(Logs, [
    { Context: RootContext, props: ["api"] },
    { Context: AppContext, props: ["app"] },
    { Context: EnvironmentContext, props: ["environment"] }
  ])
);

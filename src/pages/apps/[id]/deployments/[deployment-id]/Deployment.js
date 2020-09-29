import React, { useRef } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import RootContext from "~/pages/Root.context";
import AppsContext from "~/pages/apps/Apps.context";
import Spinner from "~/components/Spinner";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";
import { BackButton } from "~/components/Buttons";
import { connect } from "~/utils/context";
import { parseCommit } from "~/utils/helpers/deployments";
import { useFetchDeployment, useScrollIntoView } from "./actions";
import { prepareSettings, getExitCode } from "./helpers";
import ExitStatus from "../_components/ExitStatus";

const Deployment = ({ api, app, match }) => {
  const spinnerRef = useRef();
  const deployId = match.params.deploymentId;
  const { deploy, error, loading } = useFetchDeployment({ api, app, deployId });
  const commit = parseCommit(deploy);
  const settings = deploy.id ? prepareSettings({ deploy, commit }) : [];

  useScrollIntoView({ ref: spinnerRef, loading });

  return (
    <div>
      <h1 className="flex items-center mb-8">
        <BackButton to={`/apps/${app.id}/deployments`} className="mr-4" />
        <span className="text-2xl text-white">Deployments</span>
      </h1>
      {loading ? (
        <div className="flex justify-center bg-white rounded p-4">
          <Spinner primary />
        </div>
      ) : error ? (
        <div className="flex justify-center bg-white rounded p-4">
          <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>
        </div>
      ) : (
        <div className="flex flex-col justify-center bg-white rounded p-8 mb-4">
          <div className="flex items-center mb-8">
            <ExitStatus code={deploy.exit} iconOnly className="text-2xl mr-4" />
            <div>
              <div className="text-lg font-bold">{commit.msg}</div>
              {commit.author && <div>by {commit.author}</div>}
            </div>
          </div>
          <div className="rounded bg-gray-90 p-4">
            {settings
              .filter((i) => i?.value)
              .map((s) => (
                <div key={s.text} className="flex mb-4">
                  <div className="min-w-56">{s.text}</div>
                  <div>{s.value}</div>
                </div>
              ))}
          </div>
          <div className="mt-8">
            {deploy.logs?.map(({ title, status, message = "" }, i) => (
              <div
                key={title}
                className={cn("border border-gray-83 border-solid rounded", {
                  "mb-8": i < deploy.logs.length - 1,
                })}
              >
                <div className="flex justify-between p-4">
                  <span className="font-bold">
                    {i}. {title}
                  </span>
                  <ExitStatus
                    aria-label={`${title} status`}
                    code={getExitCode({ deploy, index: i, status })}
                  />
                </div>
                <code
                  className="block font-mono bg-blue-10 p-4 text-white rounded-br rounded-bl leading-relaxed overflow-y-auto"
                  style={{ maxHeight: "300px" }}
                >
                  {message.split("\n").map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </code>
              </div>
            ))}
            {deploy.isRunning && (
              <div className="flex justify-center mt-4" ref={spinnerRef}>
                <Spinner primary />
              </div>
            )}
            {!deploy.isRunning && deploy.tip && (
              <div className="mt-4" ref={spinnerRef}>
                <InfoBox type={InfoBox.WARNING}>{deploy.tip}</InfoBox>
              </div>
            )}
            {!deploy.isRunning && deploy.exit === 0 && (
              <div className="flex justify-center mt-4">
                <Button href={deploy.preview} primary>
                  Preview
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Deployment.propTypes = {
  app: PropTypes.object,
  api: PropTypes.object,
  match: PropTypes.object,
};

export default connect(Deployment, [
  { Context: RootContext, props: ["api"] },
  { Context: AppsContext, props: ["app"] },
]);

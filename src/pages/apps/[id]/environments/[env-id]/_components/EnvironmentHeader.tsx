import React, { useContext, useState } from "react";
import { Tooltip } from "@mui/material";
import cn from "classnames";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { AppContext } from "~/pages/apps/[id]/App.context";
import Container from "~/components/Container";
import { useFetchStatus, isEmpty } from "../../actions";
import DomainStatus from "./DomainStatus";
import Link from "~/components/Link";
import Button from "~/components/ButtonV2";
import ManifestModal from "../deployments/_components/ManifestModal";

const getDomain = (env: Environment): string => {
  return env.customStorage?.externalUrl || env?.preview || "";
};

interface BoxProps {
  children: React.ReactNode;
  className?: string;
  isLast?: boolean;
}

const Box: React.FC<BoxProps> = ({ children, className, isLast = false }) => {
  return (
    <div
      className={cn(
        "py-2 my-1 md:my-2 flex items-center",
        {
          "border-b md:border-b-0 md:border-r border-solid border-blue-30 md:mr-4 md:pr-4":
            !isLast,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

const EnvironmentHeader: React.FC = () => {
  const { environment } = useContext(EnvironmentContext);
  const { app } = useContext(AppContext);
  const [deploymentToDebug, setDeploymentToDebug] = useState<Deployment>();
  const domainName = getDomain(environment);

  const { status, loading } = useFetchStatus({
    environment,
    domain: domainName,
    app,
  });

  return (
    <div className="w-full mb-4">
      <Container
        className="flex items-stretch px-4 text-sm flex-col md:flex-row"
        maxWidth="max-w-none"
      >
        <Box>
          <DomainStatus loading={loading} status={status} />
        </Box>
        <Box>
          <Link to={domainName}>{domainName.replace(/^https?:\/\//, "")}</Link>
        </Box>
        <Box className="flex-1">
          <span className="fa fa-code-branch mr-2" />
          {environment.branch}
        </Box>
        <Box isLast>
          {!environment.lastDeploy?.id ? (
            <>
              <Tooltip
                title={"Deploy your app to start serving your application."}
                placement="bottom"
                arrow
              >
                <span className="fas fa-info-circle mr-2 text-xl" />
              </Tooltip>
              Not yet deployed
            </>
          ) : !environment.published ? (
            <>
              <Tooltip
                title={"Publish a deployment to serve your app."}
                placement="bottom"
                arrow
              >
                <span className="fas fa-info-circle mr-2 text-xl" />
              </Tooltip>
              Not yet published
            </>
          ) : (
            <div>
              Published
              {!isEmpty(environment.published) &&
                Array.isArray(environment.published) && (
                  <>
                    :{" "}
                    {environment.published.length > 1 ? (
                      "multiple deployments"
                    ) : (
                      <Link
                        key={environment.published[0].deploymentId}
                        to={`/apps/${environment.appId}/deployments/${environment.published[0].deploymentId}`}
                      >
                        {environment.published[0].deploymentId}
                      </Link>
                    )}
                    {status?.toString()[0] !== "2" && (
                      <Tooltip
                        title={
                          <>
                            <p>
                              Click on{" "}
                              {environment.published?.length > 1 ? "a" : "the"}{" "}
                              deployment to debug
                            </p>
                            {environment.published?.map(p => (
                              <div
                                className="flex justify-between"
                                key={p.deploymentId}
                              >
                                <Button
                                  className="w-full mt-4"
                                  onClick={() => {
                                    setDeploymentToDebug({
                                      id: p.deploymentId,
                                      branch: p.branch,
                                      preview: `${
                                        domainName.indexOf(environment.name) >
                                        -1
                                          ? domainName.replace(
                                              environment.name,
                                              p.deploymentId
                                            )
                                          : domainName.replace(
                                              ".",
                                              `--${p.deploymentId}.`
                                            )
                                      }`,
                                    } as Deployment);
                                  }}
                                >
                                  #{p.deploymentId}
                                </Button>
                              </div>
                            ))}
                          </>
                        }
                      >
                        <span
                          className="ml-2 fas fa-triangle-exclamation"
                          aria-label="Deployment not found"
                        />
                      </Tooltip>
                    )}
                  </>
                )}
            </div>
          )}
        </Box>
        {deploymentToDebug && (
          <ManifestModal
            app={app}
            deployment={deploymentToDebug}
            onClose={() => {
              setDeploymentToDebug(undefined);
            }}
          />
        )}
      </Container>
    </div>
  );
};

export default EnvironmentHeader;

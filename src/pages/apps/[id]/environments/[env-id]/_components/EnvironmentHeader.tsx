import React, { useContext } from "react";
import { Tooltip } from "@mui/material";
import cn from "classnames";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { AppContext } from "~/pages/apps/[id]/App.context";
import Container from "~/components/Container";
import { useFetchStatus, isEmpty } from "../../actions";
import DomainStatus from "./DomainStatus";
import Link from "~/components/Link";

const getDomain = (env: Environment): string => {
  return (
    env.customStorage?.externalUrl?.replace(/^https?:\/\//, "") ||
    env?.getDomainName?.() ||
    ""
  );
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
        "py-2 my-2 flex items-center",
        { "border-r border-solid border-blue-30 mr-4 pr-4": !isLast },
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
  const domainName = getDomain(environment);

  const { status, loading } = useFetchStatus({
    environment,
    domain: domainName,
    app,
  });

  return (
    <div className="w-full mb-4">
      <Container
        className="flex items-stretch px-4 text-sm"
        maxWidth="max-w-none"
      >
        <Box>
          <DomainStatus loading={loading} status={status} />
        </Box>
        <Box>
          <Link to={`https://${domainName}`}>{domainName}</Link>
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
                      "multiple versions"
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
                            <span className="font-bold">
                              {environment.getDomainName?.()}
                            </span>{" "}
                            returns {status}. Navigate to the deployment page
                            and check the manifest file. Static websites should
                            contain a top level index.html file.
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
      </Container>
    </div>
  );
};

export default EnvironmentHeader;

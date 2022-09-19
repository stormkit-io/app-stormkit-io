import React, { useContext } from "react";
import { Tooltip } from "@mui/material";
import cn from "classnames";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { AppContext } from "~/pages/apps/[id]/App.context";
import Container from "~/components/Container";
import Spinner from "~/components/Spinner";
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
          {loading && <Spinner />}
          {!loading && <DomainStatus status={status} />}
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
              Not yet deployed
              <Tooltip
                title={"Deploy your app to start serving your application."}
                placement="bottom-end"
                arrow
              >
                <span className="fas fa-info-circle ml-2 text-xl" />
              </Tooltip>
            </>
          ) : !environment.published ? (
            <>
              Not yet published
              <Tooltip
                title={"Publish a deployment to serve your app."}
                placement="bottom-end"
                arrow
              >
                <span className="fas fa-info-circle ml-2 text-xl" />
              </Tooltip>
            </>
          ) : (
            <div>
              Published
              {!isEmpty(environment.published) &&
                Array.isArray(environment.published) && (
                  <>
                    :{" "}
                    {environment.published.map((deploymentId, index) => (
                      <Link
                        key={deploymentId}
                        to={`/apps/${environment.appId}/deployments/${deploymentId}`}
                      >
                        {deploymentId}
                        {index === (environment.published?.length || 0) - 1
                          ? ""
                          : ","}
                      </Link>
                    ))}
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

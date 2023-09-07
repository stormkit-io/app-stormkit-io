import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeployButton from "~/layouts/AppLayout/_components/DeployButton";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { useFetchStatus, isEmpty } from "../../actions";
import DomainStatus from "./DomainStatus";
import ManifestModal from "../deployments/_components/ManifestModal";

const getDomain = (env: Environment): string => {
  return env.customStorage?.externalUrl || env?.preview || "";
};

interface ColumnProps {
  children: React.ReactNode;
}

function Column({ children }: ColumnProps) {
  return (
    <Box
      sx={{
        pr: 2,
        mr: 2,
        pb: { xs: 1, md: 0 },
        mb: { xs: 1, md: 0 },
        width: { xs: "100%", md: "auto" },
        borderRight: { xs: "none", md: "1px solid rgba(255,255,255,0.1)" },
        borderBottom: { xs: "1px solid rgba(255,255,255,0.05)", md: "none" },
      }}
    >
      {children}
    </Box>
  );
}

export default function EnvironmentHeader() {
  const { environments } = useContext(AppContext);
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
    <Box
      bgcolor="container.paper"
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        color: "white",
        alignItems: { xs: "flex-start", md: "center" },
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Column>
        <DomainStatus loading={loading} status={status} />
      </Column>
      <Column>
        <Link href={domainName} sx={{ color: "white" }}>
          {domainName.replace(/^https?:\/\//, "")}
        </Link>
      </Column>
      <Column>
        <span className="fa fa-code-branch mr-2" />
        {environment.branch}
      </Column>
      <Box sx={{ flex: 1 }}>
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
          <Box
            sx={{
              mr: 2,
              mb: { xs: 2, md: 0 },
              width: { xs: "100%", md: "auto" },
              flex: 1,
            }}
          >
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
                      sx={{ color: "white" }}
                      href={`/apps/${environment.appId}/environments/${environment.id}/deployments/${environment.published[0].deploymentId}`}
                    >
                      {environment.published[0].deploymentId}
                    </Link>
                  )}
                  {status?.toString()[0] !== "2" && (
                    <Tooltip
                      title={
                        <Box sx={{ p: 2 }}>
                          <Typography className="text-center">
                            The endpoint returns 404.
                            <br />
                            Click on{" "}
                            {environment.published?.length > 1
                              ? "a"
                              : "the"}{" "}
                            deployment to debug.
                          </Typography>
                          {environment.published?.map(p => (
                            <Box
                              sx={{
                                textAlign: "center",
                                mt: 2,
                              }}
                              key={p.deploymentId}
                            >
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                  setDeploymentToDebug({
                                    id: p.deploymentId,
                                    branch: p.branch,
                                    preview: `${
                                      domainName.indexOf(environment.name) > -1
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
                            </Box>
                          ))}
                        </Box>
                      }
                    >
                      <Box
                        component="span"
                        sx={{ ml: 1 }}
                        className="fas fa-triangle-exclamation"
                        aria-label="Deployment not found"
                      />
                    </Tooltip>
                  )}
                </>
              )}
          </Box>
        )}
      </Box>
      <Box sx={{ width: { xs: "100%", md: "auto" } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
          <DeployButton
            app={app}
            environments={environments}
            selectedEnvId={environment.id!}
          />
        </Box>
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
    </Box>
  );
}

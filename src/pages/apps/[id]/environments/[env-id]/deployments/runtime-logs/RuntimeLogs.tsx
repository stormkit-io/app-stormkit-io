import type { Log } from "./actions";
import React, { useContext, useState } from "react";
import { useParams, useLocation } from "react-router";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import EmptyPage from "~/components/EmptyPage";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { useFetchDeploymentRuntimeLogs } from "./actions";
import Spinner from "~/components/Spinner";

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
    return null;
  }

  return (
    <Box
      key={`${log.timestamp}${i}`}
      sx={{
        whiteSpace: "pre-wrap",
        display: "flex",
        opacity: 0.5,
        mb: 1,
        px: 2,
        ":hover": {
          opacity: 1,
          bgcolor: "rgba(0,0,0,0.1)",
        },
        ":last-child": { mb: 0 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexShrink: 0,
          opacity: 0.5,
        }}
      >
        {new Date(Number(log.timestamp) * 1000)
          .toISOString()
          .split(".")[0]
          .replace("T", " ")}
      </Box>
      <Box sx={{ wordBreak: "break-all", pl: 2 }}>{data}</Box>
    </Box>
  );
};

const RuntimeLogs: React.FC = () => {
  const location = useLocation();
  const { deploymentId } = useParams();
  const { app } = useContext(AppContext);
  const [afterTs, setAfterTs] = useState<string>();

  const { logs, error, loading, hasNextPage } = useFetchDeploymentRuntimeLogs({
    appId: app.id,
    deploymentId: deploymentId!,
    afterTs,
  });

  const isLoadingFirstPage = loading && !afterTs;
  const shouldDisplayLogs = (!loading || afterTs) && logs.length > 0;

  return (
    <Box
      bgcolor="container.paper"
      sx={{
        color: "white",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ width: "100%" }}>
          <Typography variant="h6">Runtime logs</Typography>
          <Typography
            variant="subtitle2"
            sx={{
              opacity: 0.5,
              mb: 2,
            }}
          >
            Logs produced by server side rendered apps and API functions will be
            displayed here. <br /> These logs belong to deployment{" "}
            <Link href={location.pathname.replace("/runtime-logs", "")}>
              {deploymentId}
            </Link>
            .
          </Typography>
        </Box>
      </Box>

      <Box>
        {isLoadingFirstPage ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Spinner />
          </Box>
        ) : error ? (
          <Alert color="error">
            <AlertTitle>Error</AlertTitle>
            <Typography>{error}</Typography>
          </Alert>
        ) : shouldDisplayLogs ? (
          <>
            <Box
              sx={{
                display: "flex",
                p: 2,
                mb: 2,
                bgcolor: "rgba(0,0,0,0.1)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Box sx={{ width: "176px" }}>Time</Box>
              <Box>Message</Box>
            </Box>
            <Box sx={{ fontFamily: "monospace" }}>{logs.map(renderLog)}</Box>
          </>
        ) : (
          <EmptyPage>
            It's quite empty in here.
            <br />
            Logs captured by serverless functions will be displayed here.
          </EmptyPage>
        )}
      </Box>

      {!loading && hasNextPage ? (
        <Box sx={{ textAlign: "center", pt: 2 }}>
          <Button
            type="button"
            variant="text"
            color="info"
            loading={loading}
            onClick={() => {
              setAfterTs(logs[logs.length - 1]?.timestamp);
            }}
          >
            Load more
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default RuntimeLogs;

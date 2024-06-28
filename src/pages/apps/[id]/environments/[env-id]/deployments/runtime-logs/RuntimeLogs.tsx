import type { Log } from "./actions";
import React, { useContext, useState } from "react";
import { useParams, useLocation } from "react-router";
import Button from "@mui/lab/LoadingButton";
import Link from "@mui/material/Link";
import EmptyPage from "~/components/EmptyPage";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { useFetchDeploymentRuntimeLogs } from "./actions";

const borderBottom = "1px solid rgba(255,255,255,0.1)";

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

  let date;

  if (log.timestamp?.length === 10) {
    date = new Date(Number(log.timestamp) * 1000);
  } else if (log.timestamp?.length === 13) {
    date = new Date(Number(log.timestamp));
  } else {
    date = new Date();
  }

  return (
    <TableRow
      key={`${log.timestamp}${i}`}
      sx={{
        opacity: 0.75,
        ":hover": {
          color: "white !important",
          opacity: 1,
        },
      }}
    >
      <TableCell
        sx={{
          borderBottom: "none",
        }}
      >
        {date.toISOString().split(".")[0].replace("T", " ")}
      </TableCell>
      <TableCell
        sx={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          borderBottom: "none",
        }}
      >
        {data}
      </TableCell>
    </TableRow>
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
    <Card
      sx={{ width: "100%", color: "white" }}
      loading={isLoadingFirstPage}
      error={error}
    >
      <CardHeader
        title="Runtime logs"
        subtitle={
          <>
            Logs produced by server side rendered apps and API functions will be
            displayed here. <br /> These logs belong to deployment{" "}
            <Link href={location.pathname.replace("/runtime-logs", "")}>
              #{deploymentId}
            </Link>
            .
          </>
        }
      />
      {shouldDisplayLogs ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderBottom, width: "166px" }}>
                Timestamp
              </TableCell>
              <TableCell sx={{ borderBottom }}>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{logs.map(renderLog)}</TableBody>
        </Table>
      ) : (
        <EmptyPage>
          It's quite empty in here.
          <br />
          Logs captured by serverless functions will be displayed here.
        </EmptyPage>
      )}

      {!loading && hasNextPage && (
        <CardFooter sx={{ textAlign: "center" }}>
          <Button
            type="button"
            variant="text"
            loading={loading}
            onClick={() => {
              setAfterTs(logs[logs.length - 1]?.timestamp);
            }}
          >
            Load more
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RuntimeLogs;

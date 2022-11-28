import React, { useContext } from "react";
import { useParams } from "react-router";
import cn from "classnames";
import * as mui from "@mui/material";
import { AppContext } from "~/pages/apps/[id]/App.context";
import Container from "~/components/Container";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBoxV2";
import Link from "~/components/Link";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { useWithRecords } from "./actions";

const { Table, TableBody, TableCell, TableHead, TableRow } = mui;

const tdClasses = "border-blue-30 text-gray-80 py-2";
const thClasses = "border-blue-30 font-bold text-white bg-blue-20";

const Records: React.FC = () => {
  const params = useParams<{ collection: string }>();
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const { loading, error, records } = useWithRecords({
    appId: app.id,
    envId: environment.id!,
    collectionName: params.collection!,
  });

  return (
    <Container
      title={
        <div>
          <Link to="../data-store" className="font-normal text-gray-50">
            Collections
          </Link>
          <span className="fas fa-chevron-right text-xs mx-2" />
          <span>{params.collection}</span>
        </div>
      }
      maxWidth="max-w-none"
    >
      {loading && (
        <div className="flex items-center">
          <Spinner />
        </div>
      )}
      {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
      {!loading && !error && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={thClasses}>Record ID</TableCell>
              <TableCell className={cn(thClasses, "pl-2")}>Records</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, i) => (
              <TableRow
                key={record.recordId}
                className={cn("mx-4 bg-blue-50", {
                  "mt-4": i > 0,
                })}
              >
                <TableCell className={cn(tdClasses, "pl-4 pr-1 w-1/4")}>
                  {record.recordId}
                </TableCell>
                <TableCell className={cn(tdClasses, "pl-0 pr-1 w-3/4")}>
                  <code className="p-2 m-0 flex bg-transparent text-gray-50 text-xs">
                    {JSON.stringify({ ...record, recordId: undefined })}
                  </code>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default Records;

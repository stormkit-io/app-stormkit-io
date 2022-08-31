import React, { useMemo, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Form from "~/components/Form";
import DotDotDot from "~/components/DotDotDot";
import ConfirmModal from "~/components/ConfirmModal";
import { updateFeatureFlagStatus, deleteFeatureFlag } from "../actions";

interface Props {
  featureFlags: Array<FeatureFlag>;
  app: App;
  environment: Environment;
  setSelectedFlag: (val: FeatureFlag) => void;
  setLoading: SetLoading;
  setError: SetError;
  setReload: (val: number) => void;
}

const FeatureFlagTable: React.FC<Props> = ({
  featureFlags,
  app,
  environment,
  setLoading,
  setError,
  setReload,
  setSelectedFlag,
}): React.ReactElement => {
  const rows = useMemo<Array<FeatureFlag>>(() => featureFlags, [featureFlags]);
  const [flagToBeDeleted, setFlagToBeDeleted] = useState("");

  if (rows.length === 0) {
    return <></>;
  }

  return (
    <div className="mb-4 p-4 rounded bg-white">
      <TableContainer>
        <Table aria-label="Feature flags table">
          <TableHead>
            <TableRow>
              <TableCell>
                <span className="font-bold text-sm">Name</span>
              </TableCell>
              <TableCell align="right">
                <span className="font-bold text-sm">Enabled</span>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={`${row.flagName}${i}`}>
                <TableCell component="th" scope="row">
                  {row.flagName}
                </TableCell>
                <TableCell align="right">
                  <Form.Switch
                    id={`feature-flag-enable-${i}`}
                    checked={row.flagValue}
                    onChange={e =>
                      updateFeatureFlagStatus({
                        app,
                        environment,
                        setError,
                        setLoading,
                        flag: {
                          flagName: row.flagName,
                          flagValue: e.target.checked,
                        },
                      })
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  <DotDotDot>
                    <DotDotDot.Item
                      aria-label="Edit feature flag"
                      icon="fas fa-pen mr-2"
                      onClick={close => {
                        setSelectedFlag(row);
                        close();
                      }}
                    >
                      Edit
                    </DotDotDot.Item>
                    <DotDotDot.Item
                      aria-label="Delete feature flag"
                      icon="fas fa-times text-red-50 mr-2"
                      onClick={() => {
                        setFlagToBeDeleted(row.flagName);
                      }}
                    >
                      Delete
                    </DotDotDot.Item>
                  </DotDotDot>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {flagToBeDeleted !== "" && (
        <ConfirmModal
          onCancel={() => setFlagToBeDeleted("")}
          onConfirm={({ setError, setLoading }): void => {
            deleteFeatureFlag({
              app,
              environment,
              setReload,
              setError,
              setLoading,
              flagName: flagToBeDeleted,
              closeModal: () => {
                setFlagToBeDeleted("");
              },
            });
          }}
        >
          Feature flag will be deleted
        </ConfirmModal>
      )}
    </div>
  );
};

export default FeatureFlagTable;

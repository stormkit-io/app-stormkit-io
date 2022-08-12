import React, { useMemo } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import { connect } from "~/utils/context";
import Form from "~/components/Form";
import DotDotDot from "~/components/DotDotDot";
import ConfirmModal, { ConfirmModalProps } from "~/components/ConfirmModal";
import { RootContextProps } from "~/pages/Root.context";
import { updateFeatureFlagStatus, deleteFeatureFlag } from "../actions";

interface Props extends Pick<RootContextProps, "api"> {
  featureFlags: Array<FeatureFlag>;
  app: App;
  environment: Environment;
  setSelectedFlag: (val: FeatureFlag) => void;
  setLoading: SetLoading;
  setError: SetError;
  setReload: (val: number) => void;
}

const FeatureFlagTable: React.FC<Props & ConfirmModalProps> = ({
  featureFlags,
  confirmModal,
  api,
  app,
  environment,
  setLoading,
  setError,
  setReload,
  setSelectedFlag,
}): React.ReactElement => {
  const rows = useMemo<Array<FeatureFlag>>(() => featureFlags, [featureFlags]);

  if (rows.length === 0) {
    return <></>;
  }

  return (
    <div className="mb-4 p-4 rounded bg-white">
      <TableContainer>
        <Table aria-label="Snippets table">
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
                    id={`snippet-enable-${i}`}
                    checked={row.flagValue}
                    onChange={e =>
                      updateFeatureFlagStatus({
                        api,
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
                      aria-label="Edit snippet"
                      icon="fas fa-pen mr-2"
                      onClick={close => {
                        setSelectedFlag(row);
                        close();
                      }}
                    >
                      Edit
                    </DotDotDot.Item>
                    <DotDotDot.Item
                      aria-label="Delete snippet"
                      icon="fas fa-times text-red-50 mr-2"
                      onClick={() =>
                        deleteFeatureFlag({
                          api,
                          app,
                          environment,
                          setReload,
                          confirmModal,
                          flagName: row.flagName,
                        })
                      }
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
    </div>
  );
};

export default connect<Props, ConfirmModalProps>(FeatureFlagTable, [
  { Context: ConfirmModal, props: ["confirmModal"], wrap: true },
]);

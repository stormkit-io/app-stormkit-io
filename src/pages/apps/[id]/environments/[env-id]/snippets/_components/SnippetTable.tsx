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
import { enableOrDisable, deleteSnippet } from "../actions";

interface Props extends Pick<RootContextProps, "api"> {
  snippets: Snippets;
  app: App;
  environment: Environment;
  setSnippets: (val: Snippets) => void;
  setSelectedSnippet: (val: Snippet) => void;
}

const SnippetTable: React.FC<Props & ConfirmModalProps> = ({
  snippets,
  confirmModal,
  api,
  app,
  environment,
  setSnippets,
  setSelectedSnippet,
}): React.ReactElement => {
  const rows = useMemo<Array<Snippet>>(
    () => [...snippets.head, ...snippets.body],
    [snippets]
  );

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
                <span className="font-bold text-sm">Title</span>
              </TableCell>
              <TableCell align="center">
                <span className="font-bold text-sm">Location</span>
              </TableCell>
              <TableCell align="center">
                <span className="font-bold text-sm">Location type</span>
              </TableCell>
              <TableCell align="right">
                <span className="font-bold text-sm">Enabled</span>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={`${row.title}${i}`}>
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="center">{row._injectLocation}</TableCell>
                <TableCell align="center">
                  {row.prepend ? "prepend" : "append"}
                </TableCell>
                <TableCell align="right">
                  <Form.Switch
                    id={`snippet-enable-${i}`}
                    checked={row.enabled}
                    onChange={e =>
                      enableOrDisable({
                        api,
                        app,
                        environment,
                        snippets,
                        id: `snippet-enable-${i}`,
                        index: row._i,
                        isEnabled: e.target.checked,
                        confirmModal,
                        snippet: row,
                        setSnippets,
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
                        setSelectedSnippet(row);
                        close();
                      }}
                    >
                      Edit
                    </DotDotDot.Item>
                    <DotDotDot.Item
                      aria-label="Delete snippet"
                      icon="fas fa-times text-red-50 mr-2"
                      onClick={() =>
                        deleteSnippet({
                          confirmModal,
                          index: row._i,
                          snippets,
                          setSnippets,
                          api,
                          app,
                          environment,
                          injectLocation: row._injectLocation,
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

export default connect<Props, ConfirmModalProps>(SnippetTable, [
  { Context: ConfirmModal, props: ["confirmModal"], wrap: true },
]);

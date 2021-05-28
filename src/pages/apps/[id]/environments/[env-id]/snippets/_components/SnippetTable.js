import React from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import { connect } from "~/utils/context";
import Form from "~/components/Form";
import DotDotDot from "~/components/DotDotDot";
import ConfirmModal from "~/components/ConfirmModal";
import { enableOrDisable, deleteSnippet } from "../actions";

const SnippetTable = ({
  snippets,
  confirmModal,
  api,
  app,
  environment,
  setSnippets,
  setSelectedSnippet
}) => {
  const rows = [].concat(snippets.head, snippets.body);

  if (rows.length === 0) {
    return "";
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
                        setSnippets
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
                          injectLocation: row._injectLocation
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

SnippetTable.propTypes = {
  snippets: PropTypes.object,
  confirmModal: PropTypes.func,
  api: PropTypes.object,
  app: PropTypes.object,
  environment: PropTypes.object,
  setSnippets: PropTypes.func,
  setSelectedSnippet: PropTypes.func
};

export default connect(SnippetTable, [
  { Context: ConfirmModal, props: ["confirmModal"], wrap: true }
]);

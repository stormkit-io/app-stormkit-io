import React, { useMemo, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Form from "~/components/Form";
import DotDotDot from "~/components/DotDotDot";
import ConfirmModal from "~/components/ConfirmModal";
import { enableOrDisable, deleteSnippet } from "../actions";

interface Props {
  snippets: Snippets;
  app: App;
  environment: Environment;
  setSnippets: (val: Snippets) => void;
  setSelectedSnippet: (val: Snippet) => void;
}

const SnippetTable: React.FC<Props> = ({
  snippets,
  app,
  environment,
  setSnippets,
  setSelectedSnippet,
}): React.ReactElement => {
  const [deleteRow, setDeleteRow] = useState<Snippet>();
  const [toggleRow, setToggleRow] = useState<Snippet & { enabled: boolean }>();

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
                    id={`snippet-enable-${row._i}`}
                    checked={row.enabled}
                    onChange={e => {
                      setToggleRow({ ...row, enabled: e.target.checked });
                    }}
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
                      onClick={() => {
                        setDeleteRow(row);
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
      {deleteRow && (
        <ConfirmModal
          onCancel={() => {
            setDeleteRow(undefined);
          }}
          onConfirm={({ setError, setLoading }) => {
            deleteSnippet({
              index: deleteRow._i,
              snippets,
              setSnippets,
              setError,
              setLoading,
              closeModal: () => {
                setDeleteRow(undefined);
              },
              app,
              environment,
              injectLocation: deleteRow._injectLocation,
            });
          }}
        >
          This will delete the snippet and it won't be injected anymore.
        </ConfirmModal>
      )}
      {toggleRow && (
        <ConfirmModal
          onCancel={() => {
            const el = document.querySelector<HTMLButtonElement>(
              `#snippet-enable-${toggleRow._i}`
            );

            if (el) {
              el.click();
            }

            setToggleRow(undefined);
          }}
          onConfirm={({ setLoading, setError }) => {
            enableOrDisable({
              app,
              environment,
              snippets,
              index: toggleRow._i,
              isEnabled: toggleRow.enabled,
              snippet: toggleRow,
              setSnippets,
              setError,
              setLoading,
            }).then(() => {
              setToggleRow(undefined);
            });
          }}
        >
          This will {enableOrDisable} the snippet and the changes will be
          effective immediately.
        </ConfirmModal>
      )}
    </div>
  );
};

export default SnippetTable;

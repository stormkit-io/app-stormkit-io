import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TextFieldModal from "./KeyValueTextFieldModal";
import KeyValueRow from "./KeyValueRow";
import { grey } from "@mui/material/colors";

interface Props {
  inputName: string;
  keyName: string;
  valName: string;
  keyPlaceholder?: string;
  valPlaceholder?: string;
  defaultValue: Record<string, string>;
  tdClasses?: string;
  thClasses?: string;
  resetToken?: number;
  separator?: string;
  isSensitive?: boolean;
  modifyAsString?: boolean;
  onChange?: (kv: Record<string, string>) => void;
  onModalOpen?: () => void;
}

const rowsToMap = (rows: string[][]): Record<string, string> => {
  return rows
    .filter(row => !row[2])
    .reduce((obj, val) => {
      obj[val[0]] = val[1];
      return obj;
    }, {} as Record<string, string>);
};

export default function KeyValue({
  inputName,
  keyName,
  valName,
  keyPlaceholder,
  valPlaceholder,
  defaultValue,
  resetToken,
  separator = "=",
  isSensitive = false,
  modifyAsString = true,
  onChange,
  onModalOpen,
}: Props) {
  const [rows, setRows] = useState<string[][]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // We need to keep a reference to deleted rows because react lists get confused
  // when `key` might be the same. In our case, we can't provide anything for the `key` value
  // therefore it fallbacks to `index`.
  const rowsWithoutDeleted = useMemo(() => {
    return rows.filter(row => !row[2]);
  }, [rows]);

  // Sync with props
  useEffect(() => {
    const newRows: string[][] = [];

    Object.keys(defaultValue).forEach(key => {
      newRows.push([key, defaultValue[key]]);
    });

    setRows(newRows.length > 0 ? newRows : [["", ""]]);
    setIsChanged(false); // reset this value
  }, [defaultValue, resetToken]);

  // Let the parent know when rows change
  useEffect(() => {
    if (onChange && isChanged) {
      onChange(rowsToMap(rowsWithoutDeleted));
    }
  }, [rowsWithoutDeleted, isChanged]);

  const borderBottom = "1px solid";
  const borderColor = grey[300];

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ borderBottom, borderColor, color: "text.secondary" }}
            >
              {keyName}
            </TableCell>
            <TableCell
              sx={{ borderBottom, borderColor, color: "text.secondary" }}
            >
              <Box sx={{ pl: 1.75 }}>{valName}</Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(([key, value, isDeleted], index) =>
            isDeleted ? undefined : (
              <KeyValueRow
                key={index}
                rows={rows}
                inputKey={key}
                inputValue={value}
                inputName={inputName}
                index={index}
                isSensitive={isSensitive}
                hideByDefault={Boolean(value && isSensitive)}
                keyPlaceholder={keyPlaceholder}
                valPlaceholder={valPlaceholder}
                setIsChanged={setIsChanged}
                setRows={setRows}
              />
            )
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              sx={{ borderBottom: "none", textAlign: "right", pr: 0 }}
              colSpan={2}
            >
              <Button
                color="primary"
                variant="outlined"
                type="button"
                sx={{
                  display: "inline-flex",
                  textTransform: "none",
                  mr: modifyAsString ? 2 : 0,
                }}
                onClick={e => {
                  e.preventDefault();
                  setRows([...rows, ["", ""]]);
                }}
              >
                <AddIcon sx={{ mr: 1, fontSize: 16 }} />
                Add Row
              </Button>

              {modifyAsString && (
                <Button
                  color="primary"
                  type="button"
                  variant="outlined"
                  sx={{ display: "inline-flex", textTransform: "none" }}
                  onClick={() => {
                    setIsModalOpen(true);
                    onModalOpen?.();
                  }}
                >
                  <ContentCopyIcon sx={{ mr: 1, fontSize: 16 }} />
                  Modify as a string
                </Button>
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {isModalOpen && (
        <TextFieldModal
          rows={rowsWithoutDeleted}
          separator={separator}
          isSensitive={isSensitive}
          placeholder={
            keyPlaceholder && valPlaceholder
              ? `${keyPlaceholder}${separator}${valPlaceholder}`
              : ""
          }
          onClose={() => {
            setIsModalOpen(false);
          }}
          onSave={rows => {
            setRows(
              rows
                .split("\n")
                .filter(i => i)
                .map(row => {
                  const indexOfEqual = row.indexOf(separator);

                  return [
                    row.slice(0, indexOfEqual),
                    row.slice(indexOfEqual + 1),
                  ];
                })
            );

            setIsChanged(true);
          }}
        />
      )}
    </>
  );
}

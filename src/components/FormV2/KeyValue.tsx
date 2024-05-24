import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Modal from "~/components/Modal";
import Input from "./Input";

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
  onChange?: (kv: Record<string, string>) => void;
  onModalOpen?: () => void;
}

interface TextFieldModalProps {
  rows: string[][];
  placeholder?: string;
  transformer?: (kv: string[][]) => string;
  onSave: (value: string) => void;
  onClose: () => void;
}

const transformerFn = (kv: string[][]): string => {
  return kv.map(k => (k[0] && k[1] ? `${k[0]}=${k[1]}` : "")).join("\n");
};

function TextFieldModal({
  rows,
  onClose,
  onSave,
  placeholder,
  transformer = transformerFn,
}: TextFieldModalProps) {
  const value = useMemo(() => {
    return transformer(rows);
  }, [rows]);

  return (
    <Modal open onClose={onClose}>
      <Box>
        <Box sx={{ p: 2 }}>
          <TextField
            id="key-value-text-area"
            variant="filled"
            multiline
            maxRows={20}
            defaultValue={value}
            placeholder={placeholder}
            fullWidth
            minRows={20}
          />
        </Box>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Button
            type="button"
            color="secondary"
            variant="contained"
            onClick={() => {
              const input = document.querySelector(
                "#key-value-text-area"
              ) as HTMLTextAreaElement;

              onSave(input?.value);
              onClose();
            }}
          >
            Set rows
          </Button>
        </Box>
      </Box>
    </Modal>
  );
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

  const borderBottom = "1px solid rgba(255,255,255,0.1)";

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderBottom }}>{keyName}</TableCell>
            <TableCell sx={{ borderBottom }}>
              <Box sx={{ pl: 1.75 }}>{valName}</Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(([key, value, isDeleted], index) =>
            isDeleted ? undefined : (
              <TableRow key={index}>
                <TableCell sx={{ borderBottom: "none", pl: 0, pb: 0 }}>
                  <Input
                    fullWidth
                    placeholder={
                      index === 0 ? keyPlaceholder : `KEY_${index + 1}`
                    }
                    inputProps={{
                      "aria-label": `${inputName} key number ${index + 1}`,
                    }}
                    name={`${inputName}[key]`}
                    onChange={e => {
                      const copy = JSON.parse(JSON.stringify(rows));
                      copy[index] = [e.target.value, copy[index][1]];
                      setRows(copy);
                      setIsChanged(true);
                    }}
                    value={key}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: "none", pr: 0, pb: 0 }}>
                  <Input
                    fullWidth
                    value={value}
                    placeholder={
                      index === 0 ? valPlaceholder : `VALUE_${index + 1}`
                    }
                    name={`${inputName}[value]`}
                    inputProps={{
                      "aria-label": `${inputName} value number ${index + 1}`,
                    }}
                    onChange={e => {
                      const copy = JSON.parse(JSON.stringify(rows));
                      copy[index] = [copy[index][0], e.target.value];
                      setRows(copy);
                      setIsChanged(true);
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          sx={{ width: 24, height: 24 }}
                          type="button"
                          aria-label={`Remove ${inputName} row number ${
                            index + 1
                          }`}
                          onClick={() => {
                            const copy = JSON.parse(JSON.stringify(rows));
                            copy[index].push("deleted");
                            setRows(copy);
                            setIsChanged(true);
                          }}
                        >
                          <span className="fas fa-times text-xs text-gray-80"></span>
                        </IconButton>
                      ),
                    }}
                  />
                </TableCell>
              </TableRow>
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
                  color: "white",
                  textTransform: "none",
                  mr: 2,
                }}
                onClick={e => {
                  e.preventDefault();
                  setRows([...rows, ["", ""]]);
                }}
              >
                <AddIcon sx={{ mr: 1, fontSize: 16 }} />
                Add Row
              </Button>

              <Button
                color="primary"
                type="button"
                variant="outlined"
                sx={{
                  display: "inline-flex",
                  color: "white",
                  textTransform: "none",
                }}
                onClick={() => {
                  setIsModalOpen(true);
                  onModalOpen?.();
                }}
              >
                <ContentCopyIcon sx={{ mr: 1, fontSize: 16 }} />
                Modify as a string
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {isModalOpen && (
        <TextFieldModal
          rows={rowsWithoutDeleted}
          placeholder={
            keyPlaceholder && valPlaceholder
              ? `${keyPlaceholder}=${valPlaceholder}`
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
                  const indexOfEqual = row.indexOf("=");

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

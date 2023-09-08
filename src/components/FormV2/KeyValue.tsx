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
import Modal from "~/components/ModalV2";
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

function TextFieldModal({
  rows,
  onClose,
  onSave,
  placeholder,
  transformer = kv =>
    kv.map(k => (k[0] && k[1] ? `${k[0]}=${k[1]}` : "")).join("\n"),
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
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const newRows: string[][] = [];

    Object.keys(defaultValue).forEach(key => {
      newRows.push([key, defaultValue[key]]);
    });

    setRows(newRows.length > 0 ? newRows : [["", ""]]);
  }, [defaultValue, resetToken]);

  useEffect(() => {
    if (onChange) {
      onChange(
        rows.reduce((obj, val) => {
          obj[val[0]] = val[1];
          return obj;
        }, {} as Record<string, string>)
      );
    }
  }, [rows]);

  const addRowsHandler = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setRows([...rows, [`KEY_${rows.length + 1}`, `VALUE_${rows.length + 1}`]]);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              {keyName}
            </TableCell>
            <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <Box sx={{ pl: 1.75 }}>{valName}</Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(([key, value], index) => (
            <TableRow key={`${key}_${index}`}>
              <TableCell sx={{ borderBottom: "none", pl: 0, pb: 0 }}>
                <Input
                  fullWidth
                  placeholder={keyPlaceholder}
                  inputProps={{
                    "aria-label": `${inputName} key number ${index + 1}`,
                  }}
                  name={`${inputName}[key]`}
                  defaultValue={key}
                />
              </TableCell>
              <TableCell sx={{ borderBottom: "none", pr: 0, pb: 0 }}>
                <Input
                  fullWidth
                  defaultValue={value}
                  placeholder={valPlaceholder}
                  name={`${inputName}[value]`}
                  aria-label=""
                  inputProps={{
                    "aria-label": `${inputName} value number ${index + 1}`,
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
                          const copy = [...rows];
                          copy.splice(index, 1);

                          setRows(copy.length ? copy : [["", ""]]);
                        }}
                      >
                        <span className="fas fa-times text-xs text-gray-80"></span>
                      </IconButton>
                    ),
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              sx={{ borderBottom: "none", textAlign: "right", pr: 0 }}
              colSpan={2}
            >
              <Button
                color="primary"
                variant="contained"
                type="button"
                sx={{
                  display: "inline-flex",
                  color: "white",
                  textTransform: "none",
                  mr: 2,
                }}
                onClick={addRowsHandler}
              >
                <AddIcon sx={{ mr: 1, fontSize: 16 }} />
                Add Row
              </Button>

              <Button
                type="button"
                color="primary"
                variant="contained"
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
          rows={rows}
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
                .map(r => r.split("=").map(i => i.trim()))
            );
          }}
        />
      )}
    </>
  );
}

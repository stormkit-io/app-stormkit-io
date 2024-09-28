import { useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import Input from "./Input";

interface KeyValueRowProps {
  index: number;
  inputKey: string;
  inputValue: string;
  inputName: string;
  keyPlaceholder?: string;
  valPlaceholder?: string;
  hideByDefault: boolean;
  isSensitive?: boolean;
  rows: string[][];
  setRows: (r: string[][]) => void;
  setIsChanged: (v: boolean) => void;
}

const fontSize = 14;

export default function KeyValueRow({
  index,
  rows,
  inputKey: key,
  inputValue: value,
  inputName,
  isSensitive,
  keyPlaceholder,
  valPlaceholder,
  hideByDefault,
  setRows,
  setIsChanged,
}: KeyValueRowProps) {
  const [isValueVisible, setIsValueVisible] = useState(!hideByDefault);

  return (
    <TableRow sx={{ "div[data-lastpass-icon-root]": { display: "none" } }}>
      <TableCell sx={{ borderBottom: "none", pl: 0, pb: 0 }}>
        <Input
          fullWidth
          placeholder={index === 0 ? keyPlaceholder : `KEY_${index + 1}`}
          inputProps={{
            "data-1p-ignore": "true",
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
          autoComplete="off"
          type={isValueVisible ? "text" : "password"}
          placeholder={index === 0 ? valPlaceholder : `VALUE_${index + 1}`}
          name={`${inputName}[value]`}
          inputProps={{
            "data-1p-ignore": "true",
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
              <>
                {isSensitive && (
                  <IconButton
                    sx={{ width: 24, height: 24 }}
                    type="button"
                    aria-label={`Toggle ${inputName} visibility ${index + 1}`}
                    onClick={() => {
                      setIsValueVisible(!isValueVisible);
                    }}
                  >
                    {isValueVisible ? (
                      <VisibilityOffIcon sx={{ fontSize }} />
                    ) : (
                      <VisibilityIcon sx={{ fontSize }} />
                    )}
                  </IconButton>
                )}
                <IconButton
                  sx={{ width: 24, height: 24 }}
                  type="button"
                  aria-label={`Remove ${inputName} row number ${index + 1}`}
                  onClick={() => {
                    const copy = JSON.parse(JSON.stringify(rows));
                    copy[index].push("deleted");
                    setRows(copy);
                    setIsChanged(true);
                  }}
                >
                  <CloseIcon sx={{ fontSize }} />
                </IconButton>
              </>
            ),
          }}
        />
      </TableCell>
    </TableRow>
  );
}

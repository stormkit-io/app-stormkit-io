import React, { useEffect, useState } from "react";
import cn from "classnames";
import * as mui from "@mui/material";
import Input from "./Input";
import Button from "../ButtonV2";

const { Table, TableBody, TableCell, TableHead, TableRow } = mui;

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
  onChange?: () => void;
}

const KeyValue: React.FC<Props> = ({
  inputName,
  keyName,
  valName,
  keyPlaceholder,
  valPlaceholder,
  defaultValue,
  resetToken,
  tdClasses = "border-blue-30 text-gray-80 py-2",
  thClasses = "border-blue-30 font-bold text-white bg-blue-20",
  onChange,
}) => {
  const [rows, setRows] = useState<string[][]>([]);

  useEffect(() => {
    const newRows: string[][] = [];

    Object.keys(defaultValue).forEach(key => {
      newRows.push([key, defaultValue[key]]);
    });

    setRows(newRows.length > 0 ? newRows : [["", ""]]);
  }, [defaultValue, resetToken]);

  const addRowsHandler = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setRows([...rows, [`KEY_${rows.length + 1}`, `VALUE_${rows.length + 1}`]]);
    onChange?.();
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={thClasses}>{keyName}</TableCell>
          <TableCell className={thClasses}>
            <div className="flex justify-between items-center">
              {valName}
              <div className="flex justify-end items-center">
                <Button
                  styled={false}
                  type="button"
                  className="cursor-pointer text-xs font-thin flex items-center bg-blue-30 py-1 px-3"
                  onClick={addRowsHandler}
                >
                  <span className="fa fa-plus mr-2" />
                  add row
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(([key, value], index) => (
          <TableRow key={`${key}_${index}`}>
            <TableCell className={cn(tdClasses, "pl-0 pr-1 w-1/2")}>
              <Input
                className="bg-blue-10 no-border"
                fullWidth
                placeholder={keyPlaceholder}
                inputProps={{
                  "aria-label": `${inputName} key number ${index + 1}`,
                }}
                name={`${inputName}[key]`}
                defaultValue={key}
                onChange={onChange}
              />
            </TableCell>
            <TableCell className={cn(tdClasses, "pl-0 pr-0")}>
              <Input
                className="bg-blue-10 no-border mr-0"
                fullWidth
                defaultValue={value}
                placeholder={valPlaceholder}
                name={`${inputName}[value]`}
                onChange={onChange}
                aria-label=""
                inputProps={{
                  "aria-label": `${inputName} value number ${index + 1}`,
                }}
                InputProps={{
                  endAdornment: (
                    <Button
                      styled={false}
                      type="button"
                      aria-label={`Remove ${inputName} row number ${index + 1}`}
                      className="py-1 px-2 flex justify-center items-center bg-blue-30 hover:bg-blue-20 mr-1 rounded-sm"
                      onClick={() => {
                        const copy = [...rows];
                        copy.splice(index, 1);

                        setRows(copy.length ? copy : [["", ""]]);
                        onChange?.();
                      }}
                    >
                      <span className="fas fa-times text-xs text-gray-80"></span>
                    </Button>
                  ),
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default KeyValue;

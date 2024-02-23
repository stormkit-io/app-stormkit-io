import type { SelectProps } from "@mui/material/Select";
import React, { useEffect, useState } from "react";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";

interface MenuItem {
  value: string;
  text: string;
}

interface Props extends Omit<SelectProps, "onSelect"> {
  items: MenuItem[];
  selected?: string[];
  label?: string;
  helperText?: React.ReactNode;
  onSelect: (v: string[]) => void;
}

export default function MultiSelect({
  items,
  helperText,
  selected,
  variant = "filled",
  size,
  label,
  placeholder,
  multiple = true,
  fullWidth = true,
  onSelect,
}: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>(selected || []);

  useEffect(() => {
    if (selected) {
      setSelectedItems(selected);
    }
  }, [selected]);

  return (
    <FormControl variant="standard" fullWidth={fullWidth}>
      {label && (
        <InputLabel id="multiple-checkbox-label" sx={{ pl: 2, pt: 1 }} shrink>
          {label}
        </InputLabel>
      )}
      <Select
        labelId="multiple-checkbox-label"
        multiple={multiple}
        variant={variant}
        size={size}
        value={selectedItems?.length ? selectedItems : [""]}
        input={variant === "filled" ? <FilledInput /> : <OutlinedInput />}
        onClose={() => {
          // Rely on `onClose` only when `multiple` property is true.
          if (multiple) {
            onSelect(selectedItems.filter(i => i));
          }
        }}
        onChange={e => {
          let values = [
            ...new Set(
              typeof e.target.value === "string"
                ? e.target.value.split(",")
                : e.target.value
            ),
          ];

          const lastClicked = values.at(-1);

          if (typeof lastClicked === "undefined") {
            values = [];
          }

          setSelectedItems(values);

          // If not multiple, trigger the select here.
          if (!multiple) {
            onSelect(values.filter(i => i));
          }
        }}
        renderValue={selected => {
          return selected.filter(s => s !== "").join(", ") || placeholder;
        }}
      >
        {multiple ? (
          <MenuItem>
            <Checkbox checked={!selectedItems.filter(i => i).length} />
            <ListItemText primary={placeholder} />
          </MenuItem>
        ) : (
          // Fixes an issue with MUI Warning
          <MenuItem value={""} sx={{ display: "none" }} />
        )}
        {items.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {multiple && (
              <Checkbox checked={selectedItems.includes(item.value)} />
            )}
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

import type { SelectProps } from "@mui/material/Select";
import React, { useState } from "react";
import FilledInput from "@mui/material/FilledInput";
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
  selected: string[];
  onSelect: (v: string[]) => void;
  helperText?: React.ReactNode;
  label?: string;
}

export default function MultiSelect({
  items,
  helperText,
  selected = [],
  label,
  onSelect,
}: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>(selected);

  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel id="multiple-checkbox-label" sx={{ pl: 2, pt: 1 }} shrink>
        {label}
      </InputLabel>
      <Select
        labelId="multiple-checkbox-label"
        multiple
        variant="filled"
        value={selectedItems.length > 0 ? selectedItems : [""]}
        input={<FilledInput />}
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
          onSelect(values.filter(i => i));
        }}
        renderValue={selected => {
          return selected.filter(s => s !== "").join(", ") || "All hosts";
        }}
      >
        <MenuItem>
          <Checkbox checked={!selectedItems.filter(i => i).length} />
          <ListItemText primary={"All hosts"} />
        </MenuItem>
        {items.map(item => (
          <MenuItem key={item.value} value={item.value}>
            <Checkbox checked={selectedItems.includes(item.value)} />
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

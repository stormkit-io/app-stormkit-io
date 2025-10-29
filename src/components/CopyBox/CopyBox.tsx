import type { TextFieldProps } from "@mui/material/TextField";
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

let id = 0;

export default function CopyBox({ value, slotProps, ...rest }: TextFieldProps) {
  const [clicked, setClicked] = useState(false);
  const inputId = `copy-token-${id++}`;

  return (
    <TextField
      id={inputId}
      value={value}
      fullWidth
      aria-label="Copy content"
      {...rest}
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          endAdornment: (
            <Tooltip open={clicked} title="Copied to clipboard" arrow>
              <IconButton
                type="button"
                onClick={() => {
                  (
                    document.querySelector(`#${inputId}`) as HTMLInputElement
                  ).focus();
                  (
                    document.querySelector(`#${inputId}`) as HTMLInputElement
                  ).select();
                  document.execCommand("copy");
                  setClicked(true);
                  setTimeout(() => {
                    setClicked(false);
                  }, 2000);
                }}
              >
                {clicked ? (
                  <CheckIcon sx={{ fontSize: 18 }} />
                ) : (
                  <ContentCopyIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </Tooltip>
          ),
        },
      }}
    />
  );
}

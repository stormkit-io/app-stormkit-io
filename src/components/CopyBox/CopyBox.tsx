import type { TextFieldProps } from "@mui/material/TextField";
import { useState } from "react";
import { Tooltip } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "~/components/Button";

let id = 0;

export default function CopyBox({ value, ...rest }: TextFieldProps) {
  const [clicked, setClicked] = useState(false);
  const inputId = `copy-token-${id++}`;

  return (
    <TextField
      id={inputId}
      value={value}
      fullWidth
      aria-label="Copy content"
      {...rest}
      InputProps={{
        endAdornment: (
          <Tooltip open={clicked} title="Copied to clipboard">
            <span>
              <Button
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
                <span className="far fa-copy text-white" />
              </Button>
            </span>
          </Tooltip>
        ),
      }}
    />
  );
}

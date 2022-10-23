import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import Form from "~/components/FormV2";
import Button from "~/components/Button";

type Props = {
  value: string;
};

let id = 0;

const CopyBox: React.FC<Props> = ({ value }: Props): React.ReactElement => {
  const [clicked, setClicked] = useState(false);
  const inputId = `copy-token-${id++}`;

  return (
    <Form.Input
      id={inputId}
      value={value}
      className="flex-auto"
      aria-label="Copy content"
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
};

export default CopyBox;

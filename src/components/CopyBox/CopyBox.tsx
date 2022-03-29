import React, { FC, ReactElement } from "react";
import Form from "~/components/Form";
import Button from "~/components/Button";

type Props = {
  value: string;
};

let id = 0;

const CopyBox: FC<Props> = ({ value }: Props): ReactElement => {
  const inputId = `copy-token-${id++}`;

  return (
    <>
      <Form.Input
        multiline
        id={inputId}
        value={value}
        className="flex-auto"
        inputProps={{
          "aria-label": "Copy token",
        }}
      />
      <Button
        type="button"
        onClick={() => {
          (document.querySelector(`#${inputId}`) as HTMLInputElement).focus();
          (document.querySelector(`#${inputId}`) as HTMLInputElement).select();
          document.execCommand("copy");
        }}
      >
        <span className="far fa-copy" />
      </Button>
    </>
  );
};

export default CopyBox;

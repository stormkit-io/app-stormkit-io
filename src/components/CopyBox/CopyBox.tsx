import React, { FC, ReactElement } from "react";
import Form from "~/components/Form";
import Button from "~/components/Button";

type Props = {
  value: string;
};

const CopyBox: FC<Props> = ({ value }: Props): ReactElement => (
  <>
    <Form.Input
      multiline
      id="copy-token"
      defaultValue={value}
      className="flex-auto"
      inputProps={{
        "aria-label": "Copy token"
      }}
    />
    <Button
      type="button"
      onClick={() => {
        (document.querySelector("#copy-token") as HTMLInputElement).focus();
        (document.querySelector("#copy-token") as HTMLInputElement).select();
        document.execCommand("copy");
      }}
    >
      <span className="far fa-copy" />
    </Button>
  </>
);

export default CopyBox;

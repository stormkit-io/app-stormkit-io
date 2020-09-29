import React from "react";
import PropTypes from "prop-types";
import Form from "~/components/Form";
import Button from "~/components/Button";

const CopyBox = ({ value }) => {
  return (
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
          document.querySelector("#copy-token").focus();
          document.querySelector("#copy-token").select();
          document.execCommand("copy");
        }}
      >
        <span className="far fa-copy" />
      </Button>
    </>
  );
};

CopyBox.propTypes = {
  value: PropTypes.string
};

export default CopyBox;

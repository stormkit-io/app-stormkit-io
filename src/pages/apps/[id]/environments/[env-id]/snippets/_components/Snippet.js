import React from "react";
import PropTypes from "prop-types";
import Form from "~/components/Form";

const Snippet = ({ snippet }) => {
  return (
    <div className="mb-4 bg-white rounded p-8">
      <Form.Switch
        checked={snippet.enabled}
        onChange={(e) => e.target.checked}
      />
      {snippet.title}
    </div>
  );
};

Snippet.propTypes = {
  snippet: PropTypes.object,
};

export default Snippet;

import React from "react";
import Form from "~/components/Form";

interface Props {
  snippet: Snippet;
}

const Snippet: React.FC<Props> = ({ snippet }): React.ReactElement => {
  return (
    <div className="mb-4 bg-white rounded p-8">
      <Form.Switch checked={snippet.enabled} onChange={e => e.target.checked} />
      {snippet.title}
    </div>
  );
};

export default Snippet;

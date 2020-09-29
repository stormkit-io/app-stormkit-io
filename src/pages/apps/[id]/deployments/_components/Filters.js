import React from "react";
import Form from "~/components/Form";

// TODO: Implement this part
const Filters = () => {
  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Form handleSubmit={handleSubmit}>
      <Form.Checkbox
        name="published"
        value
        checked={false}
        label="Only published"
      />
    </Form>
  );
};

export default Filters;

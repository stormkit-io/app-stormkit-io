import React, { useState } from "react";
import PropTypes from "prop-types";
import Form from "~/components/Form";

const EnvironmentSelector = ({
  environments,
  defaultValue = "",
  onSelect,
  placeholder,
  ...rest
}) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState(defaultValue);

  return (
    <div {...rest}>
      <Form.Select
        name="envId"
        displayEmpty
        value={selectedEnvironment}
        onChange={id => {
          setSelectedEnvironment(id);

          if (typeof onSelect === "function") {
            onSelect(environments.filter(e => e.id === id)[0]);
          }
        }}
      >
        <Form.Option disabled value="">
          {placeholder}
        </Form.Option>
        {environments.map(env => (
          <Form.Option value={env.id} key={env.id}>
            <span>
              <span>{env.name || env.env}</span>{" "}
              <span className="text-xs opacity-75">
                ({env.getDomainName()})
              </span>
            </span>
          </Form.Option>
        ))}
      </Form.Select>
    </div>
  );
};

EnvironmentSelector.defaultProps = {
  placeholder: "Select an environment"
};

EnvironmentSelector.propTypes = {
  environments: PropTypes.array,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func,
  defaultValue: PropTypes.string
};

export default EnvironmentSelector;

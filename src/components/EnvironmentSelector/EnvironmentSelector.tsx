import React, { useState } from "react";
import Form from "~/components/Form";

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  environments: Array<Environment>;
  placeholder: string;
  onSelect: (arg0: Environment) => void;
  defaultValue?: string;
}

const EnvironmentSelector: React.FC<Props> = ({
  environments,
  defaultValue = "",
  onSelect,
  placeholder,
  ...rest
}): React.ReactElement => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>(
    defaultValue
  );

  return (
    <div {...rest}>
      <Form.Select
        name="envId"
        displayEmpty
        value={selectedEnvironment}
        onChange={e => {
          const id = e.target.value as string;
          setSelectedEnvironment(id);

          if (typeof onSelect === "function") {
            onSelect(environments.filter(e => e.id === id)[0]);
          }
        }}
      >
        <Form.Option disabled value="">
          <span className="fas fa-th-large mr-2 text-gray-60" />
          {placeholder}
        </Form.Option>
        {environments.map(env => (
          <Form.Option value={env.id || ""} key={env.id}>
            <span>
              <span>{env.name || env.env}</span>{" "}
              <span className="text-xs opacity-75">
                ({env.getDomainName && env.getDomainName()})
              </span>
            </span>
          </Form.Option>
        ))}
      </Form.Select>
    </div>
  );
};

EnvironmentSelector.defaultProps = {
  placeholder: "Select an environment",
  defaultValue: ""
} as Partial<Props>;

export default EnvironmentSelector;

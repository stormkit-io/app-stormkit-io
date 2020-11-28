import React, { FC, ReactElement, useState } from "react";
import Form from "~/components/Form";

type Props = {
  environments: any[];
  placeholder: string;
  onSelect: (arg0: number) => void;
  defaultValue: string;
};

const EnvironmentSelector: FC<Props> = ({
  environments,
  defaultValue,
  onSelect,
  placeholder,
  ...rest
}): ReactElement => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>(defaultValue);

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
  placeholder: "Select an environment",
  defaultValue: ""
} as Partial<Props>;

export default EnvironmentSelector;

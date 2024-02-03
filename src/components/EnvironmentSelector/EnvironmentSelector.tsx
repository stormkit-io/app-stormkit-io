import React from "react";
import cn from "classnames";
import Form from "~/components/FormV2";

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  environments: Array<Environment>;
  placeholder: string;
  onSelect: (arg0: Environment) => void;
  defaultValue?: string;
  className?: string;
}

const EnvironmentSelector: React.FC<Props> = ({
  environments,
  defaultValue = "",
  onSelect,
  placeholder,
  className,
  ...rest
}): React.ReactElement => {
  return (
    <div {...rest} className={cn("bg-blue-10 w-full h-full", className)}>
      <Form.Select
        name="envId"
        displayEmpty
        defaultValue={defaultValue}
        onChange={e => {
          const id = e.target.value as string;
          onSelect(environments.filter(e => e.id === id)[0]);
        }}
      >
        <Form.Option disabled value="">
          <span className="fas fa-th-large mr-2 text-gray-60" />
          {placeholder}
        </Form.Option>
        {environments.map(env => (
          <Form.Option value={env.id!} key={env.id}>
            <span>
              <span>{env.name || env.env}</span>{" "}
              <span className="text-xs opacity-75">{env.preview}</span>
            </span>
          </Form.Option>
        ))}
      </Form.Select>
    </div>
  );
};

EnvironmentSelector.defaultProps = {
  placeholder: "Select an environment",
  defaultValue: "",
} as Partial<Props>;

export default EnvironmentSelector;

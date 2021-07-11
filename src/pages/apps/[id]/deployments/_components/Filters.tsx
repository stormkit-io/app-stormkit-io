import React, { useState, useEffect } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import { booleanToString, parseBoolean } from "~/utils/helpers/string";
import Form from "~/components/Form";
import EnvironmentSelector from "~/components/EnvironmentSelector";
import { Filters as IFilters } from "../actions";

interface Props {
  onFilterChange: (filters: IFilters) => void;
  environments: Array<Environment>;
  filters: IFilters;
}

const Filters: React.FC<Props> = ({
  onFilterChange,
  environments,
  filters: existingFilters,
}): React.ReactElement => {
  const [branchTempValue, setBranchTempValue] = useState("");
  const [filters, setFilters] = useState<IFilters>(existingFilters);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  return (
    <Form<IFilters> className="bg-white p-4 mb-8 rounded flex">
      <div className="flex-auto max-w-1/4 mr-2">
        <EnvironmentSelector
          environments={environments}
          placeholder="Environment"
          defaultValue={""}
          onSelect={(e: Environment) => setFilters({ ...filters, envId: e.id })}
        />
      </div>

      <div className="flex-auto max-w-1/4 mr-2">
        <Form.Select
          name="published"
          displayEmpty
          value={booleanToString(filters.published)}
          onChange={e =>
            setFilters({
              ...filters,
              published: parseBoolean(e.target.value as string),
            })
          }
        >
          <Form.Option disabled value={""}>
            Publish Status
          </Form.Option>
          <Form.Option value={"true"}>Published</Form.Option>
          <Form.Option value={"false"}>Not Published</Form.Option>
        </Form.Select>
      </div>

      <div className="flex-auto max-w-1/4 mr-2">
        <Form.Select
          name="status"
          displayEmpty
          value={booleanToString(filters.status)}
          onChange={e =>
            setFilters({
              ...filters,
              status: parseBoolean(e.target.value as string),
            })
          }
        >
          <Form.Option disabled value={""}>
            Exit Status
          </Form.Option>
          <Form.Option value={"true"}>Success</Form.Option>
          <Form.Option value={"false"}>Failed</Form.Option>
        </Form.Select>
      </div>

      <div className="flex-auto">
        <Form.Input
          fullWidth
          value={branchTempValue}
          placeholder={"Branch"}
          onKeyUp={e => {
            if (e.key === "Enter") {
              setFilters({ ...filters, branch: branchTempValue });
            }
          }}
          onChange={e => {
            setBranchTempValue(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span className="fas fa-search" />
              </InputAdornment>
            ),
          }}
        />
      </div>
    </Form>
  );
};

export default Filters;

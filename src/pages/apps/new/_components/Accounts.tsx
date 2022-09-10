import type { Account } from "../types.d";
import type { SelectChangeEvent } from "@mui/material";
import React from "react";
import Form from "~/components/FormV2";
import Spinner from "~/components/Spinner";

interface Props {
  onAccountChange: (login: string) => void;
  accounts: Account[];
  selected?: string;
  loading?: boolean;
}

const Accounts: React.FC<Props> = ({
  onAccountChange,
  accounts,
  selected,
  loading,
}) => {
  return (
    <Form.Select
      name="accounts"
      className="min-w-64"
      multiple={false}
      value={selected || ""}
      onChange={(e: SelectChangeEvent<unknown>) => {
        onAccountChange(e.target.value as string);
      }}
    >
      {loading && (
        <Form.Option value={""}>
          <Spinner width={5} height={5} />
        </Form.Option>
      )}
      {!loading &&
        accounts?.map(account => (
          <Form.Option key={account.id} value={account.id}>
            <span className="flex items-center">
              <img
                src={account.avatar}
                alt={account.login}
                className="w-5 mr-3 rounded-full"
                style={{ display: "inline" }}
              />
              {account.login}
            </span>
          </Form.Option>
        ))}
    </Form.Select>
  );
};

export default Accounts;

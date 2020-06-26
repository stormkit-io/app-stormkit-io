import React from "react";
import Form from "~/components/Form";

const Accounts = ({ onAccountChange, accounts, selected }) => {
  return (
    <Form.Select
      name="accounts"
      multiple={false}
      onChange={onAccountChange}
      value={selected}
    >
      {accounts &&
        accounts.map((account) => (
          <Form.Option key={account.login} value={account.login}>
            <img
              src={account.avatar}
              alt={account.login}
              className="w-8 h-8 mr-4 rounded-full"
            />{" "}
            {account.login}
          </Form.Option>
        ))}
    </Form.Select>
  );
};

export default Accounts;

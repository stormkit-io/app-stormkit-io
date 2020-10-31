import React, { ReactElement } from "react";
import { connect } from "~/utils/context";
import Api from "~/utils/api/Api";
import { User } from "~/types/user";
import AuthContext from "~/pages/auth/Auth.context";
import RootContext from "~/pages/Root.context";
import SubscriptionDetails from "./_components/SubscriptionDetails";
import PaymentDetails from "./_components/PaymentDetails";

type Props = {
  api: Api;
  user: User;
};

const Account = ({ api, user }: Props): ReactElement => {
  return (
    <div>
      <h1 className="mb-4 text-2xl text-white">Account settings</h1>
      <div className="rounded bg-white p-8 mb-8">
        <h1 className="flex items-center">
          <span className="rounded-full inline-flex w-12 h-12 items-center justify-center overflow-hidden mr-4">
            <img src={user.avatar} alt="User Profile" />
          </span>
          <span>
            {`${user.fullName}`.trim() || user.displayName}
            <br />
            {user.email}
          </span>
        </h1>
      </div>
      <SubscriptionDetails api={api} user={user} />
      <PaymentDetails api={api} />
    </div>
  );
};

export default connect(Account, [
  { Context: RootContext, props: ["api"] },
  { Context: AuthContext, props: ["user"] },
]);

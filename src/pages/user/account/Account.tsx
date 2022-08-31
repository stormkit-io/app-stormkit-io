import React, { ReactElement, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "~/pages/auth/Auth.context";
import SubscriptionDetails from "./_components/SubscriptionDetails";
import PaymentDetails from "./_components/PaymentDetails";
import UserProfile from "./_components/UserProfile";

const Account = (): ReactElement => {
  const history = useHistory();
  const location = useLocation();
  const { user, accounts } = useContext(AuthContext);

  return (
    <div>
      <UserProfile user={user!} accounts={accounts!} />
      <SubscriptionDetails history={history} location={location} />
      <PaymentDetails history={history} location={location} />
    </div>
  );
};

export default Account;

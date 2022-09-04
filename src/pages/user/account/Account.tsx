import React, { useContext } from "react";
import { AuthContext } from "~/pages/auth/Auth.context";
import SubscriptionDetails from "./_components/SubscriptionDetails";
import PaymentDetails from "./_components/PaymentDetails";
import UserProfile from "./_components/UserProfile";

const Account: React.FC = () => {
  const { user, accounts } = useContext(AuthContext);

  return (
    <div className="w-full">
      <UserProfile user={user!} accounts={accounts!} />
      <SubscriptionDetails />
      <PaymentDetails />
    </div>
  );
};

export default Account;

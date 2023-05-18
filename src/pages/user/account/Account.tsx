import React, { useContext } from "react";
import { AuthContext } from "~/pages/auth/Auth.context";
import SubscriptionDetails from "./_components/SubscriptionDetails";
import UserProfile from "./_components/UserProfile";

const Account: React.FC = () => {
  const { user, accounts } = useContext(AuthContext);

  return (
    <div className="w-full">
      <UserProfile user={user!} accounts={accounts!} />
      <SubscriptionDetails />
    </div>
  );
};

export default Account;

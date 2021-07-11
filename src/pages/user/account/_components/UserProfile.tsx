import React, { useMemo } from "react";
import ConnectedAccounts from "./ConnectedAccounts";

interface Props {
  user: User;
  accounts: Array<ConnectedAccount>;
}

const UserProfile: React.FC<Props> = ({
  user,
  accounts,
}): React.ReactElement => {
  const memberSince = useMemo(() => {
    return new Date(user.memberSince * 1000).toLocaleDateString("en", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  }, [user.memberSince]);

  return (
    <>
      <h1 className="mb-4 text-2xl text-white">Account settings</h1>
      <div className="rounded bg-white p-8 mb-8">
        <h2 className="mb-4 font-bold text-lg">Details</h2>
        <div className="flex items-center mb-8">
          <span className="rounded-full inline-flex w-12 h-12 items-center justify-center overflow-hidden mr-4">
            <img src={user.avatar} alt="User Profile" />
          </span>
          <span>
            {`${user.fullName}`.trim() || user.displayName}
            <br />
            {user.email}
          </span>
          <span className="flex-auto inline-flex ml-4 pl-4 border-gray-300 border-l">
            Member since
            <br />
            {memberSince}
          </span>
        </div>
        <ConnectedAccounts accounts={accounts} />
      </div>
    </>
  );
};

export default UserProfile;

import React, { useMemo } from "react";
import Container from "~/components/Container";
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
    <Container title="Account settings" className="mt-4">
      <div className="mb-4">
        <div className="flex flex-col items-center max-w-screen-md m-auto">
          <div className="flex-auto text-center">
            <div className="rounded-full inline-flex w-24 h-24 items-center justify-center overflow-hidden mb-4">
              <img src={user.avatar} alt="User Profile" />
            </div>
            <div className="text-sm">
              {user.fullName.trim() || user.displayName}
              <br />
              {user.email}
              <br />
              <span className="text-xs text-secondary">
                Member since {memberSince}
              </span>
            </div>
          </div>
          <ConnectedAccounts accounts={accounts} />
        </div>
      </div>
    </Container>
  );
};

export default UserProfile;

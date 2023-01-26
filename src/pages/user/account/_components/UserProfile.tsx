import React, { useContext, useMemo, useState } from "react";
import Container from "~/components/Container";
import ConnectedAccounts from "./ConnectedAccounts";
import Button from "~/components/ButtonV2";
import { deleteUser } from "../actions";
import ConfirmModal from "~/components/ConfirmModal";
import { AuthContext } from "~/pages/auth/Auth.context";

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

  const { logout } = useContext(AuthContext);
  const [deleteAccountConfirmModal, toggleDeleteAccountConfirmModal] =
    useState(false);

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
          <div className="flex justify-end mt-4">
            <Button
              category="action"
              type="submit"
              onClick={e => {
                e.preventDefault();
                toggleDeleteAccountConfirmModal(true);
              }}
            >
              Delete Account
            </Button>
          </div>
          {deleteAccountConfirmModal && (
            <ConfirmModal
              typeConfirmationText="Permanently delete account"
              onCancel={() => {
                toggleDeleteAccountConfirmModal(false);
              }}
              onConfirm={({ setLoading, setError }) => {
                setLoading(true);

                deleteUser()
                  .then(() => {
                    if (logout) logout();
                  })
                  .catch(() => {
                    setLoading(false);
                    setError(
                      "Something went wrong while deleting your account please contact us via email or discord."
                    );
                  });
              }}
            >
              This will completely remove the application. All associated files
              and endpoints will be gone. Remember there is no going back from
              here.
            </ConfirmModal>
          )}
          <ConnectedAccounts accounts={accounts} />
        </div>
      </div>
    </Container>
  );
};

export default UserProfile;

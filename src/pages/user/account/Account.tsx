import React, { ReactElement } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { connect } from "~/utils/context";
import AuthContext, { AuthContextProps } from "~/pages/auth/Auth.context";
import RootContext, { RootContextProps } from "~/pages/Root.context";
import ConfirmModal, { ConfirmModalProps } from "~/components/ConfirmModal";
import SubscriptionDetails from "./_components/SubscriptionDetails";
import PaymentDetails from "./_components/PaymentDetails";
import UserProfile from "./_components/UserProfile";

interface ContextProps
  extends AuthContextProps,
    RootContextProps,
    ConfirmModalProps {}

const Account = ({
  api,
  user,
  accounts,
  confirmModal,
}: ContextProps): ReactElement => {
  const history = useHistory();
  const location = useLocation();

  return (
    <div>
      <UserProfile user={user} accounts={accounts} />
      <SubscriptionDetails
        api={api}
        history={history}
        location={location}
        confirmModal={confirmModal}
      />
      <PaymentDetails
        api={api}
        history={history}
        location={location}
        confirmModal={confirmModal}
      />
    </div>
  );
};

export default connect<unknown, ContextProps>(Account, [
  { Context: RootContext, props: ["api"] },
  { Context: AuthContext, props: ["user", "accounts"] },
  { Context: ConfirmModal, props: ["confirmModal"], wrap: true },
]);

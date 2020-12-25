import React, { ReactElement } from "react";
import { RouteChildrenProps } from "react-router-dom";
import { connect } from "~/utils/context";
import Api from "~/utils/api/Api";
import AuthContext from "~/pages/auth/Auth.context";
import RootContext from "~/pages/Root.context";
import ConfirmModal, { TConfirmModal } from "~/components/ConfirmModal";
import SubscriptionDetails from "./_components/SubscriptionDetails";
import PaymentDetails from "./_components/PaymentDetails";

type Props = {
  api: Api;
  user: User;
  confirmModal: TConfirmModal;
} & RouteChildrenProps;

const Account = ({
  api,
  user,
  history,
  location,
  confirmModal
}: Props): ReactElement => {
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

export default connect(Account, [
  { Context: RootContext, props: ["api"] },
  { Context: AuthContext, props: ["user"] },
  { Context: ConfirmModal, props: ["confirmModal"], wrap: true }
]);

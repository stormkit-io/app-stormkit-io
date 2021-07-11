import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "~/utils/context";
import RootContext, { RootContextProps } from "~/pages/Root.context";
import Error404 from "~/components/Errors/Error404";
import { useParseAppId } from "./actions";

const InvitationAccept: React.FC<RootContextProps> = ({
  api,
}): React.ReactElement => {
  const appId = useParseAppId({ api });

  if (appId) {
    return <Redirect to={`/apps/${appId}/team`} />;
  }

  return (
    <Error404>
      The invitation token is invalid. Make sure that the username and provider
      match your login credentials.
    </Error404>
  );
};

export default connect<unknown, RootContextProps>(InvitationAccept, [
  { Context: RootContext, props: ["api"] },
]);

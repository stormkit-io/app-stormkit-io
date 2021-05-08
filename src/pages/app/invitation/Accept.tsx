import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "~/utils/context";
import RootContext from "~/pages/Root.context";
import Error404 from "~/components/Errors/Error404";
import Api from "~/utils/api/Api";
import { useParseAppId } from "./actions";

interface Props {
  api: Api;
}

const InvitationAccept = ({ api }: Props): React.ReactElement => {
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

export default connect(InvitationAccept, [
  { Context: RootContext, props: ["api"] }
]);

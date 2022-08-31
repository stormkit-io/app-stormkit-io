import React from "react";
import { Redirect } from "react-router-dom";
import Error404 from "~/components/Errors/Error404";
import { useParseAppId } from "./actions";

const InvitationAccept: React.FC = (): React.ReactElement => {
  const appId = useParseAppId();

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

export default InvitationAccept;

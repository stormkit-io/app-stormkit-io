import { useContext } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";
import { AuthContext } from "~/pages/auth/Auth.context";
import { isSelfHosted } from "~/utils/helpers/instance";
import SubscriptionDetails from "./_components/SubscriptionDetails";
import UserProfile from "./_components/UserProfile";
import ConnectedAccounts from "./_components/ConnectedAccounts";
import Error404 from "~/components/Errors/Error404";

const isSelfHostedInstance = isSelfHosted();

export default function Account() {
  const { user, accounts } = useContext(AuthContext);

  if (!user) {
    return <Error404 />;
  }

  return (
    <Box sx={{ margin: "0 auto" }} maxWidth="768px">
      {user?.isPaymentRequired && (
        <Alert color="warning" sx={{ mb: 2 }}>
          <AlertTitle fontSize={20}>Upgrade required</AlertTitle>
          <Typography variant="body2" fontSize={14}>
            Stormkit Cloud is a paid service. You can contact us for a free
            trial or self-host it.
          </Typography>
        </Alert>
      )}
      <UserProfile user={user} />
      <ConnectedAccounts accounts={accounts!} />
      <SubscriptionDetails
        user={user}
        isSelfHostedInstance={isSelfHostedInstance}
      />
    </Box>
  );
}

import { useContext, useMemo } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";
import { AuthContext } from "~/pages/auth/Auth.context";
import SubscriptionDetails from "./_components/SubscriptionDetails";
import UserProfile from "./_components/UserProfile";
import ConnectedAccounts from "./_components/ConnectedAccounts";
import Error404 from "~/components/Errors/Error404";

export default function Account() {
  const { user, accounts } = useContext(AuthContext);

  const trialEnds = useMemo(() => {
    if (!user?.freeTrialEnds) {
      return;
    }

    return new Date(user?.freeTrialEnds * 1000).toLocaleDateString("de-CH", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  }, [user?.freeTrialEnds]);

  if (!user) {
    return <Error404 />;
  }

  return (
    <Box sx={{ color: "white", margin: "0 auto" }} maxWidth="768px">
      {trialEnds && (
        <Alert color="info" sx={{ mb: 2 }}>
          <AlertTitle sx={{ fontSize: 20 }}>Free trial</AlertTitle>
          <Typography>
            Thanks for exploring Stormkit.
            {user?.isPaymentRequired
              ? "Your free trial is ended. Please upgrade your subscription to continue."
              : `Your free trial will end on ${trialEnds}. Please upgrade your subscription to continue using our service without interruption.`}
          </Typography>
        </Alert>
      )}
      <UserProfile user={user} />
      <ConnectedAccounts accounts={accounts!} />
      <SubscriptionDetails user={user} />
    </Box>
  );
}

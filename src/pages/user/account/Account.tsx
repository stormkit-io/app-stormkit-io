import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";
import { AuthContext } from "~/pages/auth/Auth.context";
import SubscriptionDetails from "./_components/SubscriptionDetails";
import UserProfile from "./_components/UserProfile";

const Account: React.FC = () => {
  const { user, accounts } = useContext(AuthContext);

  return (
    <Box sx={{ width: "100%" }}>
      {user?.paymentRequired && (
        <Alert color="warning">
          <AlertTitle sx={{ fontSize: 20 }}>Free trial expired</AlertTitle>
          <Typography>
            Thanks for exploring Stormkit. To continue use the service, please
            upgrade your tier.
          </Typography>
        </Alert>
      )}
      <UserProfile user={user!} accounts={accounts!} />
      <SubscriptionDetails />
    </Box>
  );
};

export default Account;

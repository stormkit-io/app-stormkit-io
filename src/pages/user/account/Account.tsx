import { useContext } from "react";
import Box from "@mui/material/Box";
import { AuthContext } from "~/pages/auth/Auth.context";
import UserProfile from "./_components/UserProfile";
import ConnectedAccounts from "./_components/ConnectedAccounts";
import Error404 from "~/components/Errors/Error404";

export default function Account() {
  const { user, accounts, metrics } = useContext(AuthContext);

  if (!user) {
    return <Error404 />;
  }

  return (
    <Box sx={{ margin: "0 auto" }} maxWidth="lg">
      <UserProfile user={user} metrics={metrics} />
      <ConnectedAccounts accounts={accounts!} />
    </Box>
  );
}

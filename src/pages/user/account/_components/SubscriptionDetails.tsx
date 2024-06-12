import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { capitalize } from "@mui/material";
import WhatsIncluded from "./WhatsIncluded";
import Checkout from "./SubscriptionDetailsCheckout";

interface Props {
  user: User;
}

const portalLink = {
  dev: "https://billing.stripe.com/p/login/test_4gw9CvdOF3eabhSeUU",
  prod: "https://billing.stripe.com/p/login/test_4gw9CvdOF3eabhSeUU",
}[process.env.NODE_ENV === "development" ? "dev" : "prod"];

export default function SubscriptionDetails({ user }: Props) {
  const isFree = user.package.id === "free";

  return (
    <Card sx={{ mb: 2 }} contentPadding={!isFree}>
      <CardHeader
        title={isFree ? "Checkout" : "Subscription Details"}
        actions={
          <Chip
            color="warning"
            label={[
              user.package.name,
              user.package.id.startsWith("self-hosted")
                ? capitalize(user.package.edition)
                : "",
            ]
              .filter(i => i)
              .join(" ")}
          />
        }
      />
      <Box sx={{ mb: isFree ? 0 : 4 }}>
        {isFree && <Checkout user={user} />}
        {!isFree && <WhatsIncluded tier={user.package.id} />}
      </Box>

      {!isFree && (
        <CardFooter>
          <Button
            variant="contained"
            color="secondary"
            href={`${portalLink}?prefilled_email=${user.email}`}
          >
            Manage your subscription
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

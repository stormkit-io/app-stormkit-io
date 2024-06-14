import { useSearchParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { capitalize } from "~/utils/helpers/string";
import CopyBox from "~/components/CopyBox";
import WhatsIncluded from "./WhatsIncluded";
import Checkout from "./SubscriptionDetailsCheckout";
import { useFetchLicense } from "../actions";
import { useEffect } from "react";

interface Props {
  user: User;
}

const portalLink = {
  dev: "https://billing.stripe.com/p/login/test_4gw9CvdOF3eabhSeUU",
  prod: "https://billing.stripe.com/p/login/test_4gw9CvdOF3eabhSeUU",
}[process.env.NODE_ENV === "development" ? "dev" : "prod"];

export default function SubscriptionDetails({ user }: Props) {
  const [params, _] = useSearchParams();
  const { license, loading, error } = useFetchLicense({ user });
  const isFree = user.package.id === "free";

  useEffect(() => {
    const paymentSuccess = document.querySelector("#payment-success");

    if (paymentSuccess) {
      paymentSuccess.scrollIntoView?.({ behavior: "smooth" });
    }
  }, []);

  return (
    <Card
      sx={{ mb: 2 }}
      contentPadding={!isFree}
      loading={loading}
      error={error}
    >
      <CardHeader
        title={isFree ? "Checkout" : "Subscription Details"}
        subtitle={[
          user.package.name,
          user.package.id.startsWith("self-hosted")
            ? `${capitalize(user.package.edition)} - ${license?.seats} Seats`
            : "",
        ]
          .filter(i => i)
          .join(" ")}
      />
      {params.get("payment") === "success" && (
        <Alert id="payment-success" color="info" sx={{ mb: 4 }}>
          <Typography>
            Thank you for your order, your tier has been updated.
          </Typography>
        </Alert>
      )}
      <Box sx={{ mb: isFree ? 0 : 4 }}>
        {isFree && <Checkout user={user} />}
        {!isFree && <WhatsIncluded tier={user.package.id} />}
      </Box>
      {license && (
        <Card>
          <CardHeader
            title="License"
            subtitle="Set the `STORMKIT_LICENSE` environment variable in your self-hosted environment to the following value:"
          />
          <CopyBox value={license.key} />
        </Card>
      )}

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

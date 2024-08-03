import { useSearchParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/lab/LoadingButton";
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

  const isSelfHosted = user.package.id.startsWith("self-hosted");

  return (
    <>
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
            isSelfHosted
              ? `${capitalize(user.package.edition)} - ${
                  license?.seats || "unlimited"
                } seats`
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
      {isSelfHosted && (
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title="License"
            subtitle={
              license &&
              "Set the `STORMKIT_LICENSE` environment variable in your self-hosted environment to the following value:"
            }
          />
          {license && <CopyBox value={license.key} />}
          {!license && (
            <Alert color="warning">
              You seem to have no license key. Contact us through discord or
              email to obtain your license key.
            </Alert>
          )}
        </Card>
      )}
    </>
  );
}

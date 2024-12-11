import { useSearchParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/lab/LoadingButton";
import Link from "@mui/material/Link";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { capitalize } from "~/utils/helpers/string";
import CopyBox from "~/components/CopyBox";
import WhatsIncluded from "./WhatsIncluded";
import Checkout from "./SubscriptionDetailsCheckout";
import { useFetchLicense } from "../actions";
import { useEffect, useMemo } from "react";

interface Props {
  user: User;
  isSelfHostedInstance: boolean;
}

const portalLink = {
  dev: "https://billing.stripe.com/p/login/test_4gw9CvdOF3eabhSeUU",
  prod: "https://billing.stripe.com/p/login/aEU5kX4AmaTq3u0dQQ",
}[process.env.NODE_ENV === "development" ? "dev" : "prod"];

export default function SubscriptionDetails({
  user,
  isSelfHostedInstance,
}: Props) {
  const [params, _] = useSearchParams();
  const { license, loading, error } = useFetchLicense({
    user,
    isSelfHostedInstance,
  });

  const isFree = user.package.id === "free";

  useEffect(() => {
    const paymentSuccess = document.querySelector("#payment-success");

    if (paymentSuccess) {
      paymentSuccess.scrollIntoView?.({ behavior: "smooth" });
    }
  }, []);

  const isSelfHostedMembership = user.package.id.startsWith("self-hosted");

  const seats = useMemo(() => {
    if (!isSelfHostedMembership) {
      return "";
    }

    if (user.package?.edition === "premium") {
      return `${String(license?.seats) || "unlimited"} seats`;
    }

    if (license && license.seats > 1) {
      return `${license.seats} seats`;
    }

    return "1 seat";
  }, [user, license, isSelfHostedMembership]);

  if (isSelfHostedInstance) {
    return (
      <Card
        sx={{ mb: 2 }}
        info={
          <>
            Visit your Cloud Account on{" "}
            <Link href="https://app.stormkit.io" target="_blank">
              app.stormkit.io
            </Link>{" "}
            to manage your subscription.
          </>
        }
      >
        <CardHeader title="Subscription Details" />
        <CardFooter />
      </Card>
    );
  }

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
            isSelfHostedMembership
              ? `${capitalize(user.package.edition)} - ${seats}`
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
      {isSelfHostedMembership && (
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title="License"
            subtitle={
              license &&
              "Set the `STORMKIT_LICENSE` environment variable in your self-hosted environment to the following value:"
            }
          />
          {license && <CopyBox value={license.raw} />}
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

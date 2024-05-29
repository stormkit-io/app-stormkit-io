import { useEffect, useState, useContext, useMemo } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import WarningIcon from "@mui/icons-material/Warning";
import Container from "~/components/Container";
import { AuthContext } from "~/pages/auth/Auth.context";
import { fetchCheckoutEndpoint } from "../actions";
import { SubscriptionName } from "../actions/fetch_subscriptions";
import PricingSlider, { SubscriptionTier, WhatsIncluded } from "./Pricing";
import { Typography } from "@mui/material";

const paymentLinks: Record<"dev" | "prod", Record<SubscriptionTier, string>> = {
  dev: {
    "100": "https://buy.stripe.com/test_fZe29G3W0aMDerefYY",
    "500": "https://buy.stripe.com/test_cN26pWdwAg6X2IwbIJ",
    "1000": "https://buy.stripe.com/test_bIY3dK0JOaMD6YM6oq",
    "1000+": "", // contact us
  },
  prod: {
    "1000": "https://buy.stripe.com/8wMeY2bjh8JJ3E43ce",
    "500": "https://buy.stripe.com/cN23fk3QPbVVdeEdQR",
    "100": "https://buy.stripe.com/8wM2bgfzx8JJ4I88ww",
    "1000+": "", // contact us
  },
};

function paymentLink(tier: SubscriptionTier) {
  if (process.env.NODE_ENV === "development") {
    return paymentLinks.dev[tier];
  }

  return paymentLinks.prod[tier];
}

const subscriptionToTier: Record<SubscriptionName, SubscriptionTier> = {
  starter: "100",
  medium: "500",
  enterprise: "1000",
  free: "100", // This is here for typescript, or for existing customers who're not in a trial
};

const SubscriptionDetails: React.FC = (): React.ReactElement => {
  const { user } = useContext(AuthContext);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [tier, setTier] = useState<SubscriptionTier>("100");

  const freeTrialEnds = useMemo(() => {
    if (user?.freeTrialEnds) {
      return new Date(user.freeTrialEnds * 1000).toLocaleDateString("en", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
    }
  }, [user?.freeTrialEnds]);

  const subscriptionTier = subscriptionToTier[user?.package.id || "free"];

  useEffect(() => {
    setTier(subscriptionTier);
  }, [subscriptionTier]);

  return (
    <Container>
      <Box sx={{ p: 2, mb: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 400,
            fontSize: 16,
            mb: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Subscription
          {
            <Chip
              color="warning"
              label={
                "Current: " +
                (user?.package?.id === "free"
                  ? `Free trial${user?.isPaymentRequired ? " expired" : ""}`
                  : `up to ${subscriptionTier} deployments`)
              }
            />
          }
        </Typography>
        {freeTrialEnds && (
          <Typography
            sx={{
              mb: 2,
              bgcolor: "rgba(0,0,0,0.1)",
              p: 2,
              display: "flex",
              alignItems: "center",
              opacity: 0.7,
            }}
          >
            <WarningIcon sx={{ mr: 2 }} />
            Your free trial is scheduled to conclude on {freeTrialEnds}. If you
            want more time to explore don't hesitate to reach out. We're more
            than happy to extend your trial! If there's a specific feature
            you're excited to see in the future, let us know. We're here to
            listen and make your experience with Stormkit even better.
          </Typography>
        )}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ bgcolor: "rgba(0,0,0,0.1)", p: 4 }}>
            <PricingSlider
              tier={subscriptionTier}
              onTierChange={t => setTier(t)}
            />
          </Box>
          <Box sx={{ mt: 4, mb: 8 }}>
            <WhatsIncluded tier={tier} />
          </Box>
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <LoadingButton
              onClick={e => {
                e.preventDefault();
                setCheckoutLoading(true);
                fetchCheckoutEndpoint(tier).then(url => {
                  window.location.assign(url);
                });
              }}
              href={`${paymentLink(tier)}?client_reference_id=${
                user?.id
              }&prefilled_email=${user?.email}`}
              disabled={tier === "1000+"}
              loading={checkoutLoading}
              color="secondary"
              variant="contained"
              sx={{
                ":hover": {
                  color: "white !important",
                },
              }}
            >
              Go to Stripe Customer Portal
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SubscriptionDetails;

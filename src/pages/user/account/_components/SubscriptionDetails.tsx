import { useEffect, useState, useContext } from "react";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBoxV2";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "~/components/Container";
import { AuthContext } from "~/pages/auth/Auth.context";
import { useFetchSubscription, fetchCheckoutEndpoint } from "../actions";
import { SubscriptionName, ActivePlan } from "../actions/fetch_subscriptions";
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
  if (process.env.STORMKIT_ENV === "local") {
    return paymentLinks.dev[tier];
  }

  return paymentLinks.prod[tier];
}

type SubscriptionDowngradePros = {
  activePlan: ActivePlan;
};

const SubscriptionDowngrade: React.FC<SubscriptionDowngradePros> = ({
  activePlan,
}) => {
  return (
    <InfoBox type="default" className="mb-4">
      Your current subscription will end on{" "}
      {new Date(activePlan.trial_end * 1000).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      })}
      . After that you'll be downgraded to <b>{activePlan.plan.nickname}</b>{" "}
      package.
    </InfoBox>
  );
};

const subscriptionToTier: Record<SubscriptionName, SubscriptionTier> = {
  starter: "100",
  medium: "500",
  enterprise: "1000",
  free: "100", // This is here for typescript, or for existing customers who're not in a trial
};

const SubscriptionDetails: React.FC = (): React.ReactElement => {
  const { user } = useContext(AuthContext);
  const { loading, error, subscription } = useFetchSubscription();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [tier, setTier] = useState<SubscriptionTier>("100");

  useEffect(() => {
    if (subscription?.name) {
      setTier(subscriptionToTier[subscription.name]);
    }
  }, [subscription?.name]);

  const activePlan = subscription?.activePlans?.[0];

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
          {!loading && (
            <Chip
              color="primary"
              label={
                "Current: " +
                (subscription?.name === "free"
                  ? "Free trial"
                  : `up to ${
                      subscriptionToTier[subscription?.name || "free"]
                    } deployments`)
              }
            />
          )}
        </Typography>
        {loading && <Spinner width={6} height={6} primary />}
        {!loading && error && <InfoBox type="error">{error}</InfoBox>}
        {!loading && !error && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {activePlan?.status === "trialing" && (
              <SubscriptionDowngrade activePlan={activePlan} />
            )}
            <Box sx={{ bgcolor: "rgba(0,0,0,0.1)", p: 4 }}>
              <PricingSlider
                tier={subscriptionToTier[subscription?.name || "free"]}
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
        )}
      </Box>
    </Container>
  );
};

export default SubscriptionDetails;

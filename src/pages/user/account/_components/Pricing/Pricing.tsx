import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PricingSlider, { SubscriptionTier } from "./Slider";
import WhatsIncluded from "./WhatsIncluded";

export default function Pricing() {
  const [tier, setTier] = useState<SubscriptionTier>("100");

  return (
    <>
      <Box>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 600,
            fontSize: { xs: 24, md: 48 },
            textAlign: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          Simple, usage based pricing
        </Typography>
        <Typography
          variant="h3"
          sx={{
            mt: 1,
            fontSize: { xs: 16, md: 20 },
            textAlign: "center",
            opacity: 0.7,
          }}
        >
          15 days free trial. No credit card required.
        </Typography>
      </Box>
      <Box
        id="pricing"
        sx={{
          p: { xs: 2, md: 4 },
          mt: { xs: 8, md: 12 },
          mx: "auto",
          width: "100%",
          bgcolor: "rgba(0,0,0,0.1)",
        }}
      >
        <PricingSlider onTierChange={t => setTier(t)} />
        <WhatsIncluded tier={tier} />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 5 }}
          href="https://app.stormkit.io"
        >
          Start your free trial
        </Button>
      </Box>
    </>
  );
}

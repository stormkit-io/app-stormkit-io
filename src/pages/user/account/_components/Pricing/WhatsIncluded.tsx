import type { SubscriptionTier } from "./Slider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";

const limits: Record<SubscriptionTier, { fns: string; bandwidth: string }> = {
  "100": {
    fns: "2.5m",
    bandwidth: "500GB",
  },
  "500": {
    fns: "5m",
    bandwidth: "1TB",
  },
  "1000": {
    fns: "10m",
    bandwidth: "2TB",
  },
  "1000+": {
    fns: "∞",
    bandwidth: "∞",
  },
};

const includedFeatures = [
  "Unlimited projects",
  (tier: SubscriptionTier) => `${limits[tier].fns} Serverless invocations`,
  (tier: SubscriptionTier) => `${limits[tier].bandwidth} Bandwidth`,
  "All free tiers",
  "30 days deployment retention",
  "Discord / Email support",
];

export default function WhatsIncluded({ tier }: { tier: SubscriptionTier }) {
  return (
    <>
      <Typography variant="h2" sx={{ fontSize: 16, mt: 4 }}>
        What's included?
      </Typography>
      <Box sx={{ display: "flex", mt: 2 }}>
        <Grid
          container
          sx={{ width: "100%", textAlign: "left" }}
          rowSpacing={{ xs: 2 }}
        >
          {includedFeatures.map((feature, index) => (
            <Grid
              key={index}
              item
              xs={12}
              md={6}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <CheckIcon sx={{ fill: "green", mr: 2, ml: 0 }} />{" "}
              {typeof feature === "string" ? feature : feature(tier)}
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CheckIcon from "@mui/icons-material/Check";

const limits: Record<SubscriptionName, { fns: string; bandwidth: string }> = {
  free: {
    fns: "500k",
    bandwidth: "50GB",
  },
  starter: {
    fns: "2.5m",
    bandwidth: "500GB",
  },
  medium: {
    fns: "5m",
    bandwidth: "1TB",
  },
  enterprise: {
    fns: "10m",
    bandwidth: "2TB",
  },
  "self-hosted": {
    fns: "Unlimited",
    bandwidth: "Unlimited",
  },
  "self-hosted-premium": {
    fns: "Unlimited",
    bandwidth: "Unlimited",
  },
};

interface Feature {
  text: string;
  included: boolean;
}

export const includedFeatures = (tier: SubscriptionName) => {
  const shared: Feature[] = [
    { included: true, text: "Unlimited seats" },
    { included: true, text: "Unlimited teams" },
    {
      included: true,
      text: `${limits[tier]?.fns || limits.starter.fns} serverless invocations`,
    },
    { included: true, text: "Unlimited projects" },
    {
      included: true,
      text: `${limits[tier]?.bandwidth || limits.starter.bandwidth} bandwidth`,
    },
    { included: true, text: "30 days deployment retention" },
  ];

  if (tier.startsWith("self-hosted")) {
    return [
      {
        included: true,
        text: "Unlimited usage",
      },
      {
        included: true,
        text: tier === "self-hosted" ? "Up to 5 seats" : "Unlimited seats",
      },
      {
        included: tier === "self-hosted-premium",
        text: "Analytics",
      },
      {
        included: tier === "self-hosted-premium",
        text: "Audit Logs",
      },
      // {
      //   included: tier === "self-hosted-premium",
      //   text: "Prerendering",
      // },
      {
        included: tier === "self-hosted-premium",
        text: "IP Limiting",
      },
      {
        included: tier === "self-hosted-premium",
        text: "Premium support",
      },
      {
        included: tier === "self-hosted-premium",
        text: "Custom features",
      },
    ];
  }

  return [...shared, { included: true, text: "All features" }];
};

export default function WhatsIncluded({ tier }: { tier: SubscriptionName }) {
  return (
    <Box sx={{ display: "flex", mt: 2 }}>
      <Grid
        container
        sx={{ width: "100%", textAlign: "left" }}
        rowSpacing={{ xs: 2 }}
      >
        {includedFeatures(tier).map((feature, index) => (
          <Grid
            key={index}
            item
            xs={12}
            md={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <CheckIcon sx={{ fill: "green", mr: 2, ml: 0 }} /> {feature.text}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

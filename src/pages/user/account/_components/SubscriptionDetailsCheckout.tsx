import { useState } from "react";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import CheckIcon from "@mui/icons-material/Check";
import XIcon from "@mui/icons-material/Close";
import MultiSelect from "~/components/MultiSelect";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { includedFeatures } from "./WhatsIncluded";

const paymentLinks: Record<SubscriptionName, string> = {
  dev: {
    free: "",
    starter: "https://buy.stripe.com/test_8wM01ycsw5sj3MA009",
    medium: "https://buy.stripe.com/test_00g6pW3W06wn6YM8wE",
    enterprise: "https://buy.stripe.com/test_6oE5lS8cg8Evcj6cMT",
    "self-hosted": "https://buy.stripe.com/test_5kAaGc648g6X82QaER",
  },
  prod: {
    free: "",
    starter: "https://buy.stripe.com/9AQbLQafd1hh0rS3ck",
    medium: "https://buy.stripe.com/5kA5ns7317FFgqQdQX",
    enterprise: "https://buy.stripe.com/4gw17cbjhe43eiIbIO",
    "self-hosted": "https://buy.stripe.com/6oEg26cnlcZZeiIeUZ",
  },
}[process.env.NODE_ENV === "development" ? "dev" : "prod"];

const prices: Record<SubscriptionName, number> = {
  free: 0,
  starter: 20,
  medium: 75,
  enterprise: 150,
  "self-hosted": 39,
};

interface Props {
  user: User;
}

type Edition = "limited" | "premium";

export default function Checkout({ user }: Props) {
  const [packageName, setPackageName] = useState<SubscriptionName>("starter");
  const [edition, setEdition] = useState<Edition>("limited");

  return (
    <Box sx={{ color: "white", margin: "0 auto" }} maxWidth="768px">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridAutoRows: "1fr",
          columnGap: 2,
        }}
      >
        <Card
          sx={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardHeader
            title="Self-Hosted Edition"
            subtitle={`Host Stormkit on your own servers, ensuring complete control and security of your data. Perfect for teams requiring flexibility, scalability, and compliance with internal policies.`}
          />
          <Box sx={{ mb: 4, flex: 1 }}>
            <Box sx={{ display: "flex", mb: 2 }}>
              {edition === "limited" ? (
                <>
                  <Typography fontSize={28} sx={{ mr: 2 }}>
                    ${prices["self-hosted"]}
                  </Typography>
                  <Typography sx={{ mb: 2, color: grey[500] }}>
                    per user
                    <br />
                    month
                  </Typography>
                </>
              ) : (
                <Typography sx={{ pt: 0, pb: 2 }}>
                  Contact us at sales@stormkit.io to find the most suitable plan
                  for your organization.
                </Typography>
              )}
            </Box>
            <MultiSelect
              variant="outlined"
              selected={[edition]}
              sx={{ color: "white" }}
              items={[
                { text: "Limited Edition", value: "limited" },
                { text: "Premium Edition", value: "premium" },
              ]}
              multiple={false}
              onSelect={i => setEdition(i[0] as Edition)}
            />
            <Box sx={{ mt: 4 }}>
              {includedFeatures("self-hosted", edition).map(feature => (
                <Box sx={{ mb: 1 }} key={feature.text}>
                  {feature.included ? (
                    <CheckIcon sx={{ fill: "green", mr: 2, ml: 0 }} />
                  ) : (
                    <XIcon sx={{ fill: "red", mr: 2, ml: 0 }} />
                  )}{" "}
                  {feature.text}
                </Box>
              ))}
            </Box>
          </Box>
          <CardFooter sx={{ textAlign: "center" }}>
            {edition === "limited" ? (
              <Button
                variant="contained"
                color="secondary"
                sx={{ px: 6 }}
                href={`${paymentLinks["self-hosted"]}?prefilled_email=${user?.email}`}
              >
                Go to portal
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                sx={{ px: 6 }}
                href="mailto:sales@stormkit.io?subject=About%20Self-Hosted%20Premium%20Edition"
              >
                Contact us
              </Button>
            )}
          </CardFooter>
        </Card>
        <Card sx={{ flex: 1, height: "100%" }}>
          <CardHeader
            title="Cloud Edition"
            subtitle={`Host your applications on Stormkit's powerful infrastructure, ensuring a high quality serverless environment. Perfect for teams requiring speed, and scalability.`}
          />
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography fontSize={28} sx={{ mr: 2 }}>
                ${prices[packageName]}
              </Typography>
              <Typography sx={{ mb: 2, color: grey[500] }}>
                per
                <br />
                month
              </Typography>
            </Box>
            <MultiSelect
              variant="outlined"
              selected={[packageName]}
              sx={{ color: "white" }}
              items={[
                { text: "Up to 100 deployments per month", value: "starter" },
                { text: "Up to 500 deployments per month", value: "medium" },
                {
                  text: "Up to 1000 deployments per month",
                  value: "enterprise",
                },
              ]}
              multiple={false}
              onSelect={i => setPackageName(i[0] as SubscriptionName)}
            />
            <Box sx={{ mt: 4 }}>
              {includedFeatures(packageName).map(feature => (
                <Box sx={{ mb: 1 }} key={feature.text}>
                  <CheckIcon sx={{ fill: "green", mr: 2, ml: 0 }} />{" "}
                  {feature.text}
                </Box>
              ))}
            </Box>
          </Box>
          <CardFooter sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ px: 6 }}
              href={`${paymentLinks[packageName]}?prefilled_email=${user?.email}`}
            >
              Go to portal
            </Button>
          </CardFooter>
        </Card>
      </Box>
    </Box>
  );
}

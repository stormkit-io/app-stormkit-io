import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import XIcon from "@mui/icons-material/Close";
import MultiSelect from "~/components/MultiSelect";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { includedFeatures } from "./WhatsIncluded";

type SubName = SubscriptionName | "self-hosted-premium";

const paymentLinks: Record<SubName, string> = {
  dev: {
    free: "",
    starter: "https://buy.stripe.com/test_8wM01ycsw5sj3MA009",
    medium: "https://buy.stripe.com/test_00g6pW3W06wn6YM8wE",
    enterprise: "https://buy.stripe.com/test_6oE5lS8cg8Evcj6cMT",
    "self-hosted": "https://buy.stripe.com/test_5kAaGc648g6X82QaER",
    "self-hosted-premium": "https://buy.stripe.com/test_7sI01y78c6wn2IwfZ9",
  },
  prod: {
    free: "",
    starter: "https://buy.stripe.com/cN25m44aK15OdmUfYZ",
    medium: "https://buy.stripe.com/28o3dW6iSaGo2Ig3cc",
    enterprise: "https://buy.stripe.com/fZe9CkdLk3dWeqYeUW",
    "self-hosted": "https://buy.stripe.com/aEU7uccHgeWEfv28wz",
    "self-hosted-premium": "https://buy.stripe.com/eVacOwbDc3dW2IgdQU",
  },
}[process.env.NODE_ENV === "development" ? "dev" : "prod"];

const prices: Record<SubName, number> = {
  free: 0,
  starter: 20,
  medium: 75,
  enterprise: 150,
  "self-hosted": 39,
  "self-hosted-premium": 100,
};

interface Props {
  user: User;
}

type Edition = "limited" | "premium";

export default function Checkout({ user }: Props) {
  const [packageName, setPackageName] = useState<SubscriptionName>("starter");
  const [edition, setEdition] = useState<Edition>("limited");

  return (
    <Box sx={{ margin: "0 auto" }} maxWidth="768px">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridAutoRows: "1fr",
          columnGap: 2,
        }}
      >
        <Card
          contentPadding={false}
          sx={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <CardHeader
            title="Self-Hosted Edition"
            subtitle={`Host Stormkit on your own servers, ensuring complete control and security of your data. Perfect for teams requiring flexibility, scalability, and compliance with internal policies.`}
            sx={{ px: 0 }}
          />
          <Box>
            <Box sx={{ mb: 4, flex: 1 }}>
              <Box sx={{ display: "flex", mb: 2 }}>
                <>
                  <Typography fontSize={28} sx={{ mr: 2 }}>
                    $
                    {edition === "limited"
                      ? prices["self-hosted"]
                      : prices["self-hosted-premium"]}
                  </Typography>
                  <Typography sx={{ mb: 2, color: "text.secondary" }}>
                    per user
                    <br />
                    month
                  </Typography>
                </>
              </Box>
              <MultiSelect
                variant="outlined"
                selected={[edition]}
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
                    <Typography component="span">{feature.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <CardFooter sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ px: 6 }}
              href={`${
                paymentLinks[
                  edition === "limited" ? "self-hosted" : "self-hosted-premium"
                ]
              }?prefilled_email=${user?.email}`}
            >
              Go to portal
            </Button>
          </CardFooter>
        </Card>
        <Card contentPadding={false} sx={{ flex: 1, height: "100%" }}>
          <CardHeader
            sx={{ px: 0 }}
            title="Cloud Edition"
            subtitle={`Host your applications on Stormkit's powerful infrastructure, ensuring a high quality serverless environment. Perfect for teams requiring speed, and scalability.`}
          />
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography fontSize={28} sx={{ mr: 2 }}>
                ${prices[packageName]}
              </Typography>
              <Typography sx={{ mb: 2, color: "text.secondary" }}>
                per
                <br />
                month
              </Typography>
            </Box>
            <MultiSelect
              variant="outlined"
              selected={[packageName]}
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
                  <Typography component="span">{feature.text}</Typography>
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
